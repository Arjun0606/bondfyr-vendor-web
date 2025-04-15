import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import GuestProfileAnalytics from './analytics/GuestProfileAnalytics';
import TicketEntryAnalytics from './analytics/TicketEntryAnalytics';
import PRReferralAnalytics from './analytics/PRReferralAnalytics';
import SecurityAnalytics from './analytics/SecurityAnalytics';
import PhotoContestAnalytics from './analytics/PhotoContestAnalytics';
import { Link } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const VendorAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');

  const categories = [
    { id: 'guest-profile', name: 'Guest Profiles', icon: '👥' },
    { id: 'ticket-entry', name: 'Ticket & Entry', icon: '🎟️' },
    { id: 'pr-referral', name: 'PR & Referrals', icon: '💰' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'photo-contest', name: 'Photo Contest', icon: '📸' },
  ];

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <span className="text-gray-600 dark:text-gray-300">Time Range:</span>
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow p-1">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                timeRange === 'today'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                timeRange === 'week'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                timeRange === 'month'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
            {categories.map((category) => (
              <Tab
                key={category.id}
                className={({ selected }) =>
                  classNames(
                    'w-full py-3 text-sm leading-5 font-medium text-gray-600 dark:text-gray-300 rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-indigo-200 ring-opacity-60',
                    selected
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 shadow'
                      : 'hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                  )
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </div>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <GuestProfileAnalytics timeRange={timeRange} />
            </Tab.Panel>
            <Tab.Panel className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <TicketEntryAnalytics timeRange={timeRange} />
            </Tab.Panel>
            <Tab.Panel className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    For detailed PR tracking and management, visit the <strong>PR Analytics</strong> section.
                  </p>
                </div>
                <Link 
                  to="/promoter-analytics"
                  className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  View PR Analytics
                </Link>
              </div>
              <PRReferralAnalytics timeRange={timeRange} />
            </Tab.Panel>
            <Tab.Panel className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <SecurityAnalytics timeRange={timeRange} />
            </Tab.Panel>
            <Tab.Panel className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <PhotoContestAnalytics timeRange={timeRange} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Data shown is illustrative. Connect your systems for real-time analytics.
        </p>
      </div>
    </div>
  );
};

export default VendorAnalyticsDashboard; 