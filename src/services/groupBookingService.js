import { eventConfigService } from './eventConfigService';

class GroupBookingService {
  constructor() {
    // In a real app, these would be stored in a database
    this.bookings = new Map();
    this.checkIns = new Map();
  }

  // Create a new group booking
  createGroupBooking(eventId, bookingDetails) {
    const { hostName, groupSize, bookingTime } = bookingDetails;
    
    // Get event config and validate
    const eventConfig = eventConfigService.getEventConfig(eventId);
    if (!eventConfig || !eventConfig.groupBookingEnabled) {
      throw new Error('Group booking not available for this event');
    }
    if (groupSize > eventConfig.maxGroupSize) {
      throw new Error(`Maximum group size is ${eventConfig.maxGroupSize}`);
    }

    // Calculate initial pricing tier
    const initialTier = eventConfigService.calculatePriceTier(eventId, bookingTime);
    if (!initialTier) {
      throw new Error('Invalid booking time');
    }

    // Generate booking ID (in real app, use UUID or similar)
    const bookingId = `booking_${Date.now()}`;

    // Create group members
    const groupMembers = [{
      id: 1,
      name: `${hostName} (Host)`,
      isHost: true,
      checkedIn: false,
      checkInTime: null,
      originalTier: initialTier,
      surcharge: 0,
      surchargePaymentStatus: null
    }];

    // Add other group members
    for (let i = 2; i <= groupSize; i++) {
      groupMembers.push({
        id: i,
        name: `Guest ${i-1}`,
        isHost: false,
        checkedIn: false,
        checkInTime: null,
        originalTier: initialTier,
        surcharge: 0,
        surchargePaymentStatus: null
      });
    }

    // Create booking record
    const booking = {
      id: bookingId,
      eventId,
      hostName,
      groupSize,
      bookingTime,
      originalTier: initialTier,
      groupMembers,
      qrCode: this.generateQRCode(bookingId),
      status: 'active'
    };

    this.bookings.set(bookingId, booking);
    return booking;
  }

  // Process check-in for group members
  processCheckIn(bookingId, memberIds, checkInTime) {
    const booking = this.bookings.get(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const results = [];
    
    memberIds.forEach(memberId => {
      const member = booking.groupMembers.find(m => m.id === memberId);
      if (!member || member.checkedIn) return;

      // Calculate surcharge if applicable
      const surcharge = eventConfigService.calculateSurcharge(
        booking.eventId,
        member.originalTier,
        checkInTime
      );

      // Update member status
      member.checkedIn = true;
      member.checkInTime = checkInTime;
      member.surcharge = surcharge;
      member.surchargePaymentStatus = surcharge > 0 ? 'pending' : 'none';

      results.push({
        memberId,
        checkInTime,
        surcharge,
        requiresPayment: surcharge > 0
      });
    });

    // Update booking in storage
    this.bookings.set(bookingId, booking);
    
    return results;
  }

  // Generate payment URL for surcharge
  generatePaymentUrl(bookingId, memberId) {
    const booking = this.bookings.get(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const member = booking.groupMembers.find(m => m.id === memberId);
    if (!member || !member.surcharge) {
      throw new Error('No surcharge payment required');
    }

    // In a real app, integrate with Razorpay or similar payment gateway
    return {
      paymentUrl: `https://payment.example.com/pay/${bookingId}/${memberId}`,
      amount: member.surcharge
    };
  }

  // Get booking details by ID
  getBooking(bookingId) {
    return this.bookings.get(bookingId);
  }

  // Get all active bookings for an event
  getEventBookings(eventId) {
    return Array.from(this.bookings.values())
      .filter(booking => booking.eventId === eventId && booking.status === 'active');
  }

  // Generate QR code (mock implementation)
  generateQRCode(bookingId) {
    // In a real app, use a proper QR code generation library
    return `qr_${bookingId}`;
  }

  // Process surcharge payment completion
  processSurchargePayment(bookingId, memberId, paymentId) {
    const booking = this.bookings.get(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const member = booking.groupMembers.find(m => m.id === memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    member.surchargePaymentStatus = 'paid';
    member.surchargePaymentId = paymentId;

    this.bookings.set(bookingId, booking);
    return member;
  }
}

export const groupBookingService = new GroupBookingService();

// Example usage:
/*
const booking = groupBookingService.createGroupBooking('event123', {
  hostName: 'Ravi',
  groupSize: 4,
  bookingTime: '21:35'
});

const checkInResults = groupBookingService.processCheckIn(
  booking.id,
  [1, 2, 3], // Host and 2 guests
  '21:35'
);

// Later, when last guest arrives
const lateCheckIn = groupBookingService.processCheckIn(
  booking.id,
  [4], // Last guest
  '23:00'
);

if (lateCheckIn[0].requiresPayment) {
  const paymentInfo = groupBookingService.generatePaymentUrl(booking.id, 4);
  // Redirect to payment URL
}
*/ 