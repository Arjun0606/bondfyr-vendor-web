import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

// Dummy data for photo contest analytics
const dummyData = {
  photoStats: {
    totalUploaded: 245,
    totalLikes: 1873,
    totalVoters: 632,
    engagementRate: 73, // percentage
  },
  uploadTimeDistribution: [
    { hour: '19:00', count: 15 },
    { hour: '20:00', count: 28 },
    { hour: '21:00', count: 47 },
    { hour: '22:00', count: 63 },
    { hour: '23:00', count: 42 },
    { hour: '00:00', count: 32 },
    { hour: '01:00', count: 18 }
  ],
  photosByTier: [
    { tier: 'General', count: 145, likes: 984 },
    { tier: 'VIP', count: 85, likes: 742 },
    { tier: 'VVIP', count: 15, likes: 147 }
  ],
  topPhotos: [
    { id: 1, name: 'Arjun & Friends', likes: 187, uploader: 'Arjun S.', time: '22:15', url: 'https://source.unsplash.com/random/300x200/?party' },
    { id: 2, name: 'VIP Lounge', likes: 153, uploader: 'Priya M.', time: '23:05', url: 'https://source.unsplash.com/random/300x200/?club' },
    { id: 3, name: 'Dance Floor', likes: 132, uploader: 'Alex W.', time: '21:50', url: 'https://source.unsplash.com/random/300x200/?dancing' },
    { id: 4, name: 'DJ Set', likes: 118, uploader: 'Sarah J.', time: '00:10', url: 'https://source.unsplash.com/random/300x200/?dj' },
    { id: 5, name: 'Cocktail Bar', likes: 97, uploader: 'Mike T.', time: '22:40', url: 'https://source.unsplash.com/random/300x200/?cocktail' }
  ],
  topInfluencers: [
    { name: 'Arjun S.', photos: 4, likes: 345, followers: 12500 },
    { name: 'Priya M.', photos: 3, likes: 286, followers: 8700 },
    { name: 'Alex W.', photos: 5, likes: 264, followers: 7300 },
    { name: 'Sarah J.', photos: 2, likes: 236, followers: 9200 },
    { name: 'Mike T.', photos: 3, likes: 204, followers: 6800 }
  ],
  voterEngagement: [
    { category: 'Voters who uploaded', value: 187 },
    { category: 'Voters who did not upload', value: 445 }
  ],
  engagementTrend: [
    { month: 'Jan', photos: 185, likes: 1240 },
    { month: 'Feb', photos: 196, likes: 1380 },
    { month: 'Mar', photos: 220, likes: 1520 },
    { month: 'Apr', photos: 235, likes: 1680 },
    { month: 'May', photos: 240, likes: 1780 },
    { month: 'Jun', photos: 245, likes: 1873 }
  ],
  groupPhotoStats: {
    soloPhotos: 87,
    duoPhotos: 103,
    groupPhotos: 55
  }
};

const PhotoContestAnalytics = ({ timeRange }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const groupPhotoData = [
    { name: 'Solo Photos', value: dummyData.groupPhotoStats.soloPhotos },
    { name: 'Duo Photos', value: dummyData.groupPhotoStats.duoPhotos },
    { name: 'Group Photos', value: dummyData.groupPhotoStats.groupPhotos }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Photo Contest Analytics</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm font-medium">
          {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}: {dummyData.photoStats.totalUploaded} photos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Photos Uploaded</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.photoStats.totalUploaded}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +5 from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Likes</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.photoStats.totalLikes}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +93 from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Voters</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.photoStats.totalVoters}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +52 from last event
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {dummyData.photoStats.engagementRate}%
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            +5% from last event
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Time Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dummyData.uploadTimeDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} photos`, 'Uploads']} />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Photos by Ticket Tier */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Photos by Ticket Tier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyData.photosByTier} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tier" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Photos" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="likes" name="Likes" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Voter Engagement */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Voter Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dummyData.voterEngagement}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="category"
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#8884d8" />
                <Cell fill="#82ca9d" />
              </Pie>
              <Tooltip formatter={(value) => [`${value} voters`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Group Photo Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Group Photo Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={groupPhotoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#0088FE" />
                <Cell fill="#00C49F" />
                <Cell fill="#FFBB28" />
              </Pie>
              <Tooltip formatter={(value) => [`${value} photos`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Engagement Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dummyData.engagementTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="photos" stroke="#8884d8" name="Photos" />
              <Line yAxisId="right" type="monotone" dataKey="likes" stroke="#82ca9d" name="Likes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Photos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Top Photos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {dummyData.topPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img 
                src={photo.url} 
                alt={photo.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white truncate">{photo.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">By: {photo.uploader}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{photo.time}</span>
                  <span className="flex items-center text-sm font-medium text-red-500 dark:text-red-400">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {photo.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Influencers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Influencers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Photos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Likes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instagram Followers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dummyData.topInfluencers.map((influencer, index) => {
                const engagement = Math.round((influencer.likes / influencer.followers) * 10000) / 100; // percentage with 2 decimal places
                
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{influencer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{influencer.photos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{influencer.likes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{influencer.followers.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{engagement}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{selectedPhoto.name}</h3>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.name} 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded by</p>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedPhoto.uploader}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload Time</p>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedPhoto.time}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Likes</p>
                  <p className="text-lg text-gray-900 dark:text-white flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {selectedPhoto.likes}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Position</p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    #{dummyData.topPhotos.findIndex(p => p.id === selectedPhoto.id) + 1} of {dummyData.topPhotos.length}
                  </p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View User Profile
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoContestAnalytics; 