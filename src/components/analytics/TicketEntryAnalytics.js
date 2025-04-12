import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Dummy data for ticket & entry analytics
const dummyData = {
  ticketStats: {
    totalSold: 875,
    totalRevenue: 32850,
    averagePrice: 37.54,
    redemptionRate: 92, // percentage
  },
  ticketsByType: [
    { type: 'General Admission', count: 650, revenue: 19500 },
    { type: 'VIP', count: 175, revenue: 8750 },
    { type: 'VVIP', count: 50, revenue: 4600 },
  ],
  salesByTimeframe: [
    { timeframe: '2+ weeks before', count: 125 },
    { timeframe: '1-2 weeks before', count: 220 },
    { timeframe: '4-7 days before', count: 245 },
    { timeframe: '1-3 days before', count: 185 },
    { timeframe: 'Day of event', count: 100 },
  ],
  entriesByHour: [
    { hour: '19:00', count: 42 },
    { hour: '20:00', count: 98 },
    { hour: '21:00', count: 215 },
    { hour: '22:00', count: 245 },
    { hour: '23:00', count: 145 },
    { hour: '00:00', count: 68 },
    { hour: '01:00', count: 32 },
  ],
  salesByChannel: [
    { channel: 'Website', count: 475 },
    { channel: 'Mobile App', count: 220 },
    { channel: 'Third Party', count: 125 },
    { channel: 'Door Sales', count: 55 },
  ],
  ticketPriceHistory: [
    { date: '2 Months Before', general: 25, vip: 40, vvip: 80 },
    { date: '1 Month Before', general: 30, vip: 45, vvip: 85 },
    { date: '2 Weeks Before', general: 30, vip: 50, vvip: 90 },
    { date: '1 Week Before', general: 35, vip: 55, vvip: 95 },
    { date: 'Day Before', general: 35, vip: 55, vvip: 95 },
    { date: 'Day of Event', general: 40, vip: 60, vvip: 100 },
  ],
  genderRatio: [
    { gender: 'Male', count: 498 },
    { gender: 'Female', count: 377 },
  ],
  entranceWaitTime: [
    { hour: '19:00', time: 2 },
    { hour: '20:00', time: 5 },
    { hour: '21:00', time: 12 },
    { hour: '22:00', time: 18 },
    { hour: '23:00', time: 10 },
    { hour: '00:00', time: 7 },
    { hour: '01:00', time: 3 },
  ],
  salesByPromoCode: [
    { code: 'EARLYBIRD', count: 120, discount: 20 },
    { code: 'WEEKDAY', count: 85, discount: 15 },
    { code: 'STUDENT', count: 65, discount: 25 },
    { code: 'GROUP10', count: 45, discount: 10 },
    { code: 'SOCIAL25', count: 90, discount: 15 },
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

const TicketEntryAnalytics = ({ timeRange }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ticket & Entry Analytics</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium">
          {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}: {dummyData.ticketStats.totalSold} tickets
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets Sold</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.ticketStats.totalSold}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +15% from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(dummyData.ticketStats.totalRevenue)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +18% from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Ticket Price</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(dummyData.ticketStats.averagePrice)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +3% from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Redemption Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.ticketStats.redemptionRate}%
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +2% from last event
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tickets by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.ticketsByType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Tickets Sold" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Channel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sales by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.salesByChannel}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="channel"
                label={({ channel, percent }) => `${channel}: ${(percent * 100).toFixed(0)}%`}
              >
                {dummyData.salesByChannel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Timeframe */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sales by Timeframe</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.salesByTimeframe} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeframe" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
              <Bar dataKey="count" name="Tickets Sold" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Entries by Hour */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Entries by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyData.entriesByHour} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} entries`, 'Count']} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
                name="Entries" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Price History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ticket Price History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.ticketPriceHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Price']} />
              <Legend />
              <Line type="monotone" dataKey="general" stroke="#8884d8" name="General Admission" />
              <Line type="monotone" dataKey="vip" stroke="#82ca9d" name="VIP" />
              <Line type="monotone" dataKey="vvip" stroke="#FF8042" name="VVIP" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Ratio */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gender Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.genderRatio}
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
              </Pie>
              <Tooltip formatter={(value) => [`${value} attendees`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Entrance Wait Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Entrance Wait Time (Minutes)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.entranceWaitTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} minutes`, 'Wait Time']} />
              <Line type="monotone" dataKey="time" stroke="#FF8042" name="Wait Time" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Promo Code */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sales by Promo Code</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Promo Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tickets Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Discount %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Discount Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {dummyData.salesByPromoCode.map((promo, index) => {
                  const baseTicketPrice = dummyData.ticketStats.averagePrice;
                  const discountValue = (baseTicketPrice * promo.discount / 100) * promo.count;
                  const percentage = (promo.count / dummyData.ticketStats.totalSold) * 100;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{promo.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{promo.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{promo.discount}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(discountValue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}% of total</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Peak Entry Time</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              The peak entry time is between 10 PM - 11 PM with 245 entries, which correlates with the highest wait times.
              Consider opening additional entry points during this period.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Pricing Strategy</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Early bird pricing was effective, with 245 tickets sold 4-7 days before the event.
              This suggests that a tiered pricing strategy is working well.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Channel Performance</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              The website and mobile app account for 80% of ticket sales.
              Consider focusing marketing efforts on these channels and improving the door sales experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketEntryAnalytics; 