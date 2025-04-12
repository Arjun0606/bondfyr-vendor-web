import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

// Dummy data - replace with real data later
const dummyData = {
  currentOccupancy: 234,
  maxCapacity: 500,
  genderRatio: {
    male: 130,
    female: 95,
    other: 9,
  },
  groupStats: {
    couples: 42,
    groups: 28,
    singles: 94,
  },
  hourlyCheckins: [
    { hour: '20:00', count: 45 },
    { hour: '21:00', count: 78 },
    { hour: '22:00', count: 120 },
    { hour: '23:00', count: 89 },
    { hour: '00:00', count: 67 },
  ],
  prPerformance: [
    { name: 'John PR', guests: 45, revenue: 22500 },
    { name: 'Sarah PR', guests: 38, revenue: 19000 },
    { name: 'Mike PR', guests: 32, revenue: 16000 },
  ],
  ticketStats: {
    sold: 320,
    checkedIn: 234,
    pending: 86,
    revenue: 160000,
  },
  ageGroups: {
    '18-21': 45,
    '22-25': 89,
    '26-30': 65,
    '31-35': 25,
    '36+': 10
  },
  ticketTierPerformance: [
    { name: 'Early Bird', sold: 100, revenue: 49900, remaining: 0 },
    { name: 'Regular', sold: 150, revenue: 74900, remaining: 50 },
    { name: 'VIP', sold: 70, revenue: 35100, remaining: 30 }
  ],
  peakTimeAnalysis: {
    entryPeak: '22:00-23:00',
    orderPeak: '20:00-21:00',
    estimatedStayDuration: '3.5 hours',
    estimatedTurnover: '45%'
  },
  guestList: {
    prReferrals: [
      { name: 'Alex Smith', guests: 3, prCode: 'JOHN-lqx3p2', time: '20:30', status: 'Checked In' },
      { name: 'Maya Johnson', guests: 2, prCode: 'SARAH-m7k4t8', time: '21:15', status: 'Checked In' },
      { name: 'Daniel Brown', guests: 4, prCode: 'JOHN-9j2p5r', time: '21:45', status: 'Waiting' },
      { name: 'Priya Patel', guests: 2, prCode: 'MIKE-q8z3x7', time: '22:30', status: 'Waiting' },
      { name: 'Tom Wilson', guests: 1, prCode: 'SARAH-n5v7b2', time: '23:00', status: 'Cancelled' }
    ],
    directBookings: [
      { name: 'Jennifer Lee', guests: 2, bookingId: 'B00123', time: '20:15', status: 'Checked In' },
      { name: 'Robert Chen', guests: 6, bookingId: 'B00124', time: '21:00', status: 'Checked In' },
      { name: 'Sarah Miller', guests: 4, bookingId: 'B00125', time: '21:30', status: 'Waiting' },
      { name: 'Kevin Wong', guests: 2, bookingId: 'B00126', time: '22:15', status: 'Waiting' },
      { name: 'Olivia Davis', guests: 8, bookingId: 'B00127', time: '22:45', status: 'Cancelled' }
    ]
  }
};

const GENDER_COLORS = {
  male: '#0088FE',
  female: '#FF8042',
  other: '#00C49F',
};

// Function to generate unique PR code with expiration
const generatePRCode = (prName) => {
  const timestamp = Date.now();
  const expirationTime = timestamp + (36 * 60 * 60 * 1000); // 36 hours from now
  const randomStr = Math.random().toString(36).substring(2, 5);
  const prefix = prName.split(' ')[0].toUpperCase();
  return {
    code: `${prefix}-${timestamp.toString(36)}${randomStr}`,
    createdAt: timestamp,
    expiresAt: expirationTime,
    isUsed: false,
    usedAt: null,
    usedBy: null
  };
};

const LiveOverview = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [prCodes, setPrCodes] = useState({});

  // Load saved PR codes from localStorage on component mount
  useEffect(() => {
    const savedCodes = localStorage.getItem('prCodes');
    if (savedCodes) {
      setPrCodes(JSON.parse(savedCodes));
    }
  }, []);

  // Save PR codes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('prCodes', JSON.stringify(prCodes));
  }, [prCodes]);

  // Clean up expired codes every minute
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setPrCodes(prevCodes => {
        const updatedCodes = Object.fromEntries(
          Object.entries(prevCodes).map(([prName, codes]) => [
            prName,
            codes.filter(code => code.expiresAt > now)
          ])
        );
        return updatedCodes;
      });
    }, 60000);

    return () => clearInterval(cleanup);
  }, []);

  const handleGenerateCode = (prName) => {
    const existingCodes = prCodes[prName] || [];
    const activeCodes = existingCodes.filter(code => !code.isUsed && code.expiresAt > Date.now());

    if (activeCodes.length >= 5) {
      toast.warning('Maximum 5 active codes allowed per PR');
      return;
    }

    const newCode = generatePRCode(prName);
    setPrCodes(prev => ({
      ...prev,
      [prName]: [...(prev[prName] || []), newCode]
    }));
    toast.success('New PR code generated!');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const getTimeRemaining = (expiresAt) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6 bg-gray-100 dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Overview</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Occupancy</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {dummyData.currentOccupancy}
            </p>
            <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              / {dummyData.maxCapacity}
            </p>
          </div>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(dummyData.currentOccupancy / dummyData.maxCapacity) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Sales</h3>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              ₹{dummyData.ticketStats.revenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="text-green-500">{dummyData.ticketStats.checkedIn}</span> checked in / <span className="text-blue-500">{dummyData.ticketStats.sold}</span> sold
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Group Breakdown</h3>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {dummyData.groupStats.couples} couples
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="text-purple-500">{dummyData.groupStats.groups}</span> groups • <span className="text-indigo-500">{dummyData.groupStats.singles}</span> singles
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender Ratio</h3>
          <div className="mt-2">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {((dummyData.genderRatio.female / dummyData.genderRatio.male) * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              F/M Ratio
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Check-ins */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hourly Check-ins</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.hourlyCheckins}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
                itemStyle={{ color: '#F3F4F6' }}
              />
              <Legend 
                wrapperStyle={{
                  color: '#9CA3AF'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#60A5FA" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#60A5FA' }}
                activeDot={{ r: 8, fill: '#3B82F6' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(dummyData.genderRatio).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
                labelLine={false}
                animationDuration={1500}
                animationBegin={0}
              >
                {Object.entries(dummyData.genderRatio).map(([name]) => (
                  <Cell key={name} fill={GENDER_COLORS[name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
                itemStyle={{ color: '#F3F4F6' }}
              />
              <Legend
                wrapperStyle={{
                  color: '#9CA3AF'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PR Performance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">PR Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  PR Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Guests Brought
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  PR Codes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dummyData.prPerformance.map((pr, index) => (
                <tr 
                  key={pr.name}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {pr.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{pr.guests}</span> guests
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-green-600 dark:text-green-400">₹{pr.revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${(pr.guests / Math.max(...dummyData.prPerformance.map(p => p.guests))) * 100}%`,
                          animation: `slideRight 1s ease-out ${index * 0.1 + 0.5}s both`
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleGenerateCode(pr.name)}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-200"
                      >
                        Generate Code
                      </button>
                      {prCodes[pr.name]?.filter(code => code.expiresAt > Date.now()).map((codeData, idx) => (
                        <div 
                          key={codeData.code}
                          className={`flex items-center justify-between space-x-2 ${
                            codeData.isUsed ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-700'
                          } px-2 py-1 rounded`}
                          style={{
                            animation: `fadeIn 0.3s ease-out ${idx * 0.1}s both`
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs">{codeData.code}</span>
                            {codeData.isUsed && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                (Used)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {getTimeRemaining(codeData.expiresAt)}
                            </span>
                            {!codeData.isUsed && (
                              <button
                                onClick={() => handleCopyCode(codeData.code)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add new analytics sections after the existing charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Demographics */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Age Demographics</h3>
          <div className="space-y-4">
            {Object.entries(dummyData.ageGroups).map(([range, count]) => (
              <div key={range} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{range}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(count / Math.max(...Object.values(dummyData.ageGroups))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Tier Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ticket Tier Performance</h3>
          <div className="space-y-4">
            {dummyData.ticketTierPerformance.map((tier) => (
              <div key={tier.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{tier.name}</span>
                  <span className="text-green-600 dark:text-green-400">₹{tier.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Sold: {tier.sold}</span>
                  <span>Remaining: {tier.remaining}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(tier.sold / (tier.sold + tier.remaining)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Time Analysis */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Peak Time Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Entry Peak</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{dummyData.peakTimeAnalysis.entryPeak}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Order Peak</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{dummyData.peakTimeAnalysis.orderPeak}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Stay Duration</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{dummyData.peakTimeAnalysis.estimatedStayDuration}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">(Based on historical data)</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Turnover</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{dummyData.peakTimeAnalysis.estimatedTurnover}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">(Based on historical data)</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              Note: Only entry times are tracked via QR scan. Stay duration and turnover are estimates.
            </p>
          </div>
        </div>

        {/* Guest Lists */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Guest Lists</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PR Referral Guest List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">PR Referrals</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {dummyData.guestList.prReferrals.length} Bookings
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guests</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PR Code</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dummyData.guestList.prReferrals.map((guest, index) => (
                      <tr 
                        key={guest.name + index}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          guest.status === 'Checked In' 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : guest.status === 'Cancelled' 
                              ? 'bg-red-50 dark:bg-red-900/20 text-gray-400 dark:text-gray-500' 
                              : ''
                        }`}
                        style={{
                          animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {guest.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {guest.guests}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">
                          {guest.prCode}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {guest.time}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            guest.status === 'Checked In' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : guest.status === 'Waiting'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {guest.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Direct Bookings Guest List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Direct App Bookings</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  {dummyData.guestList.directBookings.length} Bookings
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guests</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dummyData.guestList.directBookings.map((guest, index) => (
                      <tr 
                        key={guest.name + index}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                          guest.status === 'Checked In' 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : guest.status === 'Cancelled' 
                              ? 'bg-red-50 dark:bg-red-900/20 text-gray-400 dark:text-gray-500' 
                              : ''
                        }`}
                        style={{
                          animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {guest.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {guest.guests}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-purple-600 dark:text-purple-400">
                          {guest.bookingId}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {guest.time}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            guest.status === 'Checked In' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : guest.status === 'Waiting'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {guest.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Export Guest Lists
            </button>
            <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveOverview; 