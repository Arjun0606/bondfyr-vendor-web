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
    returningRate: 23,
    checkInConversion: 82 // Percentage of RSVPs that actually check in
  },
  checkins: {
    byHour: {
      '8pm': 105,
      '9pm': 220,
      '10pm': 390,
      '11pm': 560,
      '12am': 580,
      '1am': 450,
      '2am': 230,
      '3am': 95
    },
    waitTimes: {
      average: 8, // in minutes
      peak: 15 // in minutes during busiest period
    },
    entryPoints: [
      { name: 'Main', usage: 65 }, // percentage
      { name: 'VIP', usage: 20 },
      { name: 'Guest List', usage: 15 }
    ],
    appUsage: 76 // percentage of check-ins done via app
  },
  events: [
    { 
      name: 'Friday Night Live', 
      date: '2023-11-03', 
      attendance: 420,
      checkInRate: 85, // percentage of registered guests who checked in
      theme: 'Hip-hop'
    },
    { 
      name: 'Saturday Night Fever', 
      date: '2023-11-04', 
      attendance: 480, 
      checkInRate: 88,
      theme: 'EDM'
    },
    { 
      name: 'Midweek Madness', 
      date: '2023-11-08', 
      attendance: 340, 
      checkInRate: 78,
      theme: 'Open format'
    }
  ],
  promoters: {
    total: 15,
    performance: [
      { name: 'Alex', guests: 580, conversionRate: 89 },
      { name: 'Jamie', guests: 490, conversionRate: 85 },
      { name: 'Taylor', guests: 450, conversionRate: 92 },
      { name: 'Jordan', guests: 310, conversionRate: 78 },
      { name: 'Casey', guests: 280, conversionRate: 81 }
    ],
    averageGuestsPerPromoter: 220,
    topPromoterContribution: 45 // percentage of check-ins from top 3 promoters
  },
  operations: {
    peakTimes: { entry: '11pm-12am', exit: '2am-3am' },
    staffUtilization: 78,
    staffDistribution: {
      entry: 30, // percentage
      security: 35,
      service: 25,
      management: 10
    },
    commonBottlenecks: ['entry', 'main-bar'],
    checkInEquipment: {
      scanners: 2,
      avgProcessingTime: 45 // seconds per check-in
    }
  }
};

export default exampleVenueData; 