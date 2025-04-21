import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LiveOverview from './components/LiveOverview';
import EventManagement from './components/EventManagement';
import QRScanner from './components/QRScanner';
import VendorAnalyticsDashboard from './components/VendorAnalyticsDashboard';
import GroupEntryDemo from './components/GroupEntryDemo';
import DataSourceProvider from './context/DataSourceContext';
import AuthProvider, { useAuth } from './context/AuthContext';
import DataModeToggle from './components/DataModeToggle';
import DynamicPricing from './components/DynamicPricing';
import MarketIntelligence from './components/MarketIntelligence';
import SocialMediaAnalytics from './components/SocialMediaAnalytics';
import AIInsights from './components/ai/AIInsights';
import PromoterPortal from './components/PromoterPortal';
import PromoterAnalytics from './components/analytics/PromoterAnalytics';
import VenueProfile from './components/VenueProfile';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import Settings from './pages/Settings';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <DataSourceProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <DashboardLayout headerExtra={<DataModeToggle />}>
                  <Routes>
                    {/* Monitoring & Analytics Routes */}
                    <Route path="/" element={<LiveOverview />} />
                    <Route path="/ai-insights" element={<AIInsights />} />
                    <Route path="/analytics" element={<VendorAnalyticsDashboard />} />
                    <Route path="/social" element={<SocialMediaAnalytics />} />
                    <Route path="/market" element={<MarketIntelligence />} />
                    <Route path="/promoter-analytics" element={<PromoterAnalytics />} />
                    
                    {/* Management & Settings Routes */}
                    <Route path="/venue-profile" element={<VenueProfile />} />
                    <Route path="/events" element={<EventManagement />} />
                    <Route path="/pricing" element={<DynamicPricing />} />
                    <Route path="/group-entry-demo" element={<GroupEntryDemo />} />
                    <Route path="/promoter-portal" element={<PromoterPortal />} />
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* Utility Routes */}
                    <Route path="/check-in" element={<QRScanner />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
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
    </AuthProvider>
  );
}

export default App;
