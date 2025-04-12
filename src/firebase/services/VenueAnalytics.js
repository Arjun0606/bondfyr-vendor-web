import { ref, onValue, set, push } from 'firebase/database';
import { rtdb } from '../firebase';

export class VenueAnalytics {
  static async subscribeToRealTimeStats(callback) {
    const analyticsRef = ref(rtdb, 'venue_analytics');
    return onValue(analyticsRef, (snapshot) => {
      const data = snapshot.val() || {};
      callback({
        currentOccupancy: data.current_occupancy || 0,
        genderRatio: data.gender_ratio || { male: 0, female: 0, other: 0 },
        couplesCount: data.couples_count || 0,
        hourlyCheckins: Object.entries(data)
          .filter(([key]) => key.startsWith('hourly_checkins_'))
          .reduce((acc, [key, value]) => ({
            ...acc,
            [key.replace('hourly_checkins_', '')]: value
          }), {}),
      });
    });
  }

  static async trackSecurityIncident(incidentData) {
    const {
      guestId,
      type,
      description,
      staffMember,
      severity,
      action,
    } = incidentData;

    const securityRef = ref(rtdb, 'security_incidents');
    await push(securityRef, {
      guestId,
      type,
      description,
      staffMember,
      severity,
      action,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackPRPerformance(prCode) {
    const prRef = ref(rtdb, `pr_analytics/${prCode}`);
    
    return new Promise((resolve) => {
      onValue(prRef, (snapshot) => {
        const data = snapshot.val() || {};
        const hourlyStats = {};
        const currentHour = new Date().getHours();

        // Update hourly stats
        set(prRef, {
          ...data,
          total_guests: (data.total_guests || 0) + 1,
          [`hourly_guests_${currentHour}`]: (data[`hourly_guests_${currentHour}`] || 0) + 1,
        });

        resolve({
          totalGuests: data.total_guests,
          hourlyStats,
        });
      }, { onlyOnce: true });
    });
  }

  static async getPhotoContestStats() {
    const photoRef = ref(rtdb, 'photo_contest');
    
    return new Promise((resolve) => {
      onValue(photoRef, (snapshot) => {
        const data = snapshot.val() || {};
        resolve({
          totalPhotos: data.total_photos || 0,
          totalVotes: data.total_votes || 0,
          topPhotos: data.top_photos || [],
          engagementRate: data.total_votes / (data.total_photos || 1),
        });
      }, { onlyOnce: true });
    });
  }

  static async trackNotificationEngagement(notificationData) {
    const { userId, notificationType, action } = notificationData;
    const notificationRef = ref(rtdb, `notification_analytics/${notificationType}`);
    
    return new Promise((resolve) => {
      onValue(notificationRef, (snapshot) => {
        const data = snapshot.val() || {};
        set(notificationRef, {
          ...data,
          total_sent: (data.total_sent || 0) + 1,
          [`${action}_count`]: (data[`${action}_count`] || 0) + 1,
        });
        resolve(true);
      }, { onlyOnce: true });
    });
  }

  static async getStaffPerformance(staffId) {
    const staffRef = ref(rtdb, `staff_analytics/${staffId}`);
    
    return new Promise((resolve) => {
      onValue(staffRef, (snapshot) => {
        const data = snapshot.val() || {};
        resolve({
          totalScans: data.total_scans || 0,
          averageProcessingTime: data.average_processing_time || 0,
          issuesResolved: data.issues_resolved || 0,
          lastActive: data.last_active || null,
        });
      }, { onlyOnce: true });
    });
  }
} 