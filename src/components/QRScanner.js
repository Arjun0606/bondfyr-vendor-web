import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [guestDetails, setGuestDetails] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCover, setManualCover] = useState('');

  const handleScan = (data) => {
    if (data) {
      // This would be replaced with actual Firebase lookup
      const mockGuestData = {
        id: "123",
        name: "John Doe",
        ticketType: "VIP",
        groupSize: 4,
        genderBreakdown: {
          male: 2,
          female: 2,
          other: 0
        },
        prCode: "PR123",
        isCouple: true,
        paymentStatus: "paid",
      };
      
      setGuestDetails(mockGuestData);
      setScanResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setScanResult(null);
  };

  const handleCheckIn = () => {
    // This would update Firebase with check-in data
    console.log('Checking in guest:', guestDetails);
    console.log('Scan result:', scanResult);
  };

  const handleManualCharge = () => {
    // This would integrate with Razorpay for manual charges
    console.log('Processing manual charge:', manualCover);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check-In Scanner</h1>
        <button
          onClick={() => setShowManualEntry(!showManualEntry)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Manual Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="aspect-square max-w-md mx-auto">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          </div>
          {scanResult && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-200">
                QR Code scanned successfully
              </p>
            </div>
          )}
        </div>

        {/* Guest Details */}
        {guestDetails && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Guest Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Name</label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {guestDetails.name}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Ticket Type</label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {guestDetails.ticketType}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Group Details</label>
                <div className="mt-1 grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-200">Male</p>
                    <p className="text-xl font-semibold text-blue-700 dark:text-blue-100">
                      {guestDetails.genderBreakdown.male}
                    </p>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-900 p-3 rounded-lg">
                    <p className="text-sm text-pink-600 dark:text-pink-200">Female</p>
                    <p className="text-xl font-semibold text-pink-700 dark:text-pink-100">
                      {guestDetails.genderBreakdown.female}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-200">Other</p>
                    <p className="text-xl font-semibold text-purple-700 dark:text-purple-100">
                      {guestDetails.genderBreakdown.other}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleCheckIn}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Check In
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Entry Form */}
        {showManualEntry && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Manual Cover Charge
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={manualCover}
                  onChange={(e) => setManualCover(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleManualCharge}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Process Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner; 