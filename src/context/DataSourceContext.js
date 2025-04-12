import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyAnalyticsData } from '../data/dummyData';
import { db, rtdb } from '../firebase/firebase';
import { ref, onValue, set } from 'firebase/database';
import { doc, updateDoc } from 'firebase/firestore';

// Create context
const DataSourceContext = createContext();

export const useDataSource = () => useContext(DataSourceContext);

export const DataSourceProvider = ({ children }) => {
  const [isDummyData, setIsDummyData] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(dummyAnalyticsData);
  const [venueId, setVenueId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load real data when requested
  useEffect(() => {
    if (!isDummyData && venueId) {
      loadRealData(venueId);
    }
  }, [isDummyData, venueId]);

  const loadRealData = async (venueId) => {
    setIsLoading(true);
    try {
      // Example of loading real data from Firebase
      const venueRef = ref(rtdb, `venue_analytics/${venueId}`);
      onValue(venueRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAnalyticsData(data);
        } else {
          console.log("No data available for this venue");
          // Optionally, keep some dummy data for new venues
          setAnalyticsData({
            ...dummyAnalyticsData,
            isPartiallyPopulated: true,
            recentActivity: [], // Clear recent activity
            dailyCheckins: [], // Reset daily checkins
            guestList: { // Keep structure but empty content
              vipGuests: [],
              waitingList: [],
              directBookings: []
            }
          });
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error loading real data:", error);
      setIsLoading(false);
    }
  };

  const toggleDataSource = (showDummy) => {
    setIsDummyData(showDummy);
  };

  const setVenue = (id) => {
    setVenueId(id);
    if (!isDummyData) {
      loadRealData(id);
    }
  };

  // New function to update pricing
  const updatePricing = async (newPricingTiers) => {
    if (isDummyData) {
      // Update local state for demo mode
      setAnalyticsData(prev => ({
        ...prev,
        tieredEntryData: {
          ...prev.tieredEntryData,
          tiers: newPricingTiers.map(tier => ({
            tier: tier.name,
            price: tier.price,
            scanned: prev.tieredEntryData.tiers.find(t => 
              t.tier === tier.name || t.id === tier.id
            )?.scanned || 0,
            percentage: prev.tieredEntryData.tiers.find(t => 
              t.tier === tier.name || t.id === tier.id
            )?.percentage || 0
          }))
        }
      }));
    } else if (venueId) {
      try {
        // Update pricing in Firebase
        const pricingRef = ref(rtdb, `venue_analytics/${venueId}/tieredEntryData/tiers`);
        await set(pricingRef, newPricingTiers);
        
        // Also update in Firestore for persistence
        const venueDocRef = doc(db, 'venues', venueId);
        await updateDoc(venueDocRef, {
          'pricing.tiers': newPricingTiers
        });
        
        // Add to recent activity
        const activityRef = ref(rtdb, `venue_analytics/${venueId}/recentActivity`);
        const newActivity = {
          id: `act-${Date.now()}`,
          type: 'price-update',
          icon: '💰',
          message: `Entry prices updated: ${newPricingTiers.map(t => `${t.name} (₹${t.price})`).join(', ')}`,
          time: new Date().toISOString()
        };
        
        onValue(activityRef, (snapshot) => {
          const currentActivity = snapshot.val() || [];
          set(activityRef, [newActivity, ...currentActivity.slice(0, 11)]);
        }, { onlyOnce: true });
      } catch (error) {
        console.error("Error updating pricing:", error);
      }
    }
  };

  // Value object to be provided to consumers
  const value = {
    isDummyData,
    analyticsData,
    isLoading,
    toggleDataSource,
    setVenue,
    updatePricing
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
};

export default DataSourceProvider; 