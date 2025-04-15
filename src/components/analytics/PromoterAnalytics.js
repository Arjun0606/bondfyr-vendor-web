import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const PromoterAnalytics = () => {
  const [prCodes, setPrCodes] = useState({});
  const [promoterStats, setPromoterStats] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalGenerated: 0,
    totalUsed: 0,
    totalCheckedIn: 0,
    conversionRate: 0,
    pendingCheckIn: 0
  });
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedPromoter, setSelectedPromoter] = useState(null);
  const [codeHistory, setCodeHistory] = useState([]);

  const mockData = {
    totalReferrals: 248,
    totalEntries: 187,
    conversionRate: 75,
    revenue: 14250,
    topPromoters: [
      { name: 'Alex K.', referrals: 42, entries: 38, conversionRate: 90 },
      { name: 'Maria T.', referrals: 36, entries: 28, conversionRate: 78 },
      { name: 'Jay B.', referrals: 24, entries: 19, conversionRate: 79 },
      { name: 'Sarah M.', referrals: 22, entries: 15, conversionRate: 68 },
      { name: 'David R.', referrals: 19, entries: 14, conversionRate: 74 }
    ],
    historicalData: [
      { month: 'July', referrals: 180, entries: 132, conversionRate: 73 },
      { month: 'August', referrals: 195, entries: 145, conversionRate: 74 },
      { month: 'September', referrals: 212, entries: 158, conversionRate: 75 },
      { month: 'October', referrals: 248, entries: 187, conversionRate: 75 }
    ]
  };

  // Load saved PR codes from localStorage
  useEffect(() => {
    const savedCodes = localStorage.getItem('prCodes');
    if (savedCodes) {
      const parsedCodes = JSON.parse(savedCodes);
      setPrCodes(parsedCodes);
      processPromoterStats(parsedCodes);
    }
  }, []);

  // Process promoter statistics
  const processPromoterStats = (codes) => {
    const stats = [];
    let totalGenerated = 0;
    let totalUsed = 0;
    let totalCheckedIn = 0;
    let pendingCheckIn = 0;
    
    // Calculate stats for each promoter
    Object.entries(codes).forEach(([promoterName, promoterCodes]) => {
      const generated = promoterCodes.length;
      const used = promoterCodes.filter(code => code.isUsed).length;
      const checkedIn = promoterCodes.filter(code => code.checkedIn).length;
      const pending = used - checkedIn;
      const conversionRate = generated > 0 ? Math.round((checkedIn / generated) * 100) : 0;
      
      totalGenerated += generated;
      totalUsed += used;
      totalCheckedIn += checkedIn;
      pendingCheckIn += pending;
      
      stats.push({
        name: promoterName,
        generated,
        used,
        checkedIn,
        pending,
        conversionRate
      });
    });
    
    // Sort by most checked-in guests
    stats.sort((a, b) => b.checkedIn - a.checkedIn);
    
    setPromoterStats(stats);
    setTotalStats({
      totalGenerated,
      totalUsed,
      totalCheckedIn,
      pendingCheckIn,
      conversionRate: totalGenerated > 0 ? Math.round((totalCheckedIn / totalGenerated) * 100) : 0
    });
  };

  // Handle selecting a promoter for detailed view
  const handleSelectPromoter = (promoter) => {
    setSelectedPromoter(promoter);
    
    if (promoter && prCodes[promoter]) {
      // Generate code history data for charts
      const history = prCodes[promoter].map(code => ({
        code: code.code,
        createdAt: new Date(code.createdAt),
        usedAt: code.usedAt ? new Date(code.usedAt) : null,
        checkedInAt: code.checkedInAt ? new Date(code.checkedInAt) : null,
        status: code.checkedIn ? 'Checked In' : (code.isUsed ? 'Pending' : 'Unused'),
        guest: code.usedBy || 'N/A',
        timeToUse: code.usedAt ? Math.round((code.usedAt - code.createdAt) / (1000 * 60 * 60)) : null,
        timeToCheckIn: code.checkedInAt && code.usedAt ? Math.round((code.checkedInAt - code.usedAt) / (1000 * 60)) : null
      }));
      
      // Sort by creation date
      history.sort((a, b) => a.createdAt - b.createdAt);
      setCodeHistory(history);
    } else {
      setCodeHistory([]);
    }
  };

  // Filter codes based on time range
  const filterByTime = (filter) => {
    setTimeFilter(filter);
    
    const savedCodes = localStorage.getItem('prCodes');
    if (savedCodes) {
      const parsedCodes = JSON.parse(savedCodes);
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
      
      let filteredCodes = {};
      
      if (filter === 'all') {
        filteredCodes = parsedCodes;
      } else {
        Object.entries(parsedCodes).forEach(([promoterName, codes]) => {
          const timeFilter = {
            'day': oneDayAgo,
            'week': oneWeekAgo,
            'month': oneMonthAgo
          }[filter];
          
          filteredCodes[promoterName] = codes.filter(code => code.createdAt >= timeFilter);
        });
      }
      
      processPromoterStats(filteredCodes);
      
      // If a promoter is selected, update their history too
      if (selectedPromoter) {
        handleSelectPromoter(selectedPromoter);
      }
    }
  };

  // Format timestamps
  const formatTime = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  };

  // Render check-in time chart
  const renderCheckInTimeChart = () => {
    if (!codeHistory.length) return null;
    
    // Group by hour of check-in
    const checkInsByHour = {};
    codeHistory.forEach(code => {
      if (code.checkedInAt) {
        const hour = code.checkedInAt.getHours();
        checkInsByHour[hour] = (checkInsByHour[hour] || 0) + 1;
      }
    });
    
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: checkInsByHour[i] || 0
    }));
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Check-in Times</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} guests`, 'Check-ins']} />
            <Bar dataKey="count" fill="#8884d8" name="Check-ins" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // Render conversion funnel
  const renderConversionFunnel = () => {
    if (!selectedPromoter) return null;
    
    const promoter = promoterStats.find(p => p.name === selectedPromoter);
    if (!promoter) return null;
    
    const data = [
      { name: 'Generated', value: promoter.generated },
      { name: 'Used', value: promoter.used },
      { name: 'Checked In', value: promoter.checkedIn }
    ];
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Conversion Funnel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} codes`, '']} />
            <Bar dataKey="value" fill="#82ca9d" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Promoter Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Referrals</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{mockData.totalReferrals}</p>
          <span className="text-green-500 text-sm">↑ 12% from last month</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Entries</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{mockData.totalEntries}</p>
          <span className="text-green-500 text-sm">↑ 15% from last month</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Conversion Rate</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{mockData.conversionRate}%</p>
          <span className="text-green-500 text-sm">↑ 2% from last month</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Revenue Generated</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">₹{mockData.revenue.toLocaleString()}</p>
          <span className="text-green-500 text-sm">↑ 18% from last month</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Top Performing Promoters</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Promoter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referrals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entries</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockData.topPromoters.map((promoter, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{promoter.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{promoter.referrals}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{promoter.entries}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{promoter.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Historical Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referrals</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entries</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockData.historicalData.map((month, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{month.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{month.referrals}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{month.entries}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{month.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoterAnalytics; 