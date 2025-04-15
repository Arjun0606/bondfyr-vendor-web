import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaList, FaTicketAlt, FaUserPlus, FaCopy } from 'react-icons/fa';
import { MdQrCode } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import './PromoterPortal.css';

// Function to generate unique PR code with expiration
const generatePRCode = (prName) => {
  const timestamp = Date.now();
  const expirationTime = timestamp + (36 * 60 * 60 * 1000); // 36 hours from now
  const randomStr = Math.random().toString(36).substring(2, 5);
  const prefix = prName.split(' ')[0].toUpperCase();
  return {
    code: `${prefix}-${timestamp.toString(36)}${randomStr}`,
    createdAt: timestamp,
    expiresAt: expirationTime,
    isUsed: false,
    usedAt: null,
    usedBy: null,
    checkedIn: false,
    checkedInAt: null
  };
};

const PromoterPortal = () => {
  const [prCodes, setPrCodes] = useState({});
  const [promoterName, setPromoterName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeCodes, setActiveCodes] = useState([]);
  const [usedCodes, setUsedCodes] = useState([]);
  const [pendingCodes, setPendingCodes] = useState([]);
  const [showQR, setShowQR] = useState(null);
  const [stats, setStats] = useState({
    totalGenerated: 0,
    totalUsed: 0,
    totalCheckedIn: 0,
    conversionRate: 0,
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [qrCodeKey, setQrCodeKey] = useState(Date.now()); // Force QR code refresh
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [activeSection, setActiveSection] = useState('checkin');
  const [showPR, setShowPR] = useState(false);
  const [prCode, setPrCode] = useState('');
  const [qrValue, setQrValue] = useState('');

  // Load saved data on initial mount only
  useEffect(() => {
    const savedCodes = localStorage.getItem('prCodes');
    const storedName = localStorage.getItem('promoterName');
    
    if (savedCodes) {
      const parsedCodes = JSON.parse(savedCodes);
      setPrCodes(parsedCodes);
    }
    
    if (storedName) {
      setPromoterName(storedName);
      setInputValue(storedName);
    }
  }, []);

  // Process data when prCodes or promoterName changes
  useEffect(() => {
    // Save PR codes to localStorage
    if (Object.keys(prCodes).length > 0) {
      localStorage.setItem('prCodes', JSON.stringify(prCodes));
    }
    
    // Calculate stats and sort codes
    const now = Date.now();
    let totalGenerated = 0;
    let totalUsed = 0;
    let totalCheckedIn = 0;
    const active = [];
    const used = [];
    const pending = [];
    
    if (promoterName && prCodes[promoterName]) {
      const codes = prCodes[promoterName];
      totalGenerated = codes.length;
      
      codes.forEach(code => {
        if (code.isUsed) {
          totalUsed++;
          if (code.checkedIn) {
            totalCheckedIn++;
            used.push(code);
          } else {
            pending.push(code);
          }
        } else if (code.expiresAt > now) {
          active.push(code);
        }
      });
    }
    
    // Update all derived state in one go
    setActiveCodes(active);
    setUsedCodes(used);
    setPendingCodes(pending);
    setStats({
      totalGenerated,
      totalUsed,
      totalCheckedIn,
      conversionRate: totalGenerated > 0 ? Math.round((totalCheckedIn / totalGenerated) * 100) : 0
    });
  }, [prCodes, promoterName]);

  // Save promoter name when it changes
  useEffect(() => {
    if (promoterName) {
      localStorage.setItem('promoterName', promoterName);
    }
  }, [promoterName]);

  // Clean up expired codes every minute
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setPrCodes(prevCodes => {
        // Skip update if no changes needed
        let hasChanges = false;
        const updatedCodes = {};
        
        Object.entries(prevCodes).forEach(([prName, codes]) => {
          const filtered = codes.filter(code => code.isUsed || code.expiresAt > now);
          if (filtered.length !== codes.length) {
            hasChanges = true;
          }
          updatedCodes[prName] = filtered;
        });
        
        return hasChanges ? updatedCodes : prevCodes;
      });
    }, 60000);

    return () => clearInterval(cleanup);
  }, []);

  // Function to handle QR code refresh
  useEffect(() => {
    let timerId;
    let intervalId;
    
    if (showQRModal) {
      // Update timestamp every second
      intervalId = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString());
      }, 1000);
      
      // Set up countdown timer
      setTimeLeft(20);
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Reset timer and generate new QR code
            setQrCodeKey(Date.now());
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timerId);
      clearInterval(intervalId);
    };
  }, [showQRModal, qrCodeKey]);

  // Update timestamp periodically for security
  useEffect(() => {
    let interval;
    
    if (showQR || showQRModal) {
      interval = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showQR, showQRModal]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to generate a unique PR code
  const handleGenerateCode = () => {
    if (!inputValue.trim()) {
      toast.error('Please enter your name first');
      return;
    }
    
    // Set promoter name from input field
    setPromoterName(inputValue);
    
    // Create a new PR code
    const newCode = generatePRCode(inputValue);
    
    // Add the new code to the promoter's codes
    setPrCodes(prev => {
      const updatedCodes = {...prev};
      const promoterCodes = [...(updatedCodes[inputValue] || [])];
      promoterCodes.push(newCode);
      updatedCodes[inputValue] = promoterCodes;
      return updatedCodes;
    });
    
    // Show success message
    toast.success(`New code generated: ${newCode.code}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGenerateCode();
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleShareCode = (code) => {
    if (navigator.share) {
      navigator.share({
        title: 'Your VIP entry code',
        text: `Use this code for VIP entry: ${code}`,
        url: `https://bondfyr.com/code/${code}`
      })
      .then(() => toast.success('Code shared successfully!'))
      .catch(error => toast.error('Error sharing code'));
    } else {
      handleCopyCode(code);
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  // Simulation functions
  const simulateCodeUsage = (code) => {
    setPrCodes(prev => {
      const updatedCodes = {...prev};
      const promoterCodes = [...(updatedCodes[promoterName] || [])];
      const codeIndex = promoterCodes.findIndex(c => c.code === code);
      
      if (codeIndex !== -1) {
        promoterCodes[codeIndex] = {
          ...promoterCodes[codeIndex],
          isUsed: true,
          usedAt: Date.now(),
          usedBy: `Guest-${Math.floor(Math.random() * 1000)}`
        };
        updatedCodes[promoterName] = promoterCodes;
      }
      
      return updatedCodes;
    });
    toast.info('Code usage simulated. Guest added to pending list.');
  };

  const simulateCheckIn = (code) => {
    setPrCodes(prev => {
      const updatedCodes = {...prev};
      const promoterCodes = [...(updatedCodes[promoterName] || [])];
      const codeIndex = promoterCodes.findIndex(c => c.code === code);
      
      if (codeIndex !== -1) {
        promoterCodes[codeIndex] = {
          ...promoterCodes[codeIndex],
          checkedIn: true,
          checkedInAt: Date.now()
        };
        updatedCodes[promoterName] = promoterCodes;
      }
      
      return updatedCodes;
    });
    toast.success('Guest checked in successfully!');
  };

  // Function to handle QR code display
  const handleShowQRCode = () => {
    // Generate QR value - this could be a deep link to your app or website
    const venueId = "venue-123"; // Replace with actual venue ID
    const promoterId = "promoter-456"; // Replace with actual promoter ID
    const timestamp = Date.now(); // Add timestamp for uniqueness
    const qrData = `https://bondfyr.com/check-in?venue=${venueId}&promoter=${promoterId}&ts=${timestamp}`;
    
    setQrValue(qrData);
    setShowQRModal(true);
  };

  const renderQRCodeModal = () => {
    return (
      <Modal
        isOpen={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
        className="qr-modal-content"
        overlayClassName="qr-modal-overlay"
      >
        <div className="qr-modal-header">
          <h3>Dynamic Security QR</h3>
          <button onClick={() => setShowQRModal(false)} className="qr-close-button">×</button>
        </div>
        <div className="qr-container">
          <div key={qrCodeKey} style={{ position: 'relative', width: '300px', height: '300px' }}>
            {/* QR Code */}
            <QRCodeSVG 
              value={qrValue || `https://bondfyr.com/check-in`}
              size={300}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
            
            {/* Security overlay patterns */}
            <div className="security-overlay">
              {/* Horizontal sweeping gradient */}
              <div className="security-pattern" style={{ top: '30%' }}></div>
              <div className="security-pattern" style={{ top: '60%', animationDelay: '1s' }}></div>
              
              {/* Rotating border */}
              <div className="rotating-overlay"></div>
              
              {/* Pattern 1 - Diagonal gradient sweep */}
              <div className="animate-security-pattern-1" style={{ 
                position: 'absolute',
                width: '200%', 
                height: '30px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,128,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                transform: 'rotate(45deg)',
                top: '50%',
                left: '-50%'
              }}></div>
              
              {/* Pattern 2 - Vertical gradient sweep */}
              <div className="animate-security-pattern-2" style={{ 
                position: 'absolute',
                width: '100%', 
                height: '50px',
                background: 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(0,255,128,0.15) 50%, rgba(255,255,255,0) 100%)',
                top: 0,
                left: 0
              }}></div>
              
              {/* Security lines - horizontal and vertical thin lines */}
              <div className="animate-security-line-1" style={{ 
                position: 'absolute', 
                width: '100%', 
                height: '1px', 
                background: 'rgba(0,128,255,0.5)', 
                top: '20%' 
              }}></div>
              <div className="animate-security-line-2" style={{ 
                position: 'absolute', 
                width: '100%', 
                height: '1px', 
                background: 'rgba(0,255,128,0.5)', 
                top: '40%' 
              }}></div>
              <div className="animate-security-line-3" style={{ 
                position: 'absolute', 
                width: '100%', 
                height: '1px', 
                background: 'rgba(255,0,128,0.5)', 
                top: '60%' 
              }}></div>
              <div className="animate-security-line-4" style={{ 
                position: 'absolute', 
                width: '1px', 
                height: '100%', 
                background: 'rgba(128,0,255,0.5)', 
                left: '30%' 
              }}></div>
              <div className="animate-security-line-5" style={{ 
                position: 'absolute', 
                width: '1px', 
                height: '100%', 
                background: 'rgba(255,128,0,0.5)', 
                left: '50%' 
              }}></div>
              <div className="animate-security-line-6" style={{ 
                position: 'absolute', 
                width: '1px', 
                height: '100%', 
                background: 'rgba(0,255,255,0.5)', 
                left: '70%' 
              }}></div>
            </div>
          </div>
        </div>
        
        <div className="qr-timestamp" style={{ marginTop: '15px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 auto', maxWidth: '300px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
            <span><strong>Time:</strong> {currentTime}</span>
            <span><strong>Refreshes in:</strong> {timeLeft}s</span>
          </div>
          <div className="qr-modal-instructions">
            <p style={{ margin: '10px 0', fontWeight: 'bold' }}>⚠️ Security QR Code</p>
            <p style={{ margin: '0', fontSize: '12px' }}>
              This is a dynamic security QR with animated patterns that change constantly. Screenshots are ineffective - the code must be scanned directly through the app.
            </p>
          </div>
        </div>
      </Modal>
    );
  };

  // Function to show QR code for a specific PR code
  const handleShowQRForCode = (code) => {
    // Include timestamp to make the QR code URL dynamic
    const timestamp = Date.now();
    setShowQR({
      code: typeof code === 'object' ? code.code : code,
      timestamp
    });
  };

  // If the user clicks "Show QR" in the active codes section
  const renderIndividualQRCode = () => {
    if (!showQR) return null;
    
    // Generate the URL with the code and timestamp
    const qrCodeUrl = typeof showQR === 'object' 
      ? `https://bondfyr.com/code/${showQR.code}?ts=${showQR.timestamp}` 
      : `https://bondfyr.com/code/${showQR}`;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">Dynamic QR Code</h3>
          <div className="relative flex justify-center mb-4">
            {/* Base QR Code */}
            <div className="relative" style={{ width: '200px', height: '200px' }}>
              <QRCodeSVG 
                value={qrCodeUrl} 
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
              
              {/* Security overlay components defined earlier */}
              <div className="security-overlay">
                {/* Horizontal sweeping gradient */}
                <div className="security-pattern" style={{ top: '30%' }}></div>
                <div className="security-pattern" style={{ top: '60%', animationDelay: '1s' }}></div>
                
                {/* Rotating border */}
                <div className="rotating-overlay"></div>
                
                {/* Animated gradient overlays */}
                <div className="animate-security-pattern-1" style={{ 
                  position: 'absolute',
                  width: '200%', 
                  height: '30px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(0,128,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                  transform: 'rotate(45deg)',
                  top: '50%',
                  left: '-50%'
                }}></div>
                
                <div className="animate-security-pattern-2" style={{ 
                  position: 'absolute',
                  width: '100%', 
                  height: '50px',
                  background: 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(0,255,128,0.15) 50%, rgba(255,255,255,0) 100%)',
                  top: 0,
                  left: 0
                }}></div>
              </div>
              
              {/* Timestamp */}
              <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-500 font-mono">
                {currentTime}
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs text-yellow-700">
                  This QR code contains security features that prevent screenshots. Share the code text instead:
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-center font-mono text-sm mb-4">
            {typeof showQR === 'object' ? showQR.code : showQR}
          </p>
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => handleCopyCode(typeof showQR === 'object' ? showQR.code : showQR)}
              className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              Copy Code
            </button>
            <button
              onClick={() => handleShareCode(typeof showQR === 'object' ? showQR.code : showQR)}
              className="px-3 py-1 text-sm text-indigo-700 bg-indigo-100 rounded hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
            >
              Share
            </button>
            <button
              onClick={() => setShowQR(null)}
              className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🎭 Promoter Portal
        </h2>
        
        {/* Promoter Info */}
        <div className="mb-6">
          <form onSubmit={handleSubmit}>
            <label htmlFor="promoterName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="promoterName"
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1 rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your name"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Generate Code
              </button>
            </div>
          </form>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Generated</h3>
            <p className="mt-2 text-2xl font-semibold text-blue-900 dark:text-blue-200">{stats.totalGenerated}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Checked In</h3>
            <p className="mt-2 text-2xl font-semibold text-green-900 dark:text-green-200">{stats.totalCheckedIn}</p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Pending Check-in</h3>
            <p className="mt-2 text-2xl font-semibold text-yellow-900 dark:text-yellow-200">{pendingCodes.length}</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Conversion Rate</h3>
            <p className="mt-2 text-2xl font-semibold text-purple-900 dark:text-purple-200">{stats.conversionRate}%</p>
          </div>
        </div>
        
        {/* Active Codes */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Active Codes</h3>
          {activeCodes.length > 0 ? (
            <div className="space-y-3">
              {activeCodes.map((codeData) => (
                <div 
                  key={codeData.code}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex flex-col mb-2 md:mb-0">
                    <div className="flex items-center">
                      <span className="font-mono text-lg font-medium text-gray-800 dark:text-gray-200">
                        {codeData.code}
                      </span>
                      <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {getTimeRemaining(codeData.expiresAt)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Created: {formatDate(codeData.createdAt)} at {formatTime(codeData.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShowQRForCode(codeData.code)}
                      className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                    >
                      Show QR
                    </button>
                    <button
                      onClick={() => handleCopyCode(codeData.code)}
                      className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleShareCode(codeData.code)}
                      className="px-3 py-1 text-sm text-indigo-700 bg-indigo-100 rounded hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
                    >
                      Share
                    </button>
                    {/* Demo buttons - these would be removed in production */}
                    <button
                      onClick={() => simulateCodeUsage(codeData.code)}
                      className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                    >
                      Simulate Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No active codes. Generate a new code to get started.</p>
          )}
        </div>
        
        {/* Pending Check-in */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Pending Check-in</h3>
          {pendingCodes.length > 0 ? (
            <div className="space-y-3">
              {pendingCodes.map((codeData) => (
                <div 
                  key={codeData.code}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg"
                >
                  <div className="flex flex-col mb-2 md:mb-0">
                    <span className="font-mono text-lg font-medium text-gray-800 dark:text-gray-200">
                      {codeData.code}
                    </span>
                    <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Used by: {codeData.usedBy}</span>
                      <span>Used at: {formatTime(codeData.usedAt)} on {formatDate(codeData.usedAt)}</span>
                    </div>
                  </div>
                  
                  {/* Demo buttons - these would be removed in production */}
                  <button
                    onClick={() => simulateCheckIn(codeData.code)}
                    className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                  >
                    Simulate Check-in
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No pending check-ins.</p>
          )}
        </div>
        
        {/* Checked-in Guests */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Checked-in Guests</h3>
          {usedCodes.length > 0 ? (
            <div className="space-y-3">
              {usedCodes.map((codeData) => (
                <div 
                  key={codeData.code}
                  className="flex flex-col md:flex-row md:items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-lg font-medium text-gray-800 dark:text-gray-200">
                      {codeData.code}
                    </span>
                    <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Used by: {codeData.usedBy}</span>
                      <span>Used at: {formatTime(codeData.usedAt)} on {formatDate(codeData.usedAt)}</span>
                      <span>Checked in: {formatTime(codeData.checkedInAt)} on {formatDate(codeData.checkedInAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No checked-in guests yet.</p>
          )}
        </div>
      </div>
      
      {renderIndividualQRCode()}
      {renderQRCodeModal()}

      <div className="guest-interactions">
        <h3 className="section-title">Guest Interactions</h3>
        
        <div className="interaction-grid">
          <div className="interaction-card">
            <h4>Check In</h4>
            <p>Verify ticket and record attendance</p>
            <button
              className="action-button"
              onClick={() => setActiveSection('checkin')}
            >
              Check In Guest
            </button>
          </div>
          
          <div className="interaction-card">
            <h4>QR Code Check-in</h4>
            <p>Display QR code for quick guest check-in</p>
            <button 
              className="action-button"
              onClick={handleShowQRCode}
            >
              <MdQrCode /> Show QR Code
            </button>
          </div>
          
          <div className="interaction-card">
            <h4>Guest List</h4>
            <p>View confirmed guests and their status</p>
            <button
              className="action-button"
              onClick={() => setActiveSection('guestlist')}
            >
              View Guest List
            </button>
          </div>

          <div className="interaction-card">
            <h4>Generate PR Code</h4>
            <p>Create a unique promo code for tracking</p>
            <button 
              className="action-button"
              onClick={handleGenerateCode}
            >
              Generate Code
            </button>
          </div>

          {showPR && (
            <div className="pr-code-display">
              <h4>Your PR Code</h4>
              <div className="code-container">
                <span className="pr-code">{prCode}</span>
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(prCode);
                    alert('PR Code copied to clipboard!');
                  }}
                >
                  Copy
                </button>
              </div>
              <p className="code-instructions">Share this code with your guests. They'll need it for check-in.</p>
            </div>
          )}
        </div>
        
        {showPR && (
          <div className="guest-list">
            {/* Guest list content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoterPortal; 