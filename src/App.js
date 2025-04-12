import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LiveOverview from './components/LiveOverview';
import EventManagement from './components/EventManagement';
import QRScanner from './components/QRScanner';
import VendorAnalyticsDashboard from './components/VendorAnalyticsDashboard';
import GroupEntryDemo from './components/GroupEntryDemo';
import DataSourceProvider from './context/DataSourceContext';
import DataModeToggle from './components/DataModeToggle';
import DynamicPricing from './components/DynamicPricing';
import MarketIntelligence from './components/MarketIntelligence';
import SocialMediaAnalytics from './components/SocialMediaAnalytics';

// Import other components as needed

function App() {
  return (
    <DataSourceProvider>
      <Router>
        <Routes>
          <Route path="/*" element={
            <DashboardLayout headerExtra={<DataModeToggle />}>
              <Routes>
                {/* Monitoring & Analytics Routes */}
                <Route path="/" element={<LiveOverview />} />
                <Route path="/analytics" element={<VendorAnalyticsDashboard />} />
                <Route path="/social" element={<SocialMediaAnalytics />} />
                <Route path="/market" element={<MarketIntelligence />} />
                
                {/* Management & Settings Routes */}
                <Route path="/events" element={<EventManagement />} />
                <Route path="/pricing" element={<DynamicPricing />} />
                <Route path="/group-entry-demo" element={<GroupEntryDemo />} />
                
                {/* Utility Routes */}
                <Route path="/check-in" element={<QRScanner />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </DataSourceProvider>
  );
}

export default App;
