import { doc, collection, addDoc, updateDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, set, onValue } from 'firebase/database';
import { db, rtdb } from '../firebase';

export class Ticket {
  static collectionName = 'tickets';
  
  static async create(ticketData) {
    const {
      guestId,
      ticketType,
      ticketSource,
      entryType,
      groupSize,
      genderBreakdown,
      isCouple,
      coverCharge,
      razorpayTransactionId,
      prCode,
      prName,
    } = ticketData;

    if (!guestId || !ticketType) {
      throw new Error('Missing required fields');
    }

    const ticketRef = await addDoc(collection(db, this.collectionName), {
      guestId,
      ticketType,
      ticketSource,
      entryType,
      groupSize,
      genderBreakdown,
      isCouple,
      coverCharge,
      razorpayTransactionId,
      prCode,
      prName,
      status: 'issued',
      isCheckedIn: false,
      checkInTime: null,
      checkInStaff: null,
      isDuplicate: false,
      isRejected: false,
      rejectionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update real-time counters
    await this.updateRealtimeCounters(ticketData);

    return ticketRef.id;
  }

  static async checkIn(ticketId, staffMember) {
    const ticketRef = doc(db, this.collectionName, ticketId);
    const ticketSnap = await getDoc(ticketRef);
    
    if (!ticketSnap.exists()) {
      throw new Error('Ticket not found');
    }

    const ticketData = ticketSnap.data();
    if (ticketData.isCheckedIn) {
      throw new Error('Ticket already checked in');
    }

    await updateDoc(ticketRef, {
      isCheckedIn: true,
      checkInTime: new Date(),
      checkInStaff: staffMember,
      status: 'checked_in',
      updatedAt: new Date(),
    });

    // Update real-time venue analytics
    await this.updateVenueAnalytics(ticketData);
  }

  static async updateRealtimeCounters(ticketData) {
    const counterRef = ref(rtdb, 'counters/tickets');
    const { ticketType, entryType, prCode } = ticketData;

    onValue(counterRef, (snapshot) => {
      const data = snapshot.val() || {};
      set(counterRef, {
        ...data,
        [ticketType]: (data[ticketType] || 0) + 1,
        [`${entryType}_count`]: (data[`${entryType}_count`] || 0) + 1,
        [`pr_${prCode}`]: (data[`pr_${prCode}`] || 0) + 1,
        total: (data.total || 0) + 1,
      });
    }, { onlyOnce: true });
  }

  static async updateVenueAnalytics(ticketData) {
    const analyticsRef = ref(rtdb, 'venue_analytics');
    const { groupSize, genderBreakdown, isCouple } = ticketData;

    onValue(analyticsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const currentTime = new Date().getHours();
      
      set(analyticsRef, {
        ...data,
        current_occupancy: (data.current_occupancy || 0) + groupSize,
        [`hourly_checkins_${currentTime}`]: (data[`hourly_checkins_${currentTime}`] || 0) + 1,
        gender_ratio: {
          male: (data.gender_ratio?.male || 0) + (genderBreakdown.male || 0),
          female: (data.gender_ratio?.female || 0) + (genderBreakdown.female || 0),
          other: (data.gender_ratio?.other || 0) + (genderBreakdown.other || 0),
        },
        couples_count: isCouple ? (data.couples_count || 0) + 1 : (data.couples_count || 0),
      });
    }, { onlyOnce: true });
  }

  static async getVenueAnalytics() {
    const analyticsRef = ref(rtdb, 'venue_analytics');
    return new Promise((resolve) => {
      onValue(analyticsRef, (snapshot) => {
        resolve(snapshot.val());
      }, { onlyOnce: true });
    });
  }
} 