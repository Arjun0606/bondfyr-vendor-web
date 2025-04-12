import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Dummy data for venue analytics
const dummyData = {
  venueStats: {
    totalAttendance: 876,
    peakCapacity: 92, // percentage
    averageStay: 3.2, // hours
    totalRevenue: 58450,
  },
  capacityByHour: [
    { hour: '19:00', capacity: 30 },
    { hour: '20:00', capacity: 45 },
    { hour: '21:00', capacity: 65 },
    { hour: '22:00', capacity: 80 },
    { hour: '23:00', capacity: 92 },
    { hour: '00:00', capacity: 88 },
    { hour: '01:00', capacity: 75 },
    { hour: '02:00', capacity: 50 },
  ],
  revenueByCategory: [
    { category: 'Tickets', amount: 24800 },
    { category: 'Bar', amount: 18250 },
    { category: 'VIP Tables', amount: 12000 },
    { category: 'Merchandise', amount: 3400 },
  ],
  spaceUtilization: [
    { area: 'Dance Floor', utilization: 85 },
    { area: 'Main Bar', utilization: 92 },
    { area: 'VIP Area', utilization: 78 },
    { area: 'Lounge', utilization: 65 },
    { area: 'Outdoor Patio', utilization: 70 },
  ],
  durationOfStay: [
    { duration: '< 1 hour', count: 52 },
    { duration: '1-2 hours', count: 124 },
    { duration: '2-3 hours', count: 248 },
    { duration: '3-4 hours', count: 285 },
    { duration: '4-5 hours', count: 135 },
    { duration: '> 5 hours', count: 32 },
  ],
  revenuePerHead: [
    { hour: '19:00', amount: 72 },
    { hour: '20:00', amount: 68 },
    { hour: '21:00', amount: 75 },
    { hour: '22:00', amount: 65 },
    { hour: '23:00', amount: 58 },
    { hour: '00:00', amount: 52 },
    { hour: '01:00', amount: 48 },
    { hour: '02:00', amount: 45 },
  ],
  movementHeatmap: [
    { from: 'Entrance', to: 'Main Bar', count: 520 },
    { from: 'Main Bar', to: 'Dance Floor', count: 420 },
    { from: 'Dance Floor', to: 'VIP Area', count: 120 },
    { from: 'VIP Area', to: 'Dance Floor', count: 110 },
    { from: 'Dance Floor', to: 'Main Bar', count: 380 },
    { from: 'Main Bar', to: 'Restrooms', count: 280 },
    { from: 'Restrooms', to: 'Main Bar', count: 270 },
    { from: 'Main Bar', to: 'Outdoor Patio', count: 150 },
    { from: 'Outdoor Patio', to: 'Main Bar', count: 145 },
  ],
  revenueByMonth: [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 48000 },
    { month: 'Mar', amount: 52000 },
    { month: 'Apr', amount: 58000 },
    { month: 'May', amount: 62000 },
    { month: 'Jun', amount: 58450 },
  ],
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

const VenueAnalytics = ({ timeRange }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Venue Analytics</h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium">
          {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}: {formatCurrency(dummyData.venueStats.totalRevenue)} revenue
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Attendance</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.venueStats.totalAttendance}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +12% from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Peak Capacity</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.venueStats.peakCapacity}%
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +5% from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Stay</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.venueStats.averageStay} hrs
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +0.3 hrs from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(dummyData.venueStats.totalRevenue)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +8% from last event
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity by Hour */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Capacity by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyData.capacityByHour} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip formatter={(value) => [`${value}%`, 'Capacity']} />
              <Area 
                type="monotone" 
                dataKey="capacity" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
                name="Venue Capacity" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.revenueByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
                nameKey="category"
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
              >
                {dummyData.revenueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Space Utilization */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Space Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.spaceUtilization} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis dataKey="area" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
              <Bar 
                dataKey="utilization" 
                name="Space Utilization" 
                fill="#82ca9d"
              >
                {dummyData.spaceUtilization.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.utilization >= 80 ? '#00C49F' : entry.utilization >= 60 ? '#FFBB28' : '#FF8042'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Duration of Stay */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Duration of Stay</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.durationOfStay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="duration" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} guests`, 'Count']} />
              <Bar dataKey="count" name="Number of Guests" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Per Head */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Per Head by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.revenuePerHead} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Average Spend']} />
              <Line type="monotone" dataKey="amount" stroke="#FF8042" name="Revenue Per Head" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.revenueByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
              <Line type="monotone" dataKey="amount" stroke="#00C49F" name="Monthly Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Guest Movement Heatmap - Simplified Table Version */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Guest Movement Patterns</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Flow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dummyData.movementHeatmap.map((movement, index) => {
                // Calculate a percentage for visualization
                const max = Math.max(...dummyData.movementHeatmap.map(m => m.count));
                const percentage = (movement.count / max) * 100;
                
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{movement.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{movement.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{movement.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Key insight: The highest traffic flow is from the Entrance to the Main Bar, followed by movement between the Main Bar and Dance Floor.</p>
              <p className="mt-2">Recommendation: Consider expanding the Main Bar area or adding mobile bars during peak hours to alleviate congestion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueAnalytics; 