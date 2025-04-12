import React from 'react';
import { useDataSource } from '../context/DataSourceContext';

const DataModeToggle = () => {
  const { isDummyData, toggleDataSource, isLoading } = useDataSource();

  return (
    <div className="flex items-center space-x-3 py-2 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Data Mode:</span>
      
      <div className="relative flex items-center">
        <button
          onClick={() => toggleDataSource(true)}
          className={`px-3 py-1.5 text-xs rounded-l-md transition-colors ${
            isDummyData 
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Demo Data
        </button>
        
        <button
          onClick={() => toggleDataSource(false)}
          disabled={isLoading}
          className={`px-3 py-1.5 text-xs rounded-r-md transition-colors ${
            !isDummyData 
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Loading...' : 'Live Data'}
        </button>
      </div>
      
      {isDummyData && (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            Demo mode shows 30 days of sample data
          </span>
        </div>
      )}
    </div>
  );
};

export default DataModeToggle; 