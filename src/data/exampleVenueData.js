// Example venue data structure for development and testing
const exampleVenueData = {
  attendance: {
    total: 5840,
    trend: [
      { date: '2023-10-01', count: 920 },
      { date: '2023-10-08', count: 890 },
      { date: '2023-10-15', count: 950 },
      { date: '2023-10-22', count: 1020 },
      { date: '2023-10-29', count: 1180 },
      { date: '2023-11-05', count: 1240 }
    ],
    demographics: {
      gender: { male: 53, female: 45, other: 2 },
      age: { '18-24': 35, '25-34': 42, '35-44': 18, '45+': 5 }
    },
    returningRate: 23
  },
  revenue: {
    total: 428500,
    breakdown: {
      tickets: 248000,
      bar: 142500,
      vipTables: 38000
    },
    averagePerGuest: 73.37
  },
  events: [
    { 
      name: 'Friday Night Live', 
      date: '2023-11-03', 
      attendance: 420, 
      revenue: 38500,
      theme: 'Hip-hop'
    },
    { 
      name: 'Saturday Night Fever', 
      date: '2023-11-04', 
      attendance: 480, 
      revenue: 42000,
      theme: 'EDM'
    },
    { 
      name: 'Midweek Madness', 
      date: '2023-11-08', 
      attendance: 340, 
      revenue: 29500,
      theme: 'Open format'
    }
  ],
  socialMedia: {
    followers: {
      instagram: 12400,
      facebook: 8600,
      twitter: 3200,
      tiktok: 5800
    },
    growth: {
      instagram: "+4.2%",
      facebook: "-0.5%",
      twitter: "+1.2%",
      tiktok: "+7.8%"
    },
    engagement: {
      rate: 4.8,
      averageComments: 28,
      averageLikes: 342,
      averageShares: 16
    },
    contentPerformance: {
      videos: { count: 12, averageEngagement: 3200, conversionRate: 2.4 },
      images: { count: 32, averageEngagement: 840, conversionRate: 0.8 },
      stories: { count: 48, averageEngagement: 620, conversionRate: 0.5 },
      reels: { count: 8, averageEngagement: 2800, conversionRate: 1.9 }
    },
    topPosts: [
      { type: 'video', engagement: 3200, theme: 'event-promo', platform: 'instagram' },
      { type: 'image', engagement: 2800, theme: 'event-recap', platform: 'instagram' },
      { type: 'reel', engagement: 4100, theme: 'behind-scenes', platform: 'tiktok' }
    ],
    postingTimes: {
      highestEngagement: { day: 'Thursday', time: '19:00-21:00' },
      lowestEngagement: { day: 'Monday', time: '9:00-11:00' }
    },
    influencerCollabs: [
      { name: 'DJ Maximus', followers: 45000, engagement: 2800, ticketSales: 42 },
      { name: 'NightlifeQueen', followers: 28000, engagement: 1900, ticketSales: 28 }
    ]
  },
  operations: {
    peakTimes: { entry: '11pm-12am', orders: '11:30pm-1am' },
    staffUtilization: 78,
    commonBottlenecks: ['entry', 'main-bar']
  }
};

export default exampleVenueData; 