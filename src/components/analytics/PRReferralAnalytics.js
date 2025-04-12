import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Dummy data for PR & Referral analytics
const dummyData = {
  prStats: {
    totalReferrals: 248,
    conversionRate: 68, // percentage
    averageSpend: 105, // dollars
    totalRevenue: 17640, // dollars
  },
  topPRs: [
    { name: 'John Smith', referrals: 45, conversion: 72, revenue: 3240 },
    { name: 'Sarah Johnson', referrals: 38, conversion: 68, revenue: 2720 },
    { name: 'Mike Williams', referrals: 32, conversion: 75, revenue: 2520 },
    { name: 'Emily Davis', referrals: 30, conversion: 70, revenue: 2220 },
    { name: 'David Brown', referrals: 28, conversion: 64, revenue: 1890 },
  ],
  referralsByDay: [
    { day: 'Monday', count: 18 },
    { day: 'Tuesday', count: 22 },
    { day: 'Wednesday', count: 30 },
    { day: 'Thursday', count: 35 },
    { day: 'Friday', count: 48 },
    { day: 'Saturday', count: 62 },
    { day: 'Sunday', count: 33 },
  ],
  referralsByTime: [
    { time: '18:00', count: 12 },
    { time: '19:00', count: 18 },
    { time: '20:00', count: 32 },
    { time: '21:00', count: 45 },
    { time: '22:00', count: 52 },
    { time: '23:00', count: 42 },
    { time: '00:00', count: 28 },
    { time: '01:00', count: 19 },
  ],
  referralsByMethod: [
    { method: 'QR Code', count: 98 },
    { method: 'Text Link', count: 72 },
    { method: 'Email', count: 35 },
    { method: 'Social Share', count: 43 },
  ],
  conversionByPRTier: [
    { tier: 'Elite', referrals: 68, conversions: 54 },
    { tier: 'Premium', referrals: 112, conversions: 82 },
    { tier: 'Standard', referrals: 68, conversions: 32 },
  ],
  revenueByMonth: [
    { month: 'Jan', amount: 12400 },
    { month: 'Feb', amount: 13200 },
    { month: 'Mar', amount: 14800 },
    { month: 'Apr', amount: 15500 },
    { month: 'May', amount: 16700 },
    { month: 'Jun', amount: 17640 },
  ],
  leadTime: [
    { days: 'Same day', count: 58 },
    { days: '1-2 days', count: 84 },
    { days: '3-5 days', count: 62 },
    { days: '6-10 days', count: 28 },
    { days: '>10 days', count: 16 },
  ],
  spendByReferralType: [
    { type: 'PR Referral', averageSpend: 105 },
    { type: 'Guest List', averageSpend: 85 },
    { type: 'Walk-in', averageSpend: 65 },
    { type: 'Social Media', averageSpend: 75 },
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

const PRReferralAnalytics = ({ timeRange }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">PR & Referral Analytics</h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm font-medium">
          {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}: {dummyData.prStats.totalReferrals} referrals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Referrals</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.prStats.totalReferrals}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +18% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.prStats.conversionRate}%
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +4% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Spend</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(dummyData.prStats.averageSpend)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +8% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(dummyData.prStats.totalRevenue)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +12% from last month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top PRs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top PRs</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referrals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {dummyData.topPRs.map((pr, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{pr.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pr.referrals}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pr.conversion}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatCurrency(pr.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referrals by Method */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Referrals by Method</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.referralsByMethod}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="method"
                label={({ method, percent }) => `${method}: ${(percent * 100).toFixed(0)}%`}
              >
                {dummyData.referralsByMethod.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} referrals`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Referrals by Day */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Referrals by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.referralsByDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} referrals`, 'Count']} />
              <Bar dataKey="count" name="Referrals" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Referrals by Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Referrals by Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyData.referralsByTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} referrals`, 'Count']} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#00C49F" 
                fill="#00C49F" 
                fillOpacity={0.3}
                name="Referrals" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion by PR Tier */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Conversion by PR Tier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.conversionByPRTier} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tier" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="referrals" name="Total Referrals" fill="#8884d8" />
              <Bar dataKey="conversions" name="Conversions" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Referral Lead Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.leadTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="days" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} referrals`, 'Count']} />
              <Bar dataKey="count" name="Referrals" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">PR Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.revenueByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Monthly Revenue" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Average Spend Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Average Spend by Customer Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.spendByReferralType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Average Spend']} />
              <Bar dataKey="averageSpend" name="Average Spend" fill="#8884d8">
                {dummyData.spendByReferralType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              PR referrals consistently spend more per visit compared to other customer acquisition channels.
              Consider increasing PR incentives to drive more high-value referrals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRReferralAnalytics; 