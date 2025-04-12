import axios from 'axios';
import { rtdb } from '../firebase/firebase';
import { ref, onValue, set } from 'firebase/database';

// Dummy data for development and testing
const DUMMY_DATA = {
  instagram: {
    daily_clicks: [
      { date: '2024-03-01', clicks: 145, followers: 23 },
      { date: '2024-03-02', clicks: 167, followers: 31 },
      { date: '2024-03-03', clicks: 189, followers: 28 },
      { date: '2024-03-04', clicks: 234, followers: 42 },
      { date: '2024-03-05', clicks: 178, followers: 35 },
      { date: '2024-03-06', clicks: 289, followers: 51 },
      { date: '2024-03-07', clicks: 321, followers: 64 }
    ],
    follower_count_delta: 274,
    engagement_rate: 4.8,
    story_views: 2145,
    profile_views: 892,
    top_media: [
      { id: '1', media_type: 'Reel', caption: 'Saturday Night Vibes 🎉', engagement: 543 },
      { id: '2', media_type: 'Story', caption: 'Live DJ Set Tonight', engagement: 423 },
      { id: '3', media_type: 'Post', caption: 'New Menu Launch', engagement: 367 }
    ],
    hourly_stats: [
      { hour: '18:00', clicks: 45 },
      { hour: '19:00', clicks: 67 },
      { hour: '20:00', clicks: 89 },
      { hour: '21:00', clicks: 156 },
      { hour: '22:00', clicks: 234 },
      { hour: '23:00', clicks: 198 },
      { hour: '00:00', clicks: 167 }
    ]
  },
  appClicks: {
    total: 1523,
    byContentType: {
      '1': 234,
      '2': 189,
      '3': 156
    }
  }
};

const DUMMY_EVENT_DATA = {
  totalReach: 5432,
  totalEngagement: 876,
  ticketCorrelation: 0.78,
  bestPerformingContent: {
    type: 'Reel',
    engagement: 543,
    description: 'Saturday Night Party Highlights'
  },
  salesImpact: 23.5
};

const DUMMY_POSTING_TIMES = {
  bestHours: [
    { hour: 21, averageEngagement: 234.5 },
    { hour: 20, averageEngagement: 198.3 },
    { hour: 22, averageEngagement: 187.6 },
    { hour: 19, averageEngagement: 156.8 },
    { hour: 23, averageEngagement: 145.2 }
  ],
  bestDays: [
    { day: 'Saturday', engagement: 1234 },
    { day: 'Friday', engagement: 1123 },
    { day: 'Thursday', engagement: 987 },
    { day: 'Sunday', engagement: 876 },
    { day: 'Wednesday', engagement: 765 }
  ]
};

class InstagramService {
  constructor() {
    // These would be securely stored in environment variables
    this.accessToken = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN;
    this.businessAccountId = process.env.REACT_APP_INSTAGRAM_BUSINESS_ACCOUNT_ID;
    this.baseUrl = 'https://graph.instagram.com/v12.0';
  }

  // Fetch basic account insights
  async getAccountInsights() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.businessAccountId}/insights`,
        {
          params: {
            metric: 'impressions,reach,profile_views',
            period: 'day',
            access_token: this.accessToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching Instagram insights:', error);
      throw error;
    }
  }

  // Fetch media insights for a specific post
  async getMediaInsights(mediaId) {
    try {
      // In a real implementation, this would fetch real media insights
      return {
        engagement: DUMMY_DATA.instagram.top_media.find(m => m.id === mediaId)?.engagement || 0
      };
    } catch (error) {
      console.error('Error fetching media insights:', error);
      return { engagement: 0 }; // Fallback to zero on error
    }
  }

  // Track app-to-Instagram clicks
  async trackInstagramClick(userId, contentType) {
    try {
      const clickRef = ref(rtdb, `instagram_clicks/${Date.now()}`);
      await set(clickRef, {
        userId,
        timestamp: Date.now(),
        contentType,
        source: 'ios_app'
      });
    } catch (error) {
      console.error('Error tracking Instagram click:', error);
      throw error;
    }
  }

  // Correlate app users with Instagram followers
  async correlateUsers(instagramUsername, userId) {
    try {
      const userRef = ref(rtdb, `user_instagram_correlation/${userId}`);
      await set(userRef, {
        instagramUsername,
        timestamp: Date.now(),
        lastInteraction: Date.now()
      });
    } catch (error) {
      console.error('Error correlating user:', error);
      throw error;
    }
  }

  // Get story insights
  async getStoryInsights(storyId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${storyId}/insights`,
        {
          params: {
            metric: 'exits,impressions,reach,replies',
            access_token: this.accessToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching story insights:', error);
      throw error;
    }
  }

  // Get hashtag performance
  async getHashtagPerformance(hashtag) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/ig_hashtag_search`,
        {
          params: {
            q: hashtag,
            access_token: this.accessToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching hashtag performance:', error);
      throw error;
    }
  }

  // Combine app and Instagram metrics
  async getCombinedMetrics() {
    try {
      // In a real implementation, this would make API calls to Instagram
      // For now, return dummy data
      return DUMMY_DATA;
    } catch (error) {
      console.error('Error fetching combined metrics:', error);
      return DUMMY_DATA; // Fallback to dummy data on error
    }
  }

  // Calculate conversion rate
  calculateConversionRate(instagramInsights, clicks) {
    if (!clicks.length || !instagramInsights.profile_views) return 0;
    return (clicks.length / instagramInsights.profile_views.values[0].value) * 100;
  }

  // Track story link clicks and conversions
  async getStoryLinkPerformance(storyId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${storyId}/insights`,
        {
          params: {
            metric: 'exits,link_clicks,replies,shares',
            access_token: this.accessToken
          }
        }
      );

      const clicksRef = ref(rtdb, `story_link_clicks/${storyId}`);
      const clicksSnapshot = await new Promise(resolve => {
        onValue(clicksRef, resolve, { onlyOnce: true });
      });
      const appClicks = clicksSnapshot.val() || {};

      return {
        ...response.data,
        appClicks: Object.keys(appClicks).length,
        conversionRate: this.calculateStoryConversion(response.data.link_clicks, Object.keys(appClicks).length)
      };
    } catch (error) {
      console.error('Error fetching story link performance:', error);
      throw error;
    }
  }

  // Track event promotion performance
  async getEventPromotionMetrics(eventId) {
    try {
      // In a real implementation, this would fetch real event data
      return DUMMY_EVENT_DATA;
    } catch (error) {
      console.error('Error getting event promotion metrics:', error);
      return DUMMY_EVENT_DATA; // Fallback to dummy data on error
    }
  }

  // Get optimal posting times based on historical data
  async getOptimalPostingTimes() {
    try {
      // In a real implementation, this would analyze real posting data
      return DUMMY_POSTING_TIMES;
    } catch (error) {
      console.error('Error getting optimal posting times:', error);
      return DUMMY_POSTING_TIMES; // Fallback to dummy data on error
    }
  }

  // Analyze competitor performance
  async getCompetitorAnalysis(competitorUsernames) {
    try {
      const competitorData = await Promise.all(
        competitorUsernames.map(async username => {
          const response = await axios.get(
            `${this.baseUrl}/users/search`,
            {
              params: {
                q: username,
                access_token: this.accessToken
              }
            }
          );
          
          if (response.data.data[0]) {
            const userId = response.data.data[0].id;
            const insights = await this.getPublicInsights(userId);
            return {
              username,
              ...insights
            };
          }
          return null;
        })
      );

      return competitorData.filter(Boolean);
    } catch (error) {
      console.error('Error analyzing competitors:', error);
      throw error;
    }
  }

  // Helper methods
  calculateStoryConversion(linkClicks, appClicks) {
    if (!linkClicks || !appClicks) return 0;
    return ((appClicks / linkClicks) * 100).toFixed(1);
  }

  calculateTicketCorrelation(ticketSales, postEngagement) {
    // Implement correlation calculation between post engagement and ticket sales
    // Returns a correlation coefficient (-1 to 1)
    // This is a simplified version
    const n = Math.min(ticketSales.length, postEngagement.length);
    let sum = 0;
    
    for (let i = 0; i < n; i++) {
      if (postEngagement[i].time < ticketSales[i].time) {
        sum += (postEngagement[i].engagement * ticketSales[i].sales);
      }
    }
    
    return sum / n;
  }

  findBestPerformingContent(posts) {
    return posts.sort((a, b) => {
      const aScore = (a.engagement * 0.4) + (a.reach * 0.3) + (a.saves * 0.3);
      const bScore = (b.engagement * 0.4) + (b.reach * 0.3) + (b.saves * 0.3);
      return bScore - aScore;
    })[0];
  }

  calculateSalesImpact(ticketSales, postEngagement) {
    // Calculate the impact of social media engagement on ticket sales
    // Returns percentage increase in sales after high-engagement posts
    let totalImpact = 0;
    let impactCount = 0;

    postEngagement.forEach(post => {
      const salesAfterPost = ticketSales.filter(sale => 
        sale.time > post.time && 
        sale.time <= post.time + (24 * 60 * 60 * 1000) // 24 hours after post
      );

      if (salesAfterPost.length > 0) {
        const averageSalesBefore = this.getAverageSales(ticketSales, post.time - (24 * 60 * 60 * 1000), post.time);
        const averageSalesAfter = this.getAverageSales(ticketSales, post.time, post.time + (24 * 60 * 60 * 1000));
        
        if (averageSalesBefore > 0) {
          totalImpact += ((averageSalesAfter - averageSalesBefore) / averageSalesBefore) * 100;
          impactCount++;
        }
      }
    });

    return impactCount > 0 ? totalImpact / impactCount : 0;
  }

  getAverageSales(ticketSales, startTime, endTime) {
    const relevantSales = ticketSales.filter(sale => 
      sale.time >= startTime && sale.time <= endTime
    );
    
    return relevantSales.length > 0 
      ? relevantSales.reduce((sum, sale) => sum + sale.sales, 0) / relevantSales.length 
      : 0;
  }
}

const instagramService = new InstagramService();
export default instagramService; 