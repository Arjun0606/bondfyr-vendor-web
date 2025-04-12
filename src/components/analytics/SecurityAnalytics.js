import React, { useState } from 'react';
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
  const [selectedIncident, setSelectedIncident] = useState(null);

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

        {/* Staff Responsibilities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Staff Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.staffResponsibilities}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="staff"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {dummyData.staffResponsibilities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} staff members`, 'Count']} />
            </PieChart>
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

      {/* Recent Incidents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Incidents</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dummyData.recentIncidents.map((incident) => (
                <tr 
                  key={incident.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{incident.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{incident.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{incident.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${incident.status === 'Resolved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}
                    >
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{incident.responseTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{incident.staff}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button 
                      onClick={() => setSelectedIncident(incident)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Incident Details</h3>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Incident Type</p>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedIncident.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedIncident.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedIncident.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="text-lg">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${selectedIncident.status === 'Resolved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}
                    >
                      {selectedIncident.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Response Time</p>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedIncident.responseTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Handled By</p>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedIncident.staff}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                <p className="text-base text-gray-900 dark:text-white">
                  Security incident reported at {selectedIncident.time} in {selectedIncident.location}. 
                  The incident was classified as {selectedIncident.type.toLowerCase()} and was {selectedIncident.status.toLowerCase()} by {selectedIncident.staff}.
                  Response time was {selectedIncident.responseTime}.
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Actions Taken</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                  <li>Initial assessment by security staff</li>
                  <li>Intervention protocol followed according to incident type</li>
                  <li>Documentation completed in security log</li>
                  <li>Follow-up actions scheduled if necessary</li>
                </ul>
              </div>
              
              <div className="flex justify-end mt-6">
                <button 
                  className="mr-3 px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAnalytics; 