/**
 * AI Insights Service
 * Provides AI-generated insights for venue data
 */

// Mock data for development purposes
const getMockInsights = () => {
  return {
    summary: {
      score: 78,
      potentialIncrease: "+22%",
      actionItems: 10,
      trend: "improving"
    },
    categories: [
      {
        id: "attendance",
        name: "Attendance Patterns",
        score: 75,
        trend: "up",
        insights: [
          {
            title: "Guest Retention Opportunity",
            description: "Only 23% of first-time guests return within 30 days. Consider implementing a follow-up system to improve this metric.",
            impact: "high",
            effort: "medium",
            actionable: true
          },
          {
            title: "Event Theme Performance",
            description: "Hip-hop themed events outperform other themes by 32% in attendance. Consider adjusting your event calendar.",
            impact: "high",
            effort: "medium",
            actionable: true
          }
        ]
      },
      {
        id: "operations",
        name: "Venue Operations",
        score: 84,
        trend: "up",
        insights: [
          {
            title: "Entry Flow Improvement",
            description: "Current entry process creates bottlenecks between 11pm-12am. Adding one temporary check-in station would reduce wait times significantly.",
            impact: "medium",
            effort: "medium",
            actionable: true
          }
        ]
      },
      {
        id: "tickets",
        name: "Ticket Sales",
        score: 68,
        trend: "flat",
        insights: [
          {
            title: "VIP Table Pricing",
            description: "Based on current demand patterns, VIP tables could be repriced for optimal revenue.",
            impact: "high",
            effort: "low",
            actionable: true
          },
          {
            title: "Timing Strategy",
            description: "Sales peak 48 hours before events. Consider running limited-time promotions during this window.",
            impact: "medium",
            effort: "low",
            actionable: true
          }
        ]
      },
      {
        id: "social",
        name: "Social Media Analytics",
        score: 71,
        trend: "up",
        insights: [
          {
            title: "Content Performance",
            description: "Video content showing event highlights receives 3.8x more engagement than promotional posts. Increase video content ratio to improve reach.",
            impact: "high",
            effort: "medium",
            actionable: true
          },
          {
            title: "Posting Schedule",
            description: "Engagement peaks between 7-9pm on weekdays. Adjust your posting schedule to maximize visibility during these hours.",
            impact: "medium",
            effort: "low",
            actionable: true
          }
        ]
      }
    ],
    weeklyReport: {
      title: "Weekly Performance Summary",
      date: "This Week",
      highlights: [
        "Overall attendance up 18% compared to previous week",
        "Weekend events performing well with increased ticket sales",
        "Weekday events underperforming by 8%",
        "Social media engagement increased by 23% this week"
      ],
      recommendedFocus: "Weekday event promotion and guest retention strategies",
      performanceMetrics: [
        { name: "Total Revenue", value: "₹42,850", change: "+12%", status: "positive" },
        { name: "Guests Served", value: "1,240", change: "+18%", status: "positive" },
        { name: "Returning Guests", value: "23%", change: "-5%", status: "negative" },
        { name: "Social Engagement", value: "4.8%", change: "+23%", status: "positive" }
      ]
    }
  };
};

/**
 * Generate AI insights from venue data
 * This is a placeholder that returns mock data
 */
const generateAIInsights = async (venueData) => {
  console.log('Generating insights for venue data:', venueData);
  
  // In a real implementation, this would call an AI API
  // For now, we'll just return mock data after a delay to simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockInsights());
    }, 1500);
  });
};

const aiService = {
  generateAIInsights,
  getMockInsights
};

export default aiService; 