import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Dummy data for guest profile analytics
const dummyData = {
  guestStats: {
    totalGuests: 875,
    newGuests: 325,
    returningGuests: 550,
    conversionRate: 73, // percentage
  },
  ageDistribution: [
    { range: '18-21', count: 142 },
    { range: '22-25', count: 246 },
    { range: '26-29', count: 215 },
    { range: '30-35', count: 168 },
    { range: '36-40', count: 75 },
    { range: '41+', count: 29 },
  ],
  genderDistribution: [
    { gender: 'Male', count: 496 },
    { gender: 'Female', count: 374 },
    { gender: 'Other', count: 5 },
  ],
  visitsFrequency: [
    { frequency: 'First Time', count: 325 },
    { frequency: '2-3 Visits', count: 220 },
    { frequency: '4-6 Visits', count: 184 },
    { frequency: '7-10 Visits', count: 98 },
    { frequency: '11+ Visits', count: 48 },
  ],
  locationHeatmap: [
    { location: 'Local (0-5 mi)', count: 328 },
    { location: 'City (5-15 mi)', count: 246 },
    { location: 'Suburbs (15-30 mi)', count: 156 },
    { location: 'Extended Metro (30-50 mi)', count: 85 },
    { location: 'Out of Town (50+ mi)', count: 60 },
  ],
  attendanceByMonth: [
    { month: 'Jan', guests: 715, newGuests: 285 },
    { month: 'Feb', guests: 748, newGuests: 292 },
    { month: 'Mar', guests: 780, newGuests: 305 },
    { month: 'Apr', guests: 812, newGuests: 310 },
    { month: 'May', guests: 845, newGuests: 318 },
    { month: 'Jun', guests: 875, newGuests: 325 },
  ],
  topInterests: [
    { interest: 'Electronic Music', count: 482 },
    { interest: 'Hip Hop', count: 395 },
    { interest: 'R&B', count: 312 },
    { interest: 'Pop Culture', count: 265 },
    { interest: 'Fashion', count: 248 },
    { interest: 'Sports', count: 220 },
    { interest: 'Art & Design', count: 195 },
    { interest: 'Technology', count: 180 },
  ],
  spendByDemographic: [
    { demographic: 'Male 21-25', averageSpend: 85 },
    { demographic: 'Female 21-25', averageSpend: 75 },
    { demographic: 'Male 26-30', averageSpend: 110 },
    { demographic: 'Female 26-30', averageSpend: 95 },
    { demographic: 'Male 31-40', averageSpend: 135 },
    { demographic: 'Female 31-40', averageSpend: 125 },
  ],
  popularArrivalTimes: [
    { time: '19:00', count: 45 },
    { time: '20:00', count: 102 },
    { time: '21:00', count: 186 },
    { time: '22:00', count: 246 },
    { time: '23:00', count: 168 },
    { time: '00:00', count: 95 },
    { time: '01:00', count: 33 },
  ],
  loyaltyTiers: [
    { tier: 'Bronze', count: 455 },
    { tier: 'Silver', count: 245 },
    { tier: 'Gold', count: 125 },
    { tier: 'Platinum', count: 50 },
  ],
  returnVisits: [
    { month: 'Jan', newUsers: 285, returningUsers: 430 },
    { month: 'Feb', newUsers: 292, returningUsers: 456 },
    { month: 'Mar', newUsers: 305, returningUsers: 475 },
    { month: 'Apr', newUsers: 310, returningUsers: 502 },
    { month: 'May', newUsers: 318, returningUsers: 527 },
    { month: 'Jun', newUsers: 325, returningUsers: 550 },
  ],
  upcomingBirthdays: [
    { name: 'Emma Johnson', date: '2025-04-10', daysAway: 3 },
    { name: 'James Smith', date: '2025-04-12', daysAway: 5 },
    { name: 'Sophia Williams', date: '2025-04-14', daysAway: 7 },
  ],
  // iOS App Integration Data
  ticketUsageStats: {
    totalTicketsSold: 2450,
    ticketsScanned: 1876,
    unusedTickets: 574,
    scanConversionRate: 76.6, // percentage
    averageScanTime: "10:35 PM",
    earlyArrivals: 425, // before 9:30 PM
    peakArrivals: 1250, // 9:30 PM - 11:30 PM
    lateArrivals: 201, // after 11:30 PM
    noShows: 574
  },
  groupSizeDistribution: [
    { size: "1 Person", count: 315, percentage: 32 },
    { size: "2 People", count: 418, percentage: 42 },
    { size: "3-4 People", count: 176, percentage: 18 },
    { size: "5-6 People", count: 61, percentage: 6 },
    { size: "7+ People", count: 19, percentage: 2 },
  ],
  regularCustomerInsights: {
    totalRegulars: 246,
    visitsPerMonth: 2.3,
    avgSpendIncrease: 15, // percentage increase compared to one-time visitors
    retention: 68, // percentage
    churn: 32, // percentage
    topRegulars: [
      { name: "Jason Miller", visits: 12, totalSpend: 1480 },
      { name: "Leila Chen", visits: 9, totalSpend: 1235 },
      { name: "Marcus Johnson", visits: 8, totalSpend: 960 },
      { name: "Sophie Davis", visits: 7, totalSpend: 875 },
      { name: "Alex Wang", visits: 7, totalSpend: 830 },
    ]
  },
  purchaseTimeData: [
    { timeFrame: "Same day", count: 285, percentage: 29 },
    { timeFrame: "1-3 days before", count: 376, percentage: 38 },
    { timeFrame: "4-7 days before", count: 215, percentage: 22 },
    { timeFrame: "1-2 weeks before", count: 89, percentage: 9 },
    { timeFrame: "More than 2 weeks", count: 24, percentage: 2 },
  ],
  revenueTrends: {
    totalRevenue: 98750,
    averageTicketPrice: 40.3,
    premiumTicketsRevenue: 28500,
    standardTicketsRevenue: 47250,
    discountedTicketsRevenue: 23000,
    revenueByMonth: [
      { month: "Jan", revenue: 14200 },
      { month: "Feb", revenue: 15350 },
      { month: "Mar", revenue: 15900 },
      { month: "Apr", revenue: 16800 },
      { month: "May", revenue: 17500 },
      { month: "Jun", revenue: 19000 },
    ]
  },
  customerLifetimeValue: {
    average: 325,
    byFrequency: [
      { segment: "One-time", value: 65 },
      { segment: "Occasional (2-4 visits)", value: 195 },
      { segment: "Regular (5-8 visits)", value: 450 },
      { segment: "VIP (9+ visits)", value: 890 },
    ]
  },
  // Predictive Analytics Data
  predictiveAnalytics: {
    attendanceForecasts: [
      { month: "Jul", forecasted: 905, lowerBound: 870, upperBound: 940 },
      { month: "Aug", forecasted: 935, lowerBound: 890, upperBound: 980 },
      { month: "Sep", forecasted: 970, lowerBound: 920, upperBound: 1020 },
      { month: "Oct", forecasted: 1010, lowerBound: 950, upperBound: 1070 },
      { month: "Nov", forecasted: 1055, lowerBound: 980, upperBound: 1130 },
      { month: "Dec", forecasted: 1100, lowerBound: 1020, upperBound: 1180 },
    ],
    churnPrediction: {
      highRisk: 76,
      mediumRisk: 145,
      lowRisk: 328,
      churnFactors: [
        { factor: "Long gap between visits (>45 days)", weight: 32 },
        { factor: "Decreasing spend", weight: 28 },
        { factor: "No response to promotions", weight: 22 },
        { factor: "Negative feedback", weight: 18 },
      ]
    },
    ticketSalesTrend: [
      { category: "Standard", current: 1250, projected: 1375 },
      { category: "Premium", current: 780, projected: 925 },
      { category: "VIP", current: 420, projected: 540 },
    ],
    revenueProjection: {
      nextQuarter: 61500,
      growthRate: 8.5,
      byTicketType: [
        { type: "Standard", current: 47250, projected: 51500 },
        { type: "Premium", current: 28500, projected: 31200 },
        { type: "VIP", current: 23000, projected: 25300 },
      ]
    },
    customerSegmentGrowth: [
      { segment: "One-time", current: 468, projected: 435, change: -7 },
      { segment: "Occasional", current: 246, projected: 272, change: 10.6 },
      { segment: "Regular", current: 115, projected: 138, change: 20 },
      { segment: "VIP", current: 46, projected: 58, change: 26.1 },
    ]
  },
  tieredEntryData: {
    tiers: [
      { tier: "Early (Before 9PM)", price: 0, scanned: 425, percentage: 22.7 },
      { tier: "Regular (9:30PM-10:45PM)", price: 500, scanned: 1025, percentage: 54.6 },
      { tier: "Late (After 10:45PM)", price: 800, scanned: 426, percentage: 22.7 }
    ],
    revenue: {
      earlyTier: 0,
      regularTier: 512500, // 1025 guests × ₹500
      lateTier: 340800, // 426 guests × ₹800
      total: 853300
    },
    groupSizeTiers: [
      { tier: "Early", solo: 105, pairs: 128, threeToFour: 52, fivePlus: 12 },
      { tier: "Regular", solo: 223, pairs: 315, threeToFour: 98, fivePlus: 28 },
      { tier: "Late", solo: 89, pairs: 128, threeToFour: 42, fivePlus: 9 }
    ],
    partialGroups: {
      totalPartialScans: 182, // Number of groups where not all members arrived together
      averageTimeBetweenScans: "42 minutes",
      tieredUpgrades: 56, // Number of guests who had to pay tier price difference
      additionalRevenue: 16800 // Revenue from tier upgrades
    }
  },
  photoContestData: {
    participation: {
      ticketsScanned: 1876,
      photoParticipants: 364,
      participationRate: 19.4, // percentage
      photosSubmitted: 412, // Some participants submitted multiple photos
      averagePhotosPerParticipant: 1.13
    },
    engagement: {
      totalLikes: 3240,
      totalViews: 8750,
      averageLikesPerPhoto: 7.86,
      averageViewsPerPhoto: 21.24,
      mostLikedPhoto: 96, // number of likes
      mostViewedPhoto: 243 // number of views
    },
    topPhotos: [
      { id: "PC-2184", likes: 96, views: 243, participantName: "Ravi Sharma" },
      { id: "PC-1958", likes: 87, views: 201, participantName: "Priya Kapoor" },
      { id: "PC-2032", likes: 78, views: 187, participantName: "Arjun Singh" },
      { id: "PC-1845", likes: 75, views: 172, participantName: "Neha Patel" },
      { id: "PC-2146", likes: 68, views: 154, participantName: "Vikram Mehta" }
    ],
    conversionData: {
      returnRate: 47, // percentage of photo contest participants who returned for future events
      engagementToReturnCorrelation: 0.72, // correlation between likes received and likelihood to return
      sharedOnSocialMedia: 218, // number of participants who shared their photos
      socialMediaReferrals: 64 // new customers who came through social media shares
    }
  },
  musicTypeData: {
    genres: [
      { genre: "Bollywood", events: 18, averageAttendance: 248, averageRevenue: 102500 },
      { genre: "EDM", events: 12, averageAttendance: 210, averageRevenue: 89400 },
      { genre: "Hip Hop", events: 8, averageAttendance: 225, averageRevenue: 94800 },
      { genre: "House", events: 6, averageAttendance: 198, averageRevenue: 83000 },
      { genre: "Techno", events: 5, averageAttendance: 186, averageRevenue: 77500 }
    ],
    popularityByDay: [
      { genre: "Bollywood", weekday: 0.35, weekend: 0.65 },
      { genre: "EDM", weekday: 0.22, weekend: 0.78 },
      { genre: "Hip Hop", weekday: 0.28, weekend: 0.72 },
      { genre: "House", weekday: 0.30, weekend: 0.70 },
      { genre: "Techno", weekday: 0.25, weekend: 0.75 }
    ],
    customerPreferences: {
      repeatVisitsByGenre: {
        "Bollywood": 0.42, // 42% of customers returned for the same genre
        "EDM": 0.58,
        "Hip Hop": 0.45,
        "House": 0.51,
        "Techno": 0.53
      },
      crossGenreAttendance: 0.38 // percentage of customers attending multiple genres
    }
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const GuestProfileAnalytics = ({ timeRange }) => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // Simulated detailed profiles
  const guestProfiles = [
    { id: 1, name: 'Arjun Sharma', phone: '+91 98765 43210', email: 'arjun.s@gmail.com', dob: '2025-04-07', gender: 'Male', instagram: '@arjun_s', visits: 8, lastVisit: '2025-03-28', referral: 'Mike PR' },
    { id: 2, name: 'Priya Mehta', phone: '+91 87654 32109', email: 'priya.m@gmail.com', dob: '2025-04-08', gender: 'Female', instagram: '@priya_mehta', visits: 3, lastVisit: '2025-04-01', referral: 'App Discovery' },
    { id: 3, name: 'Alex Wong', phone: '+91 76543 21098', email: 'alex.w@gmail.com', dob: '2025-04-09', gender: 'Male', instagram: '@alex_w', visits: 12, lastVisit: '2025-04-02', referral: 'Sarah PR' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Guest Profile Analytics</h2>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 rounded-full text-sm font-medium">
          {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}: {dummyData.guestStats.totalGuests} guests
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Guests</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.guestStats.totalGuests}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +3.5% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">New Guests</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.guestStats.newGuests}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +2.2% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Returning Guests</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.guestStats.returningGuests}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +4.2% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Retention Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.guestStats.conversionRate}%
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +1.8% from last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.ageDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} guests`, 'Count']} />
              <Bar dataKey="count" name="Guests" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.genderDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="gender"
                label={({ gender, percent }) => `${gender}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#0088FE" />
                <Cell fill="#FF8042" />
                <Cell fill="#00C49F" />
              </Pie>
              <Tooltip formatter={(value) => [`${value} guests`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Visit Frequency */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Visit Frequency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.visitsFrequency} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} guests`, 'Count']} />
              <Bar dataKey="count" name="Guests" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Location Heatmap - REMOVED */}

        {/* Attendance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.attendanceByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="guests" stroke="#8884d8" name="Total Guests" />
              <Line type="monotone" dataKey="newGuests" stroke="#82ca9d" name="New Guests" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Arrival Times */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Popular Arrival Times</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyData.popularArrivalTimes} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} guests`, 'Count']} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
                name="Guests" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Loyalty Tiers - REMOVED */}

        {/* Average Spend by Demographic - REMOVED */}

        {/* Tiered Entry Distribution - NEW */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tiered Entry Distribution</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Early Entry (Free)</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {dummyData.tieredEntryData.tiers[0].scanned}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dummyData.tieredEntryData.tiers[0].percentage}% of guests
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Regular (₹500)</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {dummyData.tieredEntryData.tiers[1].scanned}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dummyData.tieredEntryData.tiers[1].percentage}% of guests
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Late Entry (₹800)</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                {dummyData.tieredEntryData.tiers[2].scanned}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {dummyData.tieredEntryData.tiers[2].percentage}% of guests
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.tieredEntryData.tiers} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tier" />
              <YAxis />
              <Tooltip formatter={(value, name, props) => {
                if (name === "scanned") return [`${value} guests`, 'Attendance'];
                if (name === "price") return [`₹${value}`, 'Price'];
                return [value, name];
              }} />
              <Legend />
              <Bar dataKey="scanned" name="Attendance" fill="#8884d8" />
              <Bar dataKey="price" name="Price (₹)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tiered Entry Revenue - NEW */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tiered Entry Revenue</h3>
        <div className="flex flex-col lg:flex-row justify-between mb-6">
          <div className="flex-1 text-center mb-4 lg:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Regular Tier Revenue</p>
            <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
              ₹{dummyData.tieredEntryData.revenue.regularTier.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 text-center mb-4 lg:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Late Tier Revenue</p>
            <p className="mt-1 text-2xl font-semibold text-purple-600 dark:text-purple-400">
              ₹{dummyData.tieredEntryData.revenue.lateTier.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 text-center mb-4 lg:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tier Upgrade Revenue</p>
            <p className="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">
              ₹{dummyData.tieredEntryData.partialGroups.additionalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
              ₹{dummyData.tieredEntryData.revenue.total.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium mb-2">Partial Group Insights:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{dummyData.tieredEntryData.partialGroups.totalPartialScans} groups had members arriving at different times</li>
                <li>Average time between first and last group member: {dummyData.tieredEntryData.partialGroups.averageTimeBetweenScans}</li>
                <li>{dummyData.tieredEntryData.partialGroups.tieredUpgrades} guests had to pay tier price difference due to late arrival</li>
                <li>This generated additional ₹{dummyData.tieredEntryData.partialGroups.additionalRevenue.toLocaleString()} in revenue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Contest Participation - NEW */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Photo Contest Participation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Tickets Scanned</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {dummyData.photoContestData.participation.ticketsScanned}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Photo Participants</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {dummyData.photoContestData.participation.photoParticipants}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Participation Rate</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {dummyData.photoContestData.participation.participationRate}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Photos Submitted</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {dummyData.photoContestData.participation.photosSubmitted}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Photo Engagement Metrics</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {dummyData.photoContestData.engagement.totalLikes.toLocaleString()}
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {dummyData.photoContestData.engagement.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Likes/Photo</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {dummyData.photoContestData.engagement.averageLikesPerPhoto}
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Views/Photo</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {dummyData.photoContestData.engagement.averageViewsPerPhoto}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conversion Impact</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li><span className="font-medium">Return Rate:</span> {dummyData.photoContestData.conversionData.returnRate}% of participants returned for future events</li>
                <li><span className="font-medium">Social Media Shares:</span> {dummyData.photoContestData.conversionData.sharedOnSocialMedia} photos shared on social platforms</li>
                <li><span className="font-medium">Referral Visits:</span> {dummyData.photoContestData.conversionData.socialMediaReferrals} new customers from social shares</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Top Performing Photos</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Photo ID</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Participant</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Likes</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dummyData.photoContestData.topPhotos.map((photo, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{photo.id}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{photo.participantName}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-red-500 dark:text-red-400">{photo.likes}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-blue-500 dark:text-blue-400">{photo.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Music Genre Analysis - NEW */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Music Genre Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Attendance & Revenue by Genre</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={dummyData.musicTypeData.genres} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="genre" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" domain={[60000, 110000]} tickFormatter={(value) => `₹${value/1000}K`} />
                <Tooltip formatter={(value, name) => {
                  if (name === "averageAttendance") return [`${value} guests`, 'Avg. Attendance'];
                  if (name === "averageRevenue") return [`₹${value.toLocaleString()}`, 'Avg. Revenue'];
                  return [value, name];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="averageAttendance" name="Avg. Attendance" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="averageRevenue" name="Avg. Revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Genre Popularity by Day</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={dummyData.musicTypeData.popularityByDay} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <YAxis dataKey="genre" type="category" />
                <Tooltip formatter={(value) => [`${(value * 100).toFixed(0)}%`, 'Popularity']} />
                <Legend />
                <Bar dataKey="weekday" name="Weekday" stackId="a" fill="#8884d8" />
                <Bar dataKey="weekend" name="Weekend" stackId="a" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Customer Genre Loyalty</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {Object.entries(dummyData.musicTypeData.customerPreferences.repeatVisitsByGenre).map(([genre, rate], index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{genre}</p>
                  <div className="mt-2 mb-1 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${rate * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{(rate * 100).toFixed(0)}% return rate</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium mb-2">Key Insights:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>EDM events have the highest customer return rate at {(dummyData.musicTypeData.customerPreferences.repeatVisitsByGenre.EDM * 100).toFixed(0)}%</li>
                  <li>{(dummyData.musicTypeData.customerPreferences.crossGenreAttendance * 100).toFixed(0)}% of customers attend events with different music genres</li>
                  <li>Weekend events attract 73% of total attendance across all genres</li>
                  <li>Bollywood nights generate the highest average revenue at ₹{dummyData.musicTypeData.genres[0].averageRevenue.toLocaleString()}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Booking Insights - NEW */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Group Booking Insights</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Group Size by Entry Tier</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={dummyData.tieredEntryData.groupSizeTiers} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tier" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="solo" name="Solo" stackId="a" fill="#8884d8" />
                <Bar dataKey="pairs" name="Pairs" stackId="a" fill="#82ca9d" />
                <Bar dataKey="threeToFour" name="3-4 People" stackId="a" fill="#ffc658" />
                <Bar dataKey="fivePlus" name="5+ People" stackId="a" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Group Arrival Patterns</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Complete Group Arrivals</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {1876 - dummyData.tieredEntryData.partialGroups.totalPartialScans} groups
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${((1876 - dummyData.tieredEntryData.partialGroups.totalPartialScans) / 1876 * 100).toFixed(1)}%` }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {((1876 - dummyData.tieredEntryData.partialGroups.totalPartialScans) / 1876 * 100).toFixed(1)}% of groups arrived together
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Partial Group Arrivals</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {dummyData.tieredEntryData.partialGroups.totalPartialScans} groups
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${(dummyData.tieredEntryData.partialGroups.totalPartialScans / 1876 * 100).toFixed(1)}%` }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {(dummyData.tieredEntryData.partialGroups.totalPartialScans / 1876 * 100).toFixed(1)}% of groups had members arriving separately
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Tier Upgrades Required</span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {dummyData.tieredEntryData.partialGroups.tieredUpgrades} guests
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${(dummyData.tieredEntryData.partialGroups.tieredUpgrades / dummyData.tieredEntryData.partialGroups.totalPartialScans * 100).toFixed(1)}%` }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {(dummyData.tieredEntryData.partialGroups.tieredUpgrades / dummyData.tieredEntryData.partialGroups.totalPartialScans * 100).toFixed(1)}% of partial groups required tier upgrades
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Interests */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Guest Interests</h3>
        <div className="flex flex-wrap gap-2">
          {dummyData.topInterests.map((interest, index) => {
            // Calculate size based on popularity
            const maxCount = Math.max(...dummyData.topInterests.map(i => i.count));
            const minCount = Math.min(...dummyData.topInterests.map(i => i.count));
            const range = maxCount - minCount;
            const fontSize = 14 + ((interest.count - minCount) / range) * 12; // Scale between 14px and 26px
            
            return (
              <div 
                key={index}
                className="px-3 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                style={{ fontSize: `${fontSize}px` }}
              >
                {interest.interest} ({interest.count})
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium mb-2">Key Insights:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The 22-25 age group makes up the largest segment of our audience (28%)</li>
                <li>Peak arrival time is 10 PM, with 246 guests arriving in that hour</li>
                <li>63% of guests are returning customers, showing strong retention</li>
                <li>Male guests in the 31-40 demographic have the highest average spend</li>
                <li>Most guests come from within a 15-mile radius (65%)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Profiles Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2 xl:col-span-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Guest Profiles</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search guests..."
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instagram</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referral</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {guestProfiles.map((profile) => (
                <tr 
                  key={profile.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{profile.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{profile.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{profile.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-400">{profile.instagram}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{profile.visits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{profile.lastVisit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{profile.referral}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline">View</button>
                    <button className="text-green-600 dark:text-green-400 hover:underline">Contact</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trend Analysis: New vs Returning Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2 xl:col-span-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Trend Analysis: New vs Returning Visitors</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dummyData.returnVisits}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newUsers" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="returningUsers" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Upcoming Birthdays Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2 xl:col-span-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Birthdays (Next 7 Days)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Birthday Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days Away</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dummyData.upcomingBirthdays.map((birthday, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{birthday.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(birthday.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{birthday.daysAway} days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline">Send Promo</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* iOS App Data Integration Section */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">iOS App Data Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Ticket Usage Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets Sold</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.ticketUsageStats.totalTicketsSold}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +8.5% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tickets Scanned</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.ticketUsageStats.ticketsScanned}
          </p>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${dummyData.ticketUsageStats.scanConversionRate}%` }}></div>
            </div>
            <span className="ml-2 text-sm">{dummyData.ticketUsageStats.scanConversionRate}%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Unused Tickets</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.ticketUsageStats.unusedTickets}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {((dummyData.ticketUsageStats.unusedTickets / dummyData.ticketUsageStats.totalTicketsSold) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Scan Time</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.ticketUsageStats.averageScanTime}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Peak time: 10PM - 11PM
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Group Size Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Group Size Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.groupSizeDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="size" />
              <YAxis />
              <Tooltip formatter={(value, name, props) => [props.payload.count, `Group Size`]} />
              <Bar dataKey="percentage" name="Percentage" fill="#0088FE">
                {dummyData.groupSizeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium">Key Insight:</p>
            <p>Most customers (74%) come in small groups of 1-2 people.</p>
          </div>
        </div>

        {/* Purchase Timing */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Purchase Timing Patterns</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.purchaseTimeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
                nameKey="timeFrame"
                label={({ timeFrame, percent }) => `${timeFrame}: ${(percent * 100).toFixed(0)}%`}
              >
                {dummyData.purchaseTimeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium">Key Insight:</p>
            <p>67% of tickets are purchased within 3 days of the event.</p>
          </div>
        </div>

        {/* Customer Lifetime Value */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Lifetime Value by Segment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.customerLifetimeValue.byFrequency} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'CLV']} />
              <Bar dataKey="value" name="Lifetime Value" fill="#8884d8">
                {dummyData.customerLifetimeValue.byFrequency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium">Key Insight:</p>
            <p>VIP customers represent 13.7x more value than one-time visitors.</p>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.revenueTrends.revenueByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium">Key Insight:</p>
            <p>Revenue has been steadily increasing with a 33.8% growth since January.</p>
          </div>
        </div>
      </div>

      {/* Top Regular Customers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Regular Customers</h3>
          <button className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium">
            View All Regulars
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Visits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dummyData.regularCustomerInsights.topRegulars.map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.visits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(customer.totalSpend)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline mr-3">View Details</button>
                    <button className="text-green-600 dark:text-green-400 hover:underline">Send Offer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* iOS Insights Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">iOS App Data Insights Summary</h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <h4 className="font-medium mb-2">Ticket Usage Patterns:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>76.6% of purchased tickets are scanned at the venue</li>
                <li>Peak arrival time is between 10 PM - 11 PM</li>
                <li>Early arrivals (before 9:30 PM): {dummyData.ticketUsageStats.earlyArrivals} guests</li>
                <li>No-shows account for 23.4% of ticket sales</li>
              </ul>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <h4 className="font-medium mb-2">Customer Behavior:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Couples (groups of 2) are our largest customer segment</li>
                <li>Most tickets are purchased 1-3 days before the event</li>
                <li>Regular customers spend 15% more than one-time visitors</li>
                <li>Customer retention rate is 68%</li>
                <li>Average customer lifetime value: {formatCurrency(dummyData.customerLifetimeValue.average)}</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <h4 className="font-medium mb-2">Revenue Insights:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Total revenue to date: {formatCurrency(dummyData.revenueTrends.totalRevenue)}</li>
              <li>Average ticket price: {formatCurrency(dummyData.revenueTrends.averageTicketPrice)}</li>
              <li>Premium tickets account for 29% of total revenue</li>
              <li>Monthly revenue is growing at an average rate of 6.7%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Predictive Analytics Section */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Future Projections & Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Forecast */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">6-Month Attendance Forecast</h3>
            <select className="px-2 py-1 text-sm border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Next 6 Months</option>
              <option>Next 12 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.predictiveAnalytics.attendanceForecasts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="forecasted" stroke="#8884d8" activeDot={{ r: 8 }} name="Projected Attendance" />
              <Line type="monotone" dataKey="upperBound" stroke="#82ca9d" strokeDasharray="5 5" name="Upper Bound" />
              <Line type="monotone" dataKey="lowerBound" stroke="#ff8042" strokeDasharray="5 5" name="Lower Bound" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium">Key Insight:</p>
            <p>Attendance is forecast to grow 25.7% over the next 6 months, with strongest growth in November-December.</p>
          </div>
        </div>

        {/* Churn Risk Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Churn Risk Analysis</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg text-center">
              <p className="text-sm text-red-800 dark:text-red-200">High Risk</p>
              <p className="text-2xl font-bold text-red-800 dark:text-red-200">{dummyData.predictiveAnalytics.churnPrediction.highRisk}</p>
              <p className="text-xs text-red-800 dark:text-red-200">customers</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg text-center">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">Medium Risk</p>
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{dummyData.predictiveAnalytics.churnPrediction.mediumRisk}</p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200">customers</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg text-center">
              <p className="text-sm text-green-800 dark:text-green-200">Low Risk</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">{dummyData.predictiveAnalytics.churnPrediction.lowRisk}</p>
              <p className="text-xs text-green-800 dark:text-green-200">customers</p>
            </div>
          </div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Churn Factors</h4>
          <div className="space-y-2">
            {dummyData.predictiveAnalytics.churnPrediction.churnFactors.map((factor, index) => (
              <div key={index} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${factor.weight}%` }}></div>
                </div>
                <span className="ml-2 text-xs min-w-[32px]">{factor.weight}%</span>
                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">{factor.factor}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
            View At-Risk Customers
          </button>
        </div>

        {/* Revenue Projection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Projection</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Next Quarter Projection</p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(dummyData.predictiveAnalytics.revenueProjection.nextQuarter)}
              </p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
              +{dummyData.predictiveAnalytics.revenueProjection.growthRate}% Expected Growth
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart 
              data={dummyData.predictiveAnalytics.revenueProjection.byTicketType} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 55000]} tickFormatter={(value) => formatCurrency(value)} />
              <YAxis dataKey="type" type="category" />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
              <Legend />
              <Bar dataKey="current" name="Current Revenue" fill="#8884d8" />
              <Bar dataKey="projected" name="Projected Revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Segment Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Segment Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={dummyData.predictiveAnalytics.customerSegmentGrowth} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name === 'change' ? 'Projected Change %' : name]} />
              <Legend />
              <Bar dataKey="current" name="Current Count" fill="#8884d8" />
              <Bar dataKey="projected" name="Projected Count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium">Positive Trend:</p>
              <p>High-value customer segments are projected to grow significantly, with VIP customers increasing by 26.1%.</p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium">Action Item:</p>
              <p>Focus retention strategies on converting one-time visitors to repeat customers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data-Driven Strategic Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Ticket Optimization</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Promote early ticket purchases with tiered pricing</li>
              <li>Implement group discounts for parties of 3+</li>
              <li>Create premium ticket packages for VIP customers</li>
              <li>Offer incentives for customers who frequently have unused tickets</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
            <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Customer Retention</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Target high-risk churn segments with personalized offers</li>
              <li>Create loyalty program with rewards scaling by visit frequency</li>
              <li>Implement automated follow-ups for customers inactive {'>'} 30 days</li>
              <li>Develop targeted re-engagement campaigns based on past behavior</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
            <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Revenue Growth</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Expand VIP ticket offerings with exclusive perks</li>
              <li>Implement dynamic pricing based on demand forecasts</li>
              <li>Create data-driven upsell opportunities at key moments</li>
              <li>Develop partnerships targeting couples (largest customer segment)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Guest Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Guest Profile: {selectedProfile.name}</h3>
              <button 
                onClick={() => setSelectedProfile(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-lg text-gray-900 dark:text-white">{selectedProfile.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-lg text-gray-900 dark:text-white">{selectedProfile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                <p className="text-lg text-gray-900 dark:text-white">{new Date(selectedProfile.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                <p className="text-lg text-gray-900 dark:text-white">{selectedProfile.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Instagram</p>
                <p className="text-lg text-blue-600 dark:text-blue-400">{selectedProfile.instagram}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Visits</p>
                <p className="text-lg text-gray-900 dark:text-white">{selectedProfile.visits}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Visit</p>
                <p className="text-lg text-gray-900 dark:text-white">{selectedProfile.lastVisit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Referral Source</p>
                <p className="text-lg text-gray-900 dark:text-white">{selectedProfile.referral}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Send Message
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                View History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestProfileAnalytics; 