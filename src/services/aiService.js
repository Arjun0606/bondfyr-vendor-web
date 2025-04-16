/**
 * AI Insights Service
 * Provides AI-generated insights for Bondfyr venue data
 */

// Constants for caching and rate limiting
const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10;

// Bondfyr-specific mock data for development purposes
const getMockInsights = (venueData) => {
  return {
    summary: {
      score: 78,
      potentialIncrease: "+15%",
      actionItems: 6
    },
    categories: [
      {
        id: "attendance",
        name: "Attendance",
        score: 75,
        trend: "up",
        insights: [
          {
            title: "Check-in Flow Optimization",
            description: "Your venue reaches peak capacity between 11pm-1am with significant bottlenecks at check-in. Adding additional check-in staff during these hours could improve entry efficiency by 30%.",
            impact: "high",
            effort: "low",
            actionable: true
          },
          {
            title: "Guest List Management",
            description: "Guests on your VIP list experience 3x longer wait times than regular ticket holders. Implementing a separate VIP check-in lane could improve satisfaction and reduce congestion.",
            impact: "high",
            effort: "low",
            actionable: true
          },
          {
            title: "Check-in Conversion Rate",
            description: "Only 82% of guests who RSVP actually check in. Implementing automated reminder notifications 4 hours before the event could increase this to 90-95%.",
            impact: "medium",
            effort: "low",
            actionable: true
          }
        ]
      },
      {
        id: "operations",
        name: "Operations",
        score: 70,
        trend: "flat",
        insights: [
          {
            title: "Staff Deployment Efficiency",
            description: "Staff utilization data shows uneven distribution, with entry areas understaffed during peak times (11pm-1am) and overstaffed during slower periods. Adjusting scheduling could improve guest experience.",
            impact: "high",
            effort: "medium",
            actionable: true
          },
          {
            title: "Check-in Equipment Placement",
            description: "The current scanner placement creates bottlenecks at the main entrance. Reconfiguring to have 3 check-in stations instead of 2 could reduce wait times by 40%.",
            impact: "medium",
            effort: "low",
            actionable: true
          }
        ]
      },
      {
        id: "marketing",
        name: "Marketing",
        score: 77,
        trend: "up",
        insights: [
          {
            title: "Promoter Performance Analysis",
            description: "Your top 3 promoters bring in 45% of all guests. Creating a tiered incentive system for promoters based on check-in volume could increase overall attendance.",
            impact: "high",
            effort: "medium",
            actionable: true
          },
          {
            title: "Event Promotion Timing",
            description: "Events promoted 7-10 days in advance have 35% higher attendance than those promoted less than 5 days before. Standardizing your promotion timeline could improve attendance.",
            impact: "medium",
            effort: "low",
            actionable: true
          }
        ]
      },
      {
        id: "engagement",
        name: "Engagement",
        score: 68,
        trend: "up",
        insights: [
          {
            title: "Return Guest Frequency",
            description: "Only 23% of guests return within 30 days. Implementing a loyalty program through Bondfyr could potentially increase this to 35-40%.",
            impact: "high",
            effort: "medium",
            actionable: true
          },
          {
            title: "Peak Activity Hours",
            description: "Check-in data shows your venue reaches capacity at 11:30pm, with a sharp drop-off after 1:30am. Consider special promotions or entertainment scheduling to extend guest retention time.",
            impact: "medium",
            effort: "medium",
            actionable: true
          }
        ]
      }
    ],
    weeklyReport: {
      title: "Weekly Performance Summary",
      date: "For the week ending " + new Date().toLocaleDateString(),
      highlights: [
        "Overall check-ins increased by 14% compared to previous week",
        "Average entry wait time reduced by 22%",
        "Check-in app usage improved by 35%",
        "Thursday night events now consistently reaching 85% capacity",
        "Promoter-driven check-ins up 18% week-over-week"
      ],
      recommendedFocus: "Based on this week's Bondfyr data, we recommend optimizing your check-in process by adding additional staff during peak hours (11pm-1am) and implementing a dedicated VIP entry lane. Increasing promoter incentives for Thursday events has shown significant improvement and should be continued.",
      performanceMetrics: [
        { name: "Total Check-ins", value: venueData.attendance.total.toLocaleString(), change: "+14%", status: "positive" },
        { name: "Entry Efficiency", value: "82%", change: "+15%", status: "positive" },
        { name: "App Usage", value: "76%", change: "+23%", status: "positive" },
        { name: "Repeat Visitors", value: "23%", change: "+3%", status: "positive" }
      ]
    }
  };
};

/**
 * Cache manager for AI insights
 * Handles caching, rate limiting and data persistence
 */
class InsightsCache {
  constructor() {
    this.cache = {};
    this.requestLog = [];
  }

  // Generate a consistent cache key from venue data
  generateCacheKey(venueData) {
    // Create a simplified object with only the data points that would affect insights
    const keyData = {
      attendance: venueData.attendance?.total,
      revenue: venueData.revenue?.total,
      events: venueData.events?.length,
      socialMetrics: {
        followers: venueData.socialMedia?.totalFollowers,
        engagement: venueData.socialMedia?.engagementRate
      },
      operations: {
        peakOccupancy: venueData.operations?.peakOccupancy,
        staffUtilization: venueData.operations?.staffUtilization
      }
    };
    
    return JSON.stringify(keyData);
  }

  // Get cached insights if they exist and are not expired
  getCachedInsights(venueData) {
    const cacheKey = this.generateCacheKey(venueData);
    const cachedItem = this.cache[cacheKey];
    
    if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_EXPIRY_MS) {
      console.log('Using cached insights from', new Date(cachedItem.timestamp).toLocaleTimeString());
      return cachedItem.insights;
    }
    
    return null;
  }

  // Cache new insights
  cacheInsights(venueData, insights) {
    const cacheKey = this.generateCacheKey(venueData);
    this.cache[cacheKey] = {
      insights,
      timestamp: Date.now()
    };
    console.log('Cached new insights at', new Date().toLocaleTimeString());
  }

  // Check if we're exceeding rate limits
  checkRateLimit() {
    // Clean up old requests
    const cutoffTime = Date.now() - RATE_LIMIT_WINDOW_MS;
    this.requestLog = this.requestLog.filter(timestamp => timestamp > cutoffTime);
    
    // Check if we've exceeded the limit
    if (this.requestLog.length >= MAX_REQUESTS_PER_WINDOW) {
      const oldestRequest = new Date(Math.min(...this.requestLog)).toLocaleTimeString();
      const retryAfter = new Date(Math.min(...this.requestLog) + RATE_LIMIT_WINDOW_MS).toLocaleTimeString();
      
      throw new Error(`Rate limit exceeded. You've made ${this.requestLog.length} requests since ${oldestRequest}. Please try again after ${retryAfter}.`);
    }
    
    // Log this request
    this.requestLog.push(Date.now());
  }
}

// Initialize our cache
const insightsCache = new InsightsCache();

/**
 * Call OpenAI API to generate insights
 */
const callOpenAI = async (venueData, apiKey = null) => {
  // For security, only validate the API key if one is provided
  // For development, we'll continue even without a key and use mock data
  if (apiKey && apiKey.length < 20) {
    throw new Error("API key is invalid. Please check your configuration.");
  }
  
  try {
    // For demonstration, we'll use the mock data instead of making an actual API call
    
    // Construct the prompt for the AI
    // eslint-disable-next-line no-unused-vars
    const prompt = `
      You are Bondfyr's venue analytics AI assistant. Analyze the following internal venue data from our platform and provide actionable insights:
      
      Check-in Data:
      - Total check-ins: ${venueData.attendance.total}
      - Weekly trend: ${JSON.stringify(venueData.attendance.trend || [])}
      - Return rate: ${venueData.attendance.returningRate}%
      
      Recent Events (${venueData.events.length}):
      ${venueData.events.map(e => `- ${e.name}: ${e.attendance} check-ins`).join('\n')}
      
      Operational Metrics:
      - Peak entry times: ${venueData.operations.peakTimes?.entry || 'Not available'}
      - Staff utilization: ${venueData.operations.staffUtilization}%
      - Identified bottlenecks: ${venueData.operations.commonBottlenecks?.join(', ') || 'None identified'}
      
      Provide a comprehensive analysis including:
      1. Overall venue performance score (0-100)
      2. Key insights categorized by attendance, operations, marketing, and engagement
      3. Weekly performance summary with Bondfyr-specific recommendations
      4. Actionable recommendations leveraging Bondfyr platform features with impact (high/medium/low) and effort (high/medium/low) ratings
    `;
    
    // Simulate API response time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return mock insights in the expected format
    return getMockInsights(venueData);
    
  } catch (error) {
    console.error("API error:", error);
    
    // Format errors specifically for frontend consumption
    if (error.message.includes("API key")) {
      throw new Error("API key is invalid or expired. Please check your configuration.");
    } else if (error.message.includes("rate limit") || error.message.includes("Rate limit")) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else {
      throw new Error(`Error generating insights: ${error.message}`);
    }
  }
};

/**
 * Generate AI insights from venue data
 * Integrates with OpenAI API to provide venue insights
 */
const generateAIInsights = async (venueData, apiKey = null) => {
  try {
    // First check cache
    const cachedInsights = insightsCache.getCachedInsights(venueData);
    if (cachedInsights) {
      console.log("Using cached insights");
      return cachedInsights;
    }
    
    // Then check rate limit
    insightsCache.checkRateLimit();
    
    // Generate new insights
    console.log("Generating new AI insights");
    const insights = await callOpenAI(venueData, apiKey);
    
    // Cache the results
    insightsCache.cacheInsights(venueData, insights);
    
    return insights;
  } catch (error) {
    console.error("Error in generateAIInsights:", error);
    throw error; // Re-throw for handling in the component
  }
};

const aiService = {
  generateAIInsights,
  getMockInsights
};

export default aiService; 