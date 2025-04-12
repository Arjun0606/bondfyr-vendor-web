import React, { useState, useEffect } from 'react';
import eventManagementService from '../services/eventManagementService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EventManagement = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventMetrics, setEventMetrics] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    poster_url: '',
    music_genre: [],
    event_type: '',
    target_demographics: [],
    ticket_tiers: []
  });

  useEffect(() => {
    if (selectedEvent) {
      loadEventMetrics(selectedEvent);
    }
  }, [selectedEvent]);

  const loadEventMetrics = async (eventId) => {
    setLoading(true);
    try {
      const metrics = await eventManagementService.getEventPerformanceMetrics(eventId);
      setEventMetrics(metrics);
    } catch (error) {
      console.error('Error loading event metrics:', error);
    }
    setLoading(false);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventId = await eventManagementService.createEvent(eventForm);
      setSelectedEvent(eventId);
      setEditMode(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
    setLoading(false);
  };

  const renderEventForm = () => (
    <form onSubmit={handleCreateEvent} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Event</h2>
      
      {/* Basic Info */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          value={eventForm.title}
          onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Event Description"
          value={eventForm.description}
          onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
          className="w-full p-2 border rounded"
          rows={4}
        />
        <input
          type="date"
          value={eventForm.date}
          onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          placeholder="Poster URL"
          value={eventForm.poster_url}
          onChange={(e) => setEventForm({...eventForm, poster_url: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Event Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Event Categories</h3>
        <select
          value={eventForm.event_type}
          onChange={(e) => setEventForm({...eventForm, event_type: e.target.value})}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Event Type</option>
          {eventManagementService.EVENT_CATEGORIES.EVENT_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <div>
          <label className="block mb-2">Music Genres</label>
          <div className="flex flex-wrap gap-2">
            {eventManagementService.EVENT_CATEGORIES.MUSIC_GENRES.map(genre => (
              <label key={genre} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={eventForm.music_genre.includes(genre)}
                  onChange={(e) => {
                    const genres = e.target.checked
                      ? [...eventForm.music_genre, genre]
                      : eventForm.music_genre.filter(g => g !== genre);
                    setEventForm({...eventForm, music_genre: genres});
                  }}
                  className="mr-2"
                />
                {genre}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Target Demographics</label>
          <div className="flex flex-wrap gap-2">
            {eventManagementService.EVENT_CATEGORIES.CROWD_DEMOGRAPHICS.map(demo => (
              <label key={demo} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={eventForm.target_demographics.includes(demo)}
                  onChange={(e) => {
                    const demos = e.target.checked
                      ? [...eventForm.target_demographics, demo]
                      : eventForm.target_demographics.filter(d => d !== demo);
                    setEventForm({...eventForm, target_demographics: demos});
                  }}
                  className="mr-2"
                />
                {demo}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Tiers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ticket Tiers</h3>
        {eventForm.ticket_tiers.map((tier, index) => (
          <div key={index} className="flex gap-4">
            <select
              value={tier.type}
              onChange={(e) => {
                const newTiers = [...eventForm.ticket_tiers];
                newTiers[index] = {...tier, type: e.target.value};
                setEventForm({...eventForm, ticket_tiers: newTiers});
              }}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select Tier Type</option>
              {eventManagementService.EVENT_CATEGORIES.PRICING_TIERS.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              value={tier.price}
              onChange={(e) => {
                const newTiers = [...eventForm.ticket_tiers];
                newTiers[index] = {...tier, price: e.target.value};
                setEventForm({...eventForm, ticket_tiers: newTiers});
              }}
              className="w-32 p-2 border rounded"
            />
            <select
              value={tier.time_slot}
              onChange={(e) => {
                const newTiers = [...eventForm.ticket_tiers];
                newTiers[index] = {...tier, time_slot: e.target.value};
                setEventForm({...eventForm, ticket_tiers: newTiers});
              }}
              className="flex-1 p-2 border rounded"
            >
              <option value="">Select Time Slot</option>
              {eventManagementService.EVENT_CATEGORIES.TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const newTiers = eventForm.ticket_tiers.filter((_, i) => i !== index);
                setEventForm({...eventForm, ticket_tiers: newTiers});
              }}
              className="p-2 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setEventForm({
              ...eventForm,
              ticket_tiers: [
                ...eventForm.ticket_tiers,
                { type: '', price: '', time_slot: '' }
              ]
            });
          }}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Ticket Tier
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );

  const renderEventMetrics = () => {
    if (!eventMetrics) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Attendance</h3>
            <p className="text-3xl font-bold">{eventMetrics.totalAttendance}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Revenue</h3>
            <p className="text-3xl font-bold">₹{eventMetrics.totalRevenue}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Gender Ratio</h3>
            <p className="text-3xl font-bold">
              {eventMetrics.genderRatio.male}:{eventMetrics.genderRatio.female}
            </p>
          </div>
        </div>

        {/* Tier Performance Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tier Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventMetrics.tierPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tier" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="attendance" fill="#8884d8" name="Attendance" />
              <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Entry Timeline */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Entry Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={eventMetrics.peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Entries" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PR Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Performing PRs</h3>
          <div className="space-y-2">
            {eventMetrics.topPerformingPRs.map((pr, index) => (
              <div key={pr.code} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="font-medium">{pr.code}</span>
                <span className="text-blue-600 dark:text-blue-400">{pr.count} entries</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Impact */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Social Media Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Instagram Views</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {eventMetrics.socialMediaImpact.instagram_views}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Story Interactions</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {eventMetrics.socialMediaImpact.story_interactions}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Conversions</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {eventMetrics.socialMediaImpact.ticket_conversions}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Management</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editMode ? 'View Events' : 'Create Event'}
        </button>
      </div>

      {editMode ? renderEventForm() : renderEventMetrics()}
    </div>
  );
};

export default EventManagement; 