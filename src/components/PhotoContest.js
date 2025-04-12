import React, { useState } from 'react';

const dummyPhotos = [
  {
    id: 1,
    imageUrl: 'https://example.com/photo1.jpg',
    uploadedBy: 'John Doe',
    uploadTime: '2024-04-05T22:30:00',
    likes: 45,
    status: 'active',
    eventName: 'Saturday Night Live',
  },
  // Add more dummy photos...
];

export const PhotoContest = () => {
  const [photos, setPhotos] = useState(dummyPhotos);
  const [timeWindow, setTimeWindow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('all');

  const togglePhotoStatus = (photoId) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, status: photo.status === 'active' ? 'hidden' : 'active' }
        : photo
    ));
  };

  const toggleTimeWindow = () => {
    setTimeWindow(!timeWindow);
    // This would trigger push notifications to all attendees
    if (!timeWindow) {
      console.log('Opening 3-minute photo upload window');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Photo Contest</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Events</option>
            <option value="1">Saturday Night Live</option>
            {/* Add more events */}
          </select>
          <button
            onClick={toggleTimeWindow}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
              timeWindow 
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {timeWindow ? 'Close Upload Window' : 'Open Upload Window'}
          </button>
        </div>
      </div>

      {timeWindow && (
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                Upload Window Active
              </h2>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Guests can upload photos for the next 3 minutes
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-200">
              2:45
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Photos
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {photos.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Likes
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {photos.reduce((sum, photo) => sum + photo.likes, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Engagement Rate
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {((photos.reduce((sum, photo) => sum + photo.likes, 0) / photos.length) || 0).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700">
              {/* Photo would go here */}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {photo.uploadedBy}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(photo.uploadTime).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  photo.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {photo.status}
                </span>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {photo.likes} likes
                  </span>
                </div>
                <button
                  onClick={() => togglePhotoStatus(photo.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg ${
                    photo.status === 'active'
                      ? 'text-red-600 hover:text-red-700'
                      : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  {photo.status === 'active' ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 