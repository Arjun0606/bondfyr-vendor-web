import React, { useState, useEffect } from 'react';
import { useDataSource } from '../context/DataSourceContext';

const DynamicPricing = () => {
  const { analyticsData, updatePricing, isDummyData } = useDataSource();
  const [pricingTiers, setPricingTiers] = useState([
    { id: 'before9PM', name: 'Early (Before 9PM)', price: 0 },
    { id: 'before1045PM', name: 'Regular (9:30PM-10:45PM)', price: 500 },
    { id: 'after1045PM', name: 'Late (After 10:45PM)', price: 800 }
  ]);

  useEffect(() => {
    if (analyticsData?.tieredEntryData?.tiers) {
      setPricingTiers(analyticsData.tieredEntryData.tiers.map(tier => ({
        id: tier.id || tier.tier.toLowerCase().replace(/\s+/g, ''),
        name: tier.tier,
        price: tier.price
      })));
    }
  }, [analyticsData]);

  const handlePriceChange = (tierId, newPrice) => {
    const updatedTiers = pricingTiers.map(tier =>
      tier.id === tierId ? { ...tier, price: parseInt(newPrice) } : tier
    );
    setPricingTiers(updatedTiers);
    updatePricing(updatedTiers);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dynamic Pricing Management</h2>
        {isDummyData && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Demo Mode
          </span>
        )}
      </div>

      <div className="space-y-6">
        {pricingTiers.map(tier => (
          <div key={tier.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{tier.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current price: ₹{tier.price}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">₹</span>
                </div>
                <input
                  type="number"
                  value={tier.price}
                  onChange={(e) => handlePriceChange(tier.id, e.target.value)}
                  className="pl-7 block w-32 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="50"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePriceChange(tier.id, tier.price - 50)}
                  className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  -50
                </button>
                <button
                  onClick={() => handlePriceChange(tier.id, tier.price + 50)}
                  className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  +50
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Dynamic Pricing Tips</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Adjust prices based on real-time occupancy and demand</li>
          <li>• Consider increasing prices during peak hours (10PM - 12AM)</li>
          <li>• Use early bird pricing to encourage earlier arrivals</li>
          <li>• Monitor competitor pricing in your area</li>
        </ul>
      </div>
    </div>
  );
};

export default DynamicPricing; 