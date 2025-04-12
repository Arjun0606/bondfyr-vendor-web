import { rtdb } from '../firebase/firebase';
import { ref, onValue, set, push } from 'firebase/database';

class EventManagementService {
  constructor() {
    this.eventsRef = ref(rtdb, 'events');
  }

  // Event Categories and Tags for Analytics
  EVENT_CATEGORIES = {
    MUSIC_GENRES: [
      'Techno', 'House', 'Commercial', 'Hip Hop', 'Bollywood', 
      'Live Band', 'Jazz', 'Rock', 'EDM', 'Multi-Genre'
    ],
    EVENT_TYPES: [
      'Regular Night', 'Special Event', 'Festival', 'Live Performance',
      'Ladies Night', 'Student Night', 'Corporate Event', 'Private Party'
    ],
    CROWD_DEMOGRAPHICS: [
      'College', 'Young Professionals', 'Corporate', 'Tourists',
      'Mixed', 'Age 25-35', 'Age 35+'
    ],
    PRICING_TIERS: [
      'Early Bird', 'Regular', 'VIP', 'VVIP', 'Group Entry',
      'Ladies Entry', 'Couple Entry', 'Stag Entry'
    ],
    TIME_SLOTS: [
      'Happy Hours (4-8 PM)', 'Evening (8-11 PM)', 
      'Night (11 PM-1 AM)', 'Late Night (1-3 AM)'
    ]
  };

  async createEvent(eventData) {
    try {
      const newEventRef = push(this.eventsRef);
      const event = {
        ...eventData,
        created_at: Date.now(),
        analytics: {
          music_genre: [],
          event_type: '',
          target_demographics: [],
          peak_hours: [],
          revenue_by_tier: {},
          attendance_by_tier: {},
          gender_ratio: { male: 0, female: 0 },
          age_groups: {},
          pr_performance: {},
          table_bookings: [],
          bar_sales_timeline: [],
          entry_timeline: [],
          social_media_impact: {
            instagram_views: 0,
            story_interactions: 0,
            ticket_conversions: 0
          }
        }
      };
      await set(newEventRef, event);
      return newEventRef.key;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEventAnalytics(eventId, analyticsData) {
    try {
      const eventRef = ref(rtdb, `events/${eventId}/analytics`);
      await set(eventRef, {
        ...analyticsData,
        last_updated: Date.now()
      });
    } catch (error) {
      console.error('Error updating event analytics:', error);
      throw error;
    }
  }

  async getEventAnalytics(eventId) {
    try {
      const eventRef = ref(rtdb, `events/${eventId}/analytics`);
      const snapshot = await new Promise(resolve => {
        onValue(eventRef, resolve, { onlyOnce: true });
      });
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching event analytics:', error);
      throw error;
    }
  }

  async updateTicketTiers(eventId, tiers) {
    try {
      const tiersRef = ref(rtdb, `events/${eventId}/ticket_tiers`);
      await set(tiersRef, tiers);
    } catch (error) {
      console.error('Error updating ticket tiers:', error);
      throw error;
    }
  }

  async trackEntry(eventId, entryData) {
    try {
      const entryRef = push(ref(rtdb, `events/${eventId}/entries`));
      const entry = {
        ...entryData,
        timestamp: Date.now()
      };
      await set(entryRef, entry);

      // Update analytics
      this.updateAnalyticsOnEntry(eventId, entryData);
    } catch (error) {
      console.error('Error tracking entry:', error);
      throw error;
    }
  }

  async updateAnalyticsOnEntry(eventId, entryData) {
    const analyticsRef = ref(rtdb, `events/${eventId}/analytics`);
    onValue(analyticsRef, async (snapshot) => {
      const currentAnalytics = snapshot.val() || {};
      
      // Update attendance by tier
      const tierAttendance = currentAnalytics.attendance_by_tier || {};
      tierAttendance[entryData.tier] = (tierAttendance[entryData.tier] || 0) + 1;

      // Update gender ratio
      const genderRatio = currentAnalytics.gender_ratio || { male: 0, female: 0 };
      genderRatio[entryData.gender.toLowerCase()]++;

      // Update revenue by tier
      const revenueTier = currentAnalytics.revenue_by_tier || {};
      revenueTier[entryData.tier] = (revenueTier[entryData.tier] || 0) + entryData.price;

      // Update entry timeline
      const entryTimeline = currentAnalytics.entry_timeline || [];
      entryTimeline.push({
        time: Date.now(),
        tier: entryData.tier,
        price: entryData.price
      });

      // Update PR performance if PR code exists
      if (entryData.pr_code) {
        const prPerformance = currentAnalytics.pr_performance || {};
        prPerformance[entryData.pr_code] = (prPerformance[entryData.pr_code] || 0) + 1;
      }

      await this.updateEventAnalytics(eventId, {
        ...currentAnalytics,
        attendance_by_tier: tierAttendance,
        gender_ratio: genderRatio,
        revenue_by_tier: revenueTier,
        entry_timeline: entryTimeline,
        pr_performance: currentAnalytics.pr_performance
      });
    }, { onlyOnce: true });
  }

  async getEventPerformanceMetrics(eventId) {
    try {
      const analyticsRef = ref(rtdb, `events/${eventId}/analytics`);
      const snapshot = await new Promise(resolve => {
        onValue(analyticsRef, resolve, { onlyOnce: true });
      });
      const analytics = snapshot.val();

      return {
        totalAttendance: Object.values(analytics.attendance_by_tier || {})
          .reduce((sum, count) => sum + count, 0),
        totalRevenue: Object.values(analytics.revenue_by_tier || {})
          .reduce((sum, revenue) => sum + revenue, 0),
        peakHours: this.calculatePeakHours(analytics.entry_timeline || []),
        genderRatio: analytics.gender_ratio,
        topPerformingPRs: this.getTopPerformingPRs(analytics.pr_performance || {}),
        tierPerformance: this.calculateTierPerformance(
          analytics.revenue_by_tier || {},
          analytics.attendance_by_tier || {}
        ),
        socialMediaImpact: analytics.social_media_impact || {}
      };
    } catch (error) {
      console.error('Error fetching event performance metrics:', error);
      throw error;
    }
  }

  calculatePeakHours(entryTimeline) {
    const hourlyCount = {};
    entryTimeline.forEach(entry => {
      const hour = new Date(entry.time).getHours();
      hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
    });

    return Object.entries(hourlyCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({
        hour: parseInt(hour),
        count
      }));
  }

  getTopPerformingPRs(prPerformance) {
    return Object.entries(prPerformance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([code, count]) => ({
        code,
        count
      }));
  }

  calculateTierPerformance(revenue, attendance) {
    return Object.keys(revenue).map(tier => ({
      tier,
      revenue: revenue[tier],
      attendance: attendance[tier],
      averageSpendPerPerson: revenue[tier] / attendance[tier]
    }));
  }
}

const eventManagementService = new EventManagementService();
export default eventManagementService; 