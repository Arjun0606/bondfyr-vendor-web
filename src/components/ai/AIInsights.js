import React from 'react';

const AIInsights = () => {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          AI Insights
        </h2>
        <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
          Coming Soon
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            AI Insights Engine
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
            Our AI engine is analyzing your venue data to provide actionable insights. This feature will be available soon.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg max-w-md">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">What to expect:</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
              <li>Attendance pattern analysis</li>
              <li>Revenue optimization suggestions</li>
              <li>Customer demographic insights</li>
              <li>Marketing effectiveness indicators</li>
              <li>Operational efficiency recommendations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Premium Feature • Available in next update
        </p>
      </div>
    </div>
  );
};

export default AIInsights; 