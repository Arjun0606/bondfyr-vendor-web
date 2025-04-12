import React from 'react';
import GroupEntryScanner from '../components/analytics/GroupEntryScanner';

const GroupEntryDemo = () => {
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl">
      <div className="mx-auto max-w-screen-md text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white md:text-3xl">
          Group Entry Demo
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400 sm:text-xl">
          This demonstrates the group entry process with tiered pricing, enabling bouncers to handle partial group arrivals.
        </p>
      </div>
      
      <GroupEntryScanner />
    </div>
  );
};

export default GroupEntryDemo; 