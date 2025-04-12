import React, { useState } from 'react';

const GroupEntryScanner = () => {
  // Example group booking data
  const exampleGroup = {
    id: "GRP-2458",
    host: "Ravi Sharma",
    totalMembers: 4,
    bookingTime: "2023-08-15T15:30:00",
    phone: "+91 98765 43210",
    entryTime: {
      before9PM: { price: 0, label: "Free Entry (Before 9PM)" },
      before1045PM: { price: 500, label: "Regular Entry (9:30PM-10:45PM)" },
      after1045PM: { price: 800, label: "Late Entry (After 10:45PM)" }
    },
    members: [
      { id: 1, name: "Ravi Sharma G1 (Host)", checked: false },
      { id: 2, name: "Ravi Sharma G2", checked: false },
      { id: 3, name: "Ravi Sharma G3", checked: false },
      { id: 4, name: "Ravi Sharma G4", checked: false }
    ]
  };

  const [group, setGroup] = useState(exampleGroup);
  const [scanTime, setScanTime] = useState("21:35"); // Default time (9:35 PM - Regular tier)
  const [scannedMembers, setScannedMembers] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [secondScan, setSecondScan] = useState(false);
  const [previousScans, setPreviousScans] = useState([]);

  // Determine which pricing tier applies based on scan time
  const getCurrentTier = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeValue = hours * 60 + minutes;
    
    if (timeValue < 21 * 60) { // Before 9PM
      return "before9PM";
    } else if (timeValue < 22 * 60 + 45) { // Before 10:45PM
      return "before1045PM";
    } else { // After 10:45PM
      return "after1045PM";
    }
  };

  const handleToggleMember = (memberId) => {
    const updatedMembers = group.members.map(member => 
      member.id === memberId ? { ...member, checked: !member.checked } : member
    );
    setGroup({ ...group, members: updatedMembers });
    
    // Update scanned members list
    const member = group.members.find(m => m.id === memberId);
    if (member) {
      if (!member.checked) {
        // Adding member
        const memberTier = getCurrentTier(scanTime);
        const tierPrice = group.entryTime[memberTier].price;
        
        // Calculate price difference if this is a later scan with a higher tier
        let priceDifference = 0;
        if (secondScan) {
          // Get original tier price
          const originalTier = getCurrentTier(previousScans[0].scanTime);
          const originalPrice = group.entryTime[originalTier].price;
          
          // Only charge difference if current tier price is higher
          if (tierPrice > originalPrice) {
            priceDifference = tierPrice - originalPrice;
          }
        }
        
        setScannedMembers([...scannedMembers, { 
          ...member, 
          scanTime,
          tier: memberTier,
          entryFee: tierPrice,
          priceDifference
        }]);
      } else {
        // Removing member
        setScannedMembers(scannedMembers.filter(m => m.id !== memberId));
      }
    }
  };

  const handleTimeChange = (e) => {
    setScanTime(e.target.value);
  };

  const handleCompleteEntry = () => {
    setShowSummary(true);
  };

  const handleScanNext = () => {
    // Store previous scan data
    setPreviousScans([...previousScans, {
      scanTime,
      scannedMembers: [...scannedMembers],
      tier: getCurrentTier(scanTime)
    }]);
    
    // Update state for next scan
    setSecondScan(true);
    setShowSummary(false);
    
    // Update time for demo purposes to show tier difference
    setScanTime("23:15"); // 11:15 PM - Late tier
  };

  const handleViewHistory = () => {
    setShowSummary(true);
  };

  const calculateTotalRevenue = () => {
    return scannedMembers.reduce((total, member) => total + member.entryFee, 0);
  };

  const calculateTierUpgrades = () => {
    return scannedMembers.reduce((total, member) => total + (member.priceDifference || 0), 0);
  };

  const getTierLabel = (tierId) => {
    return group.entryTime[tierId].label;
  };

  const getTierPrice = (tierId) => {
    return group.entryTime[tierId].price;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      {!showSummary ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Group Entry Scanner</h2>
            <div className="flex items-center">
              {secondScan && (
                <button
                  onClick={handleViewHistory}
                  className="mr-3 px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm"
                >
                  View Entry History
                </button>
              )}
              <div className="px-4 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                Group ID: {group.id}
              </div>
            </div>
          </div>

          {secondScan && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Late Arrival Detection
                  </p>
                  <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">
                    Some group members are arriving later. The entry tier is now {getTierLabel(getCurrentTier(scanTime))}.
                    {getCurrentTier(scanTime) !== getCurrentTier(previousScans[0].scanTime) && (
                      <span className="block mt-1 font-medium">
                        Price difference of ₹{getTierPrice(getCurrentTier(scanTime)) - getTierPrice(getCurrentTier(previousScans[0].scanTime))} will apply to remaining members.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Group Details</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Host:</span> {group.host}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Group Size:</span> {group.totalMembers} people
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Contact:</span> {group.phone}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Booking Time:</span> {new Date(group.bookingTime).toLocaleString()}
                </p>
                {secondScan && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      First scan: {previousScans[0].scanTime} ({getTierLabel(previousScans[0].tier)})
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {previousScans[0].scannedMembers.length} members checked in
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Current Scan Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Time
                  </label>
                  <input 
                    type="time" 
                    value={scanTime}
                    onChange={handleTimeChange}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white w-full"
                  />
                </div>

                <div className="p-3 rounded-md" style={{
                  backgroundColor: 
                    getCurrentTier(scanTime) === "before9PM" ? 'rgba(0, 200, 83, 0.1)' : 
                    getCurrentTier(scanTime) === "before1045PM" ? 'rgba(3, 105, 161, 0.1)' : 
                    'rgba(124, 58, 237, 0.1)'
                }}>
                  <p className="text-sm font-medium" style={{
                    color: 
                      getCurrentTier(scanTime) === "before9PM" ? 'rgb(0, 200, 83)' : 
                      getCurrentTier(scanTime) === "before1045PM" ? 'rgb(3, 105, 161)' : 
                      'rgb(124, 58, 237)'
                  }}>
                    Current Tier: {getTierLabel(getCurrentTier(scanTime))}
                  </p>
                  <p className="text-xs mt-1" style={{
                    color: 
                      getCurrentTier(scanTime) === "before9PM" ? 'rgb(0, 180, 83)' : 
                      getCurrentTier(scanTime) === "before1045PM" ? 'rgb(3, 95, 161)' : 
                      'rgb(124, 58, 217)'
                  }}>
                    Entry Fee: ₹{getTierPrice(getCurrentTier(scanTime))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Group Members</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the members who are present for entry:
          </p>

          <div className="space-y-3 mb-6">
            {group.members
              .filter(member => secondScan ? 
                !previousScans[0].scannedMembers.some(m => m.id === member.id) : 
                true
              )
              .map(member => (
                <div 
                  key={member.id} 
                  className={`p-3 border rounded-md flex justify-between items-center transition-colors ${
                    member.checked 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`member-${member.id}`}
                      checked={member.checked}
                      onChange={() => handleToggleMember(member.id)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`member-${member.id}`}
                      className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {member.name}
                      {member.name.includes("Host") && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                          Host
                        </span>
                      )}
                    </label>
                  </div>
                  {member.checked && (
                    <div className="flex items-center">
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ₹{getTierPrice(getCurrentTier(scanTime))}
                      </span>
                      {secondScan && getTierPrice(getCurrentTier(scanTime)) > getTierPrice(getCurrentTier(previousScans[0].scanTime)) && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">
                          +₹{getTierPrice(getCurrentTier(scanTime)) - getTierPrice(getCurrentTier(previousScans[0].scanTime))}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
            {secondScan && previousScans[0].scannedMembers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Previously Checked In:</p>
                {previousScans[0].scannedMembers.map(member => (
                  <div 
                    key={member.id} 
                    className="p-3 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-md flex justify-between items-center mb-3"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {member.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full mr-2">
                        {member.scanTime}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ₹{member.entryFee}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Total Selected:</span> {scannedMembers.length} of {
                secondScan ? 
                  group.totalMembers - previousScans[0].scannedMembers.length : 
                  group.totalMembers
              }
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Total: ₹{calculateTotalRevenue() + (previousScans[0]?.scannedMembers?.reduce((sum, m) => sum + m.entryFee, 0) || 0)}
              {secondScan && calculateTierUpgrades() > 0 && (
                <span className="ml-2 text-sm bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">
                  Incl. ₹{calculateTierUpgrades()} upgrade fees
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleCompleteEntry}
              disabled={scannedMembers.length === 0}
              className={`px-4 py-2 rounded-md text-white ${
                scannedMembers.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Complete Entry
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Entry Confirmation</h2>
            <div className="px-4 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
              Group ID: {group.id}
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 dark:text-green-300 font-medium">Entry Processed Successfully</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {secondScan ? 
                `${scannedMembers.length + previousScans[0].scannedMembers.length} of ${group.totalMembers} members have entered the venue.` :
                `${scannedMembers.length} of ${group.totalMembers} members have entered the venue. The QR code remains valid for the remaining members.`
              }
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Entry Details</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {previousScans.length > 0 && (
                  <div>
                    <div className="flex items-center mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">First Scan Group ({previousScans[0].scanTime})</p>
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                        {getTierLabel(previousScans[0].tier)}
                      </span>
                    </div>
                    <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-600">
                      {previousScans[0].scannedMembers.map(member => (
                        <li key={member.id} className="py-2 flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{member.name}</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            ₹{member.entryFee}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {(scannedMembers.length > 0 || !secondScan) && (
                  <div>
                    <div className="flex items-center mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {secondScan ? "Second Scan Group" : "Members Entered"} ({scanTime})
                      </p>
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                        {getTierLabel(getCurrentTier(scanTime))}
                      </span>
                    </div>
                    <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-600">
                      {scannedMembers.map(member => (
                        <li key={member.id} className="py-2 flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{member.name}</span>
                          <div>
                            {member.priceDifference > 0 && (
                              <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full mr-2">
                                +₹{member.priceDifference}
                              </span>
                            )}
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              ₹{member.entryFee}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Members Still Expected</p>
                  <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-600">
                    {group.members
                      .filter(member => {
                        // Filter out members who have been checked in current scan or previous scans
                        const checkedInCurrentScan = scannedMembers.some(m => m.id === member.id);
                        const checkedInPreviousScan = previousScans.some(scan => 
                          scan.scannedMembers.some(m => m.id === member.id)
                        );
                        return !checkedInCurrentScan && !checkedInPreviousScan;
                      })
                      .map(member => (
                        <li key={member.id} className="py-2 flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{member.name}</span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Members Entered:</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {scannedMembers.length + (previousScans[0]?.scannedMembers?.length || 0)} of {group.totalMembers}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Collected:</p>
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">
                    ₹{calculateTotalRevenue() + (previousScans[0]?.scannedMembers?.reduce((sum, m) => sum + m.entryFee, 0) || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {!secondScan && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Important Note</p>
                  <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">
                    If the remaining members arrive later and the entry tier has changed, they will need to pay the difference.
                    The QR code will remain valid until all members have entered or until the event ends.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setShowSummary(false)}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Back to Scanner
            </button>
            {scannedMembers.length + (previousScans[0]?.scannedMembers?.length || 0) < group.totalMembers ? (
              <button 
                onClick={handleScanNext} 
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={secondScan}
              >
                Scan Remaining Members
              </button>
            ) : (
              <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                Scan Next Group
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupEntryScanner; 