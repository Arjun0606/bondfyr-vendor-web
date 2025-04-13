import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Dummy data for security analytics
const dummyData = {
  securityStats: {
    totalIncidents: 18,
    resolutionRate: 94.4, // percentage
    avgResponseTime: 3.2, // minutes
    staffUtilization: 82, // percentage
  },
  incidentsByType: [
    { type: 'Unauthorized Access', count: 5 },
    { type: 'Intoxication', count: 8 },
    { type: 'Altercation', count: 3 },
    { type: 'Medical', count: 2 },
    { type: 'Other', count: 1 }
  ],
  incidentsByTimeSlot: [
    { hour: '19:00-20:00', count: 1 },
    { hour: '20:00-21:00', count: 2 },
    { hour: '21:00-22:00', count: 3 },
    { hour: '22:00-23:00', count: 7 },
    { hour: '23:00-00:00', count: 5 },
    { hour: '00:00-01:00', count: 0 },
    { hour: '01:00-02:00', count: 0 }
  ],
  incidentsByLocation: [
    { location: 'Main Entrance', count: 3 },
    { location: 'VIP Area', count: 2 },
    { location: 'Bar', count: 5 },
    { location: 'Dance Floor', count: 4 },
    { location: 'Restrooms', count: 1 },
    { location: 'Outdoor Patio', count: 3 }
  ],
  staffingLevels: [
    { hour: '19:00', regular: 10, supervisors: 2 },
    { hour: '20:00', regular: 12, supervisors: 2 },
    { hour: '21:00', regular: 15, supervisors: 3 },
    { hour: '22:00', regular: 18, supervisors: 4 },
    { hour: '23:00', regular: 20, supervisors: 4 },
    { hour: '00:00', regular: 22, supervisors: 4 },
    { hour: '01:00', regular: 20, supervisors: 4 },
  ],
  incidentResolutionTime: [
    { type: 'Unauthorized Access', avgTime: 2.5 },
    { type: 'Intoxication', avgTime: 3.8 },
    { type: 'Altercation', avgTime: 4.2 },
    { type: 'Medical', avgTime: 1.5 },
    { type: 'Other', avgTime: 2.0 }
  ],
  staffResponsibilities: [
    { name: 'Entrance Verification', staff: 5 },
    { name: 'Floor Monitoring', staff: 8 },
    { name: 'VIP Area', staff: 3 },
    { name: 'Incident Response', staff: 4 },
    { name: 'Management & Supervision', staff: 4 }
  ],
  patrolEfficiency: [
    { area: 'Main Entrance', coverage: 95 },
    { area: 'VIP Area', coverage: 92 },
    { area: 'Bar', coverage: 85 },
    { area: 'Dance Floor', coverage: 90 },
    { area: 'Restrooms', coverage: 75 },
    { area: 'Outdoor Patio', coverage: 80 }
  ],
  historicalIncidents: [
    { date: '01/01/2023', incidents: 16, resolved: 15 },
    { date: '01/08/2023', incidents: 13, resolved: 13 },
    { date: '01/15/2023', incidents: 22, resolved: 20 },
    { date: '01/22/2023', incidents: 14, resolved: 14 },
    { date: '01/29/2023', incidents: 18, resolved: 18 },
    { date: '02/05/2023', incidents: 15, resolved: 14 },
    { date: '02/12/2023', incidents: 18, resolved: 17 }
  ],
  recentIncidents: [
    { id: 1, type: 'Unauthorized Access', location: 'Main Entrance', time: '22:15', status: 'Resolved', responseTime: '2 min', staff: 'John D.' },
    { id: 2, type: 'Intoxication', location: 'Bar', time: '23:05', status: 'Resolved', responseTime: '4 min', staff: 'Lisa M.' },
    { id: 3, type: 'Altercation', location: 'Dance Floor', time: '21:50', status: 'Resolved', responseTime: '3 min', staff: 'Robert S.' },
    { id: 4, type: 'Medical', location: 'Restrooms', time: '00:10', status: 'Resolved', responseTime: '2 min', staff: 'Maria G.' },
    { id: 5, type: 'Intoxication', location: 'VIP Area', time: '22:40', status: 'In Progress', responseTime: '5 min', staff: 'David A.' }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SecurityAnalytics = ({ timeRange }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Analytics</h2>
        <span className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
          {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}: {dummyData.securityStats.totalIncidents} incidents
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Incidents</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.securityStats.totalIncidents}
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            +3 from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolution Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.securityStats.resolutionRate}%
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +2.1% from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Response Time</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.securityStats.avgResponseTime} min
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            -0.3 min from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff Utilization</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.securityStats.staffUtilization}%
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Optimal range
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Incidents by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.incidentsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="type"
                label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
              >
                {dummyData.incidentsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} incidents`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents by Time Slot */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Incidents by Time Slot</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.incidentsByTimeSlot} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} incidents`, 'Count']} />
              <Bar dataKey="count" name="Incidents" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents by Location */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Incidents by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.incidentsByLocation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="location" type="category" width={120} />
              <Tooltip formatter={(value) => [`${value} incidents`, 'Count']} />
              <Bar dataKey="count" name="Incidents" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Staffing Levels */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Staffing Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyData.staffingLevels} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="regular" stackId="1" stroke="#8884d8" fill="#8884d8" name="Regular Staff" />
              <Area type="monotone" dataKey="supervisors" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Supervisors" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Resolution Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Incident Resolution Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.incidentResolutionTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value} minutes`, 'Average Resolution Time']} />
              <Bar dataKey="avgTime" name="Avg. Resolution Time" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Patrol Efficiency */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Patrol Coverage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.patrolEfficiency} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis domain={[0, 100]} label={{ value: 'Coverage %', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Coverage']} />
              <Bar dataKey="coverage" name="Area Coverage" fill="#00C49F">
                {dummyData.patrolEfficiency.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.coverage >= 90 ? '#00C49F' : entry.coverage >= 80 ? '#FFBB28' : '#FF8042'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Incidents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Historical Incidents</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.historicalIncidents} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="incidents" stroke="#8884d8" name="Total Incidents" />
              <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved Incidents" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalytics; 