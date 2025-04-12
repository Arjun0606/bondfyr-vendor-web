import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const defaultVenueDetails = {
  name: 'High Spirits',
  location: 'Mundhwa, Pune',
  googleMapsLink: 'https://maps.google.com/?q=High+Spirits+Cafe+Pune',
  gallery: [
    '/images/venue/crowd.jpg',
    '/images/venue/interior.jpg',
    '/images/venue/night.jpg'
  ],
  description: 'High Spirits Cafe in Pune, India, is a beloved nightlife hotspot that has been a fixture in Koregaon Park for over a decade. With its inviting open-air setting, adorned with fairy lights, it\'s a gathering place for both locals and visitors. The venue\'s eclectic music scene, ranging from live bands to DJ sets, ensures there\'s always something for every music lover.'
};

export const EventEdit = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    venue: defaultVenueDetails.name,
    location: defaultVenueDetails.location,
    googleMapsLink: defaultVenueDetails.googleMapsLink,
    gallery: [...defaultVenueDetails.gallery],
    description: defaultVenueDetails.description,
    coverImage: '',
    ticketTiers: [
      { name: 'Early Bird', price: '', available: '' }
    ],
    genderRatioRule: { male: 1, female: 1 },
    eventPoster: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    dresscode: '',
    ageLimit: '21+',
    capacity: '',
    specialNotes: ''
  });

  useEffect(() => {
    if (event) {
      setFormData(prev => ({
        ...prev,
        ...event,
        // Preserve venue details if not explicitly provided in the event
        venue: event.venue || prev.venue,
        location: event.location || prev.location,
        googleMapsLink: event.googleMapsLink || prev.googleMapsLink,
        gallery: event.gallery || prev.gallery,
        description: event.description || prev.description
      }));
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTicketTierChange = (index, field, value) => {
    const updatedTiers = [...formData.ticketTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      ticketTiers: updatedTiers
    }));
  };

  const handleAddTicketTier = () => {
    setFormData(prev => ({
      ...prev,
      ticketTiers: [...prev.ticketTiers, { name: '', price: '', available: '' }]
    }));
  };

  const handleRemoveTicketTier = (index) => {
    setFormData(prev => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.eventDate || !formData.eventTime || !formData.eventPoster) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Venue Details Section - Read Only */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Venue Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Venue Name
              </label>
              <input
                type="text"
                value={formData.venue}
                readOnly
                className="mt-1 block w-full bg-gray-100 dark:bg-gray-600 rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                readOnly
                className="mt-1 block w-full bg-gray-100 dark:bg-gray-600 rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Event Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Event Poster
            </label>
            <input
              type="file"
              name="eventPoster"
              accept="image/*"
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Time
              </label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Event Description
            </label>
            <textarea
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleInputChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dress Code
              </label>
              <input
                type="text"
                name="dresscode"
                value={formData.dresscode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Age Limit
              </label>
              <select
                name="ageLimit"
                value={formData.ageLimit}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="18+">18+</option>
                <option value="21+">21+</option>
                <option value="25+">25+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Ticket Tiers Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ticket Tiers</h3>
            <button
              type="button"
              onClick={handleAddTicketTier}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Ticket Tier
            </button>
          </div>
          
          {formData.ticketTiers.map((tier, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tier Name
                </label>
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => handleTicketTierChange(index, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price
                </label>
                <input
                  type="number"
                  value={tier.price}
                  onChange={(e) => handleTicketTierChange(index, 'price', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available
                  </label>
                  <input
                    type="number"
                    value={tier.available}
                    onChange={(e) => handleTicketTierChange(index, 'available', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTicketTier(index)}
                    className="mt-6 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Special Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Special Notes
          </label>
          <textarea
            name="specialNotes"
            value={formData.specialNotes}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Any special instructions or notes for the event..."
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {event ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}; 