import { useState, useEffect } from 'react';
import { VenueAnalytics } from '../firebase/services/VenueAnalytics';

export const useVenueAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    currentOccupancy: 0,
    genderRatio: { male: 0, female: 0, other: 0 },
    couplesCount: 0,
    hourlyCheckins: {},
    photoContestStats: null,
    prPerformance: {},
    securityIncidents: [],
    notificationStats: null,
    staffPerformance: {},
  });

  useEffect(() => {
    // Subscribe to real-time venue stats
    const unsubscribe = VenueAnalytics.subscribeToRealTimeStats((stats) => {
      setAnalytics(prev => ({
        ...prev,
        ...stats,
      }));
    });

    // Load additional stats
    const loadAdditionalStats = async () => {
      const [photoStats, staffStats] = await Promise.all([
        VenueAnalytics.getPhotoContestStats(),
        VenueAnalytics.getStaffPerformance('all'), // Get all staff performance
      ]);

      setAnalytics(prev => ({
        ...prev,
        photoContestStats: photoStats,
        staffPerformance: staffStats,
      }));
    };

    loadAdditionalStats();

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  const calculateCapacityPercentage = () => {
    const maxCapacity = 500; // Configure this based on your venue
    return (analytics.currentOccupancy / maxCapacity) * 100;
  };

  const getGenderRatioPercentages = () => {
    const total = Object.values(analytics.genderRatio).reduce((a, b) => a + b, 0);
    if (total === 0) return analytics.genderRatio;

    return {
      male: (analytics.genderRatio.male / total) * 100,
      female: (analytics.genderRatio.female / total) * 100,
      other: (analytics.genderRatio.other / total) * 100,
    };
  };

  const getPeakHours = () => {
    return Object.entries(analytics.hourlyCheckins)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => hour);
  };

  return {
    ...analytics,
    capacityPercentage: calculateCapacityPercentage(),
    genderRatioPercentages: getGenderRatioPercentages(),
    peakHours: getPeakHours(),
  };
}; 