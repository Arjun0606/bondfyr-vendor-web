import React, { useState, useEffect } from 'react';
import { eventConfigService } from '../services/eventConfigService';
import { groupBookingService } from '../services/groupBookingService';

const GroupEntryDemo = () => {
  // Demo event setup
  const EVENT_ID = 'demo_event';
  useEffect(() => {
    // Set up demo event configuration
    eventConfigService.setEventConfig(EVENT_ID, {
      name: 'Saturday Night Party',
      date: '2024-01-20',
      pricingTiers: [
        { startTime: '21:30', price: 500, name: 'Early Night' },
        { startTime: '22:45', price: 800, name: 'Peak Hours' }
      ],
      coverChargeType: 'fixed',
      freeEntryBeforeTime: '21:00',
      gracePeriodMinutes: 15,
      groupBookingEnabled: true,
      maxGroupSize: 6
    });
  }, []);

  // State
  const [hostName, setHostName] = useState('');
  const [groupSize, setGroupSize] = useState(1);
  const [bookingTime, setBookingTime] = useState('');
  const [currentBooking, setCurrentBooking] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [scannedQR, setScannedQR] = useState(false);
  const [entryConfirmed, setEntryConfirmed] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  // Create group booking
  const handleCreateBooking = (e) => {
    e.preventDefault();
    try {
      const booking = groupBookingService.createGroupBooking(EVENT_ID, {
        hostName,
        groupSize,
        bookingTime
      });
      setCurrentBooking(booking);
    } catch (error) {
      alert(error.message);
    }
  };

  // Process check-in for selected members
  const handleCheckIn = (memberIds) => {
    if (!currentBooking || !currentTime) return;

    try {
      const results = groupBookingService.processCheckIn(
        currentBooking.id,
        memberIds,
        currentTime
      );

      // Update current booking
      setCurrentBooking(groupBookingService.getBooking(currentBooking.id));

      // Check if any members need to pay surcharge
      const surchargeRequired = results.find(r => r.requiresPayment);
      if (surchargeRequired) {
        const paymentInfo = groupBookingService.generatePaymentUrl(
          currentBooking.id,
          surchargeRequired.memberId
        );
        setPaymentUrl(paymentInfo.paymentUrl);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle member selection
  const toggleMemberSelection = (memberId) => {
    if (!currentBooking) return;

    const member = currentBooking.groupMembers.find(m => m.id === memberId);
    if (!member) return;

    if (member.checkedIn) {
      // Already checked in, can't uncheck
      return;
    }

    handleCheckIn([memberId]);
  };

  // Process payment for surcharge
  const handleProcessPayment = (bookingId, memberId) => {
    const paymentInfo = groupBookingService.generatePaymentUrl(bookingId, memberId);
    // In a real app, redirect to payment gateway
    window.open(paymentInfo.paymentUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!currentBooking ? (
        // Booking creation form
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Group Booking</h2>
          
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Host Name
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Enter host name"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Size (including host)
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  -
                </button>
                <span className="text-lg font-medium">{groupSize}</span>
                <button
                  type="button"
                  onClick={() => setGroupSize(Math.min(6, groupSize + 1))}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  +
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Booking Time
              </label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                required
              >
                <option value="">Select time</option>
                <option value="20:30">8:30 PM (Free Entry)</option>
                <option value="21:15">9:15 PM (₹500)</option>
                <option value="22:00">10:00 PM (₹500)</option>
                <option value="23:00">11:00 PM (₹800)</option>
              </select>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">Pricing Information</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>• Free entry before 9:00 PM</li>
                <li>• ₹500 from 9:30 PM to 10:45 PM</li>
                <li>• ₹800 after 10:45 PM</li>
                <li>• Late arrivals pay the difference</li>
              </ul>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      ) : !scannedQR ? (
        // QR code display
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Booking QR Code</h2>
          
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
              <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-mono">QR: {currentBooking.qrCode}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded">
            <h3 className="font-medium text-green-900 dark:text-green-100">Booking Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Host: {currentBooking.hostName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Group Size: {currentBooking.groupSize}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Booked Time: {currentBooking.bookingTime}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Base Price: ₹{currentBooking.originalTier.price}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentBooking(null)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setScannedQR(true)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Simulate QR Scan
            </button>
          </div>
        </div>
      ) : (
        // Entry verification view
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {entryConfirmed ? (
            <div className="text-center py-10">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Entry Confirmed!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentBooking.groupMembers.filter(m => m.checkedIn).length} guests have been admitted
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Entry Verification</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Time
                </label>
                <select
                  value={currentTime}
                  onChange={(e) => setCurrentTime(e.target.value)}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700"
                  required
                >
                  <option value="">Select current time</option>
                  <option value="20:30">8:30 PM</option>
                  <option value="21:15">9:15 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="23:00">11:00 PM</option>
                </select>
              </div>
              
              {currentTime && (
                <>
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Current Entry Price: ₹{eventConfigService.calculatePriceTier(EVENT_ID, currentTime)?.price || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Booking Time: {currentBooking.bookingTime} (₹{currentBooking.originalTier.price})
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Group Members</h3>
                    <div className="space-y-2">
                      {currentBooking.groupMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`member-${member.id}`}
                              checked={member.checkedIn}
                              onChange={() => toggleMemberSelection(member.id)}
                              disabled={member.checkedIn}
                              className="h-4 w-4 text-blue-600 mr-3"
                            />
                            <label htmlFor={`member-${member.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {member.name}
                            </label>
                          </div>
                          {member.checkedIn && (
                            <div className="text-sm text-gray-500">
                              <div className="flex flex-col items-end">
                                <span>Entry: {member.checkInTime}</span>
                                {member.surcharge > 0 ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-amber-600">
                                      Additional: ₹{member.surcharge}
                                    </span>
                                    <button
                                      onClick={() => handleProcessPayment(currentBooking.id, member.id)}
                                      className="px-2 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700"
                                    >
                                      Pay Now
                                    </button>
                                  </div>
                                ) : (
                                  <span className="font-medium text-green-600">
                                    Paid: ₹{member.originalTier.price}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-medium mb-4">
                      <span>Total Guests Admitted:</span>
                      <span>
                        {currentBooking.groupMembers.filter(m => m.checkedIn).length} / {currentBooking.groupSize}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setScannedQR(false)}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setEntryConfirmed(true)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                      >
                        Confirm Entry
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupEntryDemo; 