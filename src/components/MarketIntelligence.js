import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MarketIntelligence = () => {
  const [selectedArea, setSelectedArea] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  // Example data - In production, this would come from real APIs
  const marketData = {
    competitorPricing: [
      { venue: "Club A", regularEntry: 700, peakEntry: 1200, rating: 4.2 },
      { venue: "Club B", regularEntry: 500, peakEntry: 800, rating: 4.5 },
      { venue: "Club C", regularEntry: 600, peakEntry: 1000, rating: 3.9 },
      { venue: "Your Club", regularEntry: 500, peakEntry: 800, rating: 4.3 },
    ],
    areaEvents: [
      { date: "2024-03-20", events: 3, expectedAttendance: 2500, type: "Concerts" },
      { date: "2024-03-21", events: 1, expectedAttendance: 5000, type: "Sports" },
      { date: "2024-03-22", events: 2, expectedAttendance: 3000, type: "Festivals" },
    ],
    weatherForecast: [
      { date: "2024-03-20", temp: 22, precipitation: 10, condition: "Clear" },
      { date: "2024-03-21", temp: 24, precipitation: 0, condition: "Sunny" },
      { date: "2024-03-22", temp: 20, precipitation: 60, condition: "Rain" },
    ],
    socialTrends: [
      { trend: "#NightlifeDelhi", mentions: 1200, sentiment: 0.8 },
      { trend: "#WeekendVibes", mentions: 2300, sentiment: 0.9 },
      { trend: "#ClubScene", mentions: 800, sentiment: 0.7 },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Intelligence</h2>
        <div className="flex space-x-4">
          <select 
            value={selectedArea} 
            onChange={(e) => setSelectedArea(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="all">All Areas</option>
            <option value="central">Central Delhi</option>
            <option value="south">South Delhi</option>
            <option value="cyber">Cyber City</option>
          </select>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Competitor Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Venue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Regular Entry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Peak Entry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {marketData.competitorPricing.map((venue, index) => (
                  <tr key={index} className={venue.venue === "Your Club" ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{venue.venue}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">₹{venue.regularEntry}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">₹{venue.peakEntry}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{venue.rating}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Area Events Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Area Events Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketData.areaEvents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expectedAttendance" fill="#8884d8" name="Expected Attendance" />
              <Bar dataKey="events" fill="#82ca9d" name="Number of Events" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weather Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weather Impact Analysis</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {marketData.weatherForecast.map((day, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">{day.date}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{day.temp}°C</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{day.condition}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{day.precipitation}% rain</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Tip: Historical data shows a 20% increase in attendance on clear nights with temperatures between 20-25°C
            </p>
          </div>
        </div>

        {/* Social Media Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Media Trends</h3>
          <div className="space-y-4">
            {marketData.socialTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{trend.trend}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{trend.mentions} mentions</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  trend.sentiment > 0.7 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  trend.sentiment > 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {(trend.sentiment * 100).toFixed(0)}% Positive
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              🎯 Opportunity: #WeekendVibes is trending with high positive sentiment. Consider using this hashtag in your promotions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence; 