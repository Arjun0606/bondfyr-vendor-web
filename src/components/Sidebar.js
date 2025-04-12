import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">🔥 Bondfyr Vendor</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/">Dashboard</Link>
        <Link to="/events">Events</Link>
        <Link to="/guestlist">Guestlist</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/analytics-dashboard">📊 Event Dashboard</Link>
        <Link to="/group-entry-demo">👥 Group Entry Demo</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
