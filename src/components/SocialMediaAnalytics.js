import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import instagramService from '../services/instagramService';

const SocialMediaAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [eventMetrics, setEventMetrics] = useState(null);
  const [optimalTimes, setOptimalTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [combinedMetrics, eventData, postingTimes] = await Promise.all([
        instagramService.getCombinedMetrics(),
        instagramService.getEventPromotionMetrics('current_event'),
        instagramService.getOptimalPostingTimes()
      ]);
      
      // Transform the data for our charts
      const transformedData = {
        instagramClicks: combinedMetrics.instagram.daily_clicks || [],
        conversionMetrics: {
          totalClicks: combinedMetrics.appClicks.total,
          uniqueClicks: Object.keys(combinedMetrics.appClicks.byContentType).length,
          followersGained: combinedMetrics.instagram.follower_count_delta,
          averageEngagement: combinedMetrics.instagram.engagement_rate,
          storyViews: combinedMetrics.instagram.story_views,
          profileVisits: combinedMetrics.instagram.profile_views
        },
        topPerformingContent: await Promise.all(
          (combinedMetrics.instagram.top_media || []).map(async media => {
            const insights = await instagramService.getMediaInsights(media.id);
            return {
              type: media.media_type,
              description: media.caption || 'No caption',
              engagement: insights.engagement,
              clicks: combinedMetrics.appClicks.byContentType[media.id] || 0,
              conversion: calculateConversion(
                combinedMetrics.appClicks.byContentType[media.id] || 0,
                insights.engagement
              )
            };
          })
        ),
        peakTimes: combinedMetrics.instagram.hourly_stats || []
      };

      setAnalyticsData(transformedData);
      setEventMetrics(eventData);
      setOptimalTimes(postingTimes);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const calculateConversion = (clicks, engagement) => {
    if (!engagement) return 0;
    return ((clicks / engagement) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Media Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">App-to-Instagram Clicks</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {analyticsData.conversionMetrics.totalClicks}
            </p>
            <p className="ml-2 text-sm text-green-600 dark:text-green-400">
              +{((analyticsData.conversionMetrics.totalClicks / analyticsData.conversionMetrics.profileVisits) * 100).toFixed(1)}% conversion
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {analyticsData.conversionMetrics.uniqueClicks} unique users
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">New Followers from App</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {analyticsData.conversionMetrics.followersGained}
            </p>
            <p className="ml-2 text-sm text-green-600 dark:text-green-400">
              +{((analyticsData.conversionMetrics.followersGained / analyticsData.conversionMetrics.totalClicks) * 100).toFixed(1)}% conversion
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {analyticsData.conversionMetrics.profileVisits} profile visits
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Story Views</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {analyticsData.conversionMetrics.storyViews}
            </p>
            <p className="ml-2 text-sm text-green-600 dark:text-green-400">
              {analyticsData.conversionMetrics.averageEngagement}% engagement
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Average {Math.round(analyticsData.conversionMetrics.storyViews / 7)} views per day
          </p>
        </div>
      </div>

      {/* Event Promotion Impact */}
      {eventMetrics && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Promotion Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Reach</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{eventMetrics.totalReach.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Sales Impact</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{eventMetrics.salesImpact.toFixed(1)}%</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Rate</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {((eventMetrics.totalEngagement / eventMetrics.totalReach) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Best Performing Content</h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Type: {eventMetrics.bestPerformingContent?.type}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Engagement: {eventMetrics.bestPerformingContent?.engagement.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Description: {eventMetrics.bestPerformingContent?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Optimal Posting Times */}
      {optimalTimes && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Optimal Posting Times</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Best Hours to Post</h4>
              <div className="space-y-2">
                {optimalTimes.bestHours.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(2022, 0, 1, hour.hour).toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                    </span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {hour.averageEngagement.toFixed(1)} avg. engagement
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Best Days to Post</h4>
              <div className="space-y-2">
                {optimalTimes.bestDays.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-300">{day.day}</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {day.engagement.toLocaleString()} engagement
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Posting Schedule Recommendations</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⭐</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Schedule your most important event announcements for {optimalTimes.bestHours[0].hour}:00, when engagement is highest
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⭐</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Focus your weekly content on {optimalTimes.bestDays[0].day}s and {optimalTimes.bestDays[1].day}s
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⭐</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Consider posting stories 2-3 hours before peak engagement times to build anticipation
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Conversion Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Click-to-Follow Conversion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.instagramClicks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clicks" stroke="#8884d8" name="App Clicks" />
              <Line type="monotone" dataKey="followers" stroke="#82ca9d" name="New Followers" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Peak Click Times</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.peakTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#8884d8" name="Instagram Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Content</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">App Clicks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {analyticsData.topPerformingContent.map((content, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{content.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{content.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{content.engagement}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{content.clicks}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{content.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips and Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights & Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="text-xl mr-3">🎯</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Peak engagement occurs between {getPeakEngagementTime(analyticsData.peakTimes)}. Consider posting stories and content during these hours.
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-xl mr-3">📈</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {getBestContentType(analyticsData.topPerformingContent)} have the highest conversion rate. Focus on creating more of this type of content.
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-xl mr-3">💡</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {getEngagementTip(analyticsData)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for insights
const getPeakEngagementTime = (peakTimes) => {
  if (!peakTimes.length) return '9 PM - 11 PM';
  const sorted = [...peakTimes].sort((a, b) => b.clicks - a.clicks);
  const peak = sorted[0];
  return peak.hour;
};

const getBestContentType = (content) => {
  if (!content.length) return 'Reels showing club atmosphere';
  const sorted = [...content].sort((a, b) => b.conversion - a.conversion);
  return `${sorted[0].type}s about ${sorted[0].description.toLowerCase()}`;
};

const getEngagementTip = (data) => {
  const storyConversion = data.conversionMetrics.storyViews / data.conversionMetrics.profileVisits;
  if (storyConversion > 0.5) {
    return 'Story views are driving significant traffic. Keep using stories for event announcements and behind-the-scenes content.';
  }
  return 'Consider increasing story frequency to boost engagement. Stories are currently underutilized.';
};

export default SocialMediaAnalytics; 