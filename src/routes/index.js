import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Guestlist from "../pages/Guestlist";
import Events from "../pages/Events";
import EventDashboard from "../components/analytics/EventDashboard"; // ✅ Add this

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/guestlist" element={<Guestlist />} />
      <Route path="/events" element={<Events />} />
      <Route path="/analytics-dashboard" element={<EventDashboard />} /> {/* ✅ Add this */}
    </Routes>
  );
};

export default AppRoutes;
