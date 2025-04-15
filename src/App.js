import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import AIInsights from './components/ai/AIInsights';
import PromoterPortal from './components/PromoterPortal';
import PromoterAnalytics from './components/analytics/PromoterAnalytics';
import TicketScannerAnalytics from './components/analytics/TicketScannerAnalytics';
import PRReferralAnalytics from './components/analytics/PRReferralAnalytics';
import StaffPerformance from './components/analytics/StaffPerformance';
import CustomerRetention from './components/analytics/CustomerRetention';
import GroupEntry from './components/GroupEntry';
import Settings from './components/Settings';

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
                <Route path="/analytics/ticket-scanner" element={<TicketScannerAnalytics />} />
                <Route path="/analytics/pr-referrals" element={<PRReferralAnalytics />} />
                <Route path="/analytics/staff-performance" element={<StaffPerformance />} />
                <Route path="/analytics/customer-retention" element={<CustomerRetention />} />
                <Route path="/social" element={<SocialMediaAnalytics />} />
                <Route path="/market" element={<MarketIntelligence />} />
                <Route path="/promoter-analytics" element={<PromoterAnalytics />} />
                
                {/* Management & Settings Routes */}
                <Route path="/events" element={<EventManagement />} />
                <Route path="/pricing" element={<DynamicPricing />} />
                <Route path="/group-entry-demo" element={<GroupEntryDemo />} />
                <Route path="/group-entry" element={<GroupEntry />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/promoter-portal" element={<PromoterPortal />} />
                
                {/* Utility Routes */}
                <Route path="/check-in" element={<QRScanner />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </DataSourceProvider>
  );
}

export default App;
