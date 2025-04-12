// Event configuration service to manage event settings and pricing tiers
class EventConfigService {
  constructor() {
    // In a real app, these would be fetched from a backend
    this.events = new Map();
  }

  // Create or update an event configuration
  setEventConfig(eventId, config) {
    const eventConfig = {
      id: eventId,
      name: config.name,
      date: config.date,
      pricingTiers: config.pricingTiers || [],
      coverChargeType: config.coverChargeType || 'fixed', // 'fixed', 'redeemable', 'free_before'
      coverChargeRedeemableAmount: config.coverChargeRedeemableAmount || 0,
      freeEntryBeforeTime: config.freeEntryBeforeTime || '',
      gracePeriodMinutes: config.gracePeriodMinutes || 15,
      groupBookingEnabled: config.groupBookingEnabled || true,
      maxGroupSize: config.maxGroupSize || 10,
    };

    this.events.set(eventId, eventConfig);
    return eventConfig;
  }

  // Get event configuration
  getEventConfig(eventId) {
    return this.events.get(eventId);
  }

  // Calculate applicable price tier based on check-in time
  calculatePriceTier(eventId, checkInTime) {
    const event = this.events.get(eventId);
    if (!event) return null;

    const checkInDateTime = new Date(`2024-01-01 ${checkInTime}`);
    
    // Sort tiers by start time
    const sortedTiers = [...event.pricingTiers].sort((a, b) => {
      const timeA = new Date(`2024-01-01 ${a.startTime}`);
      const timeB = new Date(`2024-01-01 ${b.startTime}`);
      return timeA - timeB;
    });

    // Find applicable tier
    for (let i = sortedTiers.length - 1; i >= 0; i--) {
      const tier = sortedTiers[i];
      const tierTime = new Date(`2024-01-01 ${tier.startTime}`);
      if (checkInDateTime >= tierTime) {
        return tier;
      }
    }

    // If no tier found and there's a free entry before time
    if (event.coverChargeType === 'free_before' && event.freeEntryBeforeTime) {
      const freeEntryTime = new Date(`2024-01-01 ${event.freeEntryBeforeTime}`);
      if (checkInDateTime <= freeEntryTime) {
        return { price: 0, startTime: '00:00', name: 'Free Entry' };
      }
    }

    return sortedTiers[0]; // Default to first tier
  }

  // Calculate surcharge for late check-in
  calculateSurcharge(eventId, originalTier, newCheckInTime) {
    const newTier = this.calculatePriceTier(eventId, newCheckInTime);
    if (!newTier || !originalTier) return 0;
    return Math.max(0, newTier.price - originalTier.price);
  }

  // Check if check-in time is within grace period
  isWithinGracePeriod(eventId, bookingTime, checkInTime) {
    const event = this.events.get(eventId);
    if (!event) return false;

    const bookingDateTime = new Date(`2024-01-01 ${bookingTime}`);
    const checkInDateTime = new Date(`2024-01-01 ${checkInTime}`);
    const gracePeriod = event.gracePeriodMinutes * 60 * 1000; // Convert to milliseconds

    return (checkInDateTime - bookingDateTime) <= gracePeriod;
  }
}

export const eventConfigService = new EventConfigService();

// Example usage:
/*
eventConfigService.setEventConfig('event123', {
  name: 'Saturday Night Party',
  date: '2024-01-20',
  pricingTiers: [
    { startTime: '21:30', price: 500, name: 'Early Night' },
    { startTime: '22:45', price: 800, name: 'Peak Hours' }
  ],
  coverChargeType: 'redeemable',
  coverChargeRedeemableAmount: 300,
  freeEntryBeforeTime: '21:00',
  gracePeriodMinutes: 15,
  groupBookingEnabled: true,
  maxGroupSize: 6
});
*/ 