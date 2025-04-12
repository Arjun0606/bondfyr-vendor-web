import React from 'react';
import { useVenueAnalytics } from '../hooks/useVenueAnalytics';
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
} from 'recharts';

const COLORS = {
  male: '#0088FE',
  female: '#FF8042',
  other: '#00C49F',
};

export const VenueDashboard = () => {
  const {
    currentOccupancy,
    capacityPercentage,
    genderRatioPercentages,
    couplesCount,
    hourlyCheckins,
    photoContestStats,
    peakHours,
    staffPerformance,
  } = useVenueAnalytics();

  const genderData = Object.entries(genderRatioPercentages).map(([name, value]) => ({
    name,
    value,
  }));

  const hourlyData = Object.entries(hourlyCheckins).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Venue Dashboard</h1>
      
      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Current Occupancy</h2>
          <div className="text-4xl font-bold text-blue-600">
            {currentOccupancy}
            <span className="text-lg text-gray-500 ml-2">
              ({capacityPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Couples Count</h2>
          <div className="text-4xl font-bold text-pink-600">{couplesCount}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Peak Hours</h2>
          <div className="text-lg">
            {peakHours.map(hour => (
              <span key={hour} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded mr-2">
                {hour}:00
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Gender Ratio */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Gender Ratio</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={genderData}
              cx={200}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
            >
              {genderData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Hourly Check-ins */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hourly Check-ins</h2>
          <LineChart width={400} height={300} data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
      </div>

      {/* Photo Contest Stats */}
      {photoContestStats && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Photo Contest</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Total Photos</h3>
              <p className="text-3xl font-bold text-purple-600">
                {photoContestStats.totalPhotos}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Total Votes</h3>
              <p className="text-3xl font-bold text-purple-600">
                {photoContestStats.totalVotes}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Engagement Rate</h3>
              <p className="text-3xl font-bold text-purple-600">
                {(photoContestStats.engagementRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Staff Performance */}
      {Object.keys(staffPerformance).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Staff Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Total Scans</h3>
              <p className="text-3xl font-bold text-green-600">
                {staffPerformance.totalScans}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Avg. Processing Time</h3>
              <p className="text-3xl font-bold text-green-600">
                {staffPerformance.averageProcessingTime}s
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Issues Resolved</h3>
              <p className="text-3xl font-bold text-green-600">
                {staffPerformance.issuesResolved}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Last Active</h3>
              <p className="text-xl text-gray-600">
                {staffPerformance.lastActive
                  ? new Date(staffPerformance.lastActive).toLocaleTimeString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 