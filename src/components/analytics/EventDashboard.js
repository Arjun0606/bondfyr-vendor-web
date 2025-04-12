import React from "react";
import PRPerformance from "./PRPerformance";
import SecurityAlerts from "./SecurityAlerts";
import EntryHeatmap from "./Heatmaps";
import PhotoEngagement from "./PhotoEngagement";
import GuestInsights from "./GuestInsights";
import NotificationStats from "./NotificationStats";
import TicketStats from "./TicketStats";
import RevenueBreakdown from "./RevenueBreakdown";
import StaffPerformance from "./StaffPerformance";
import TopInfluencers from "./TopInfluencers";
import GenderRatioChart from "./GenderRatioChart";


const EventDashboard = () => {
  return (
    <div className="text-white space-y-6">
      <h1 className="text-3xl font-bold mb-4">📊 Event Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">👥 Total Guests: <b>263</b></div>
        <div className="bg-gray-800 p-4 rounded-lg">✅ Check-ins: <b>178</b></div>
        <div className="bg-gray-800 p-4 rounded-lg">💰 Revenue: ₹<b>87,400</b></div>
        <GenderRatioChart />
      </div>

      {/* Guest List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">🧍 Guest Snapshot</h2>
        <table className="w-full table-auto text-left text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Gender</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Visits</th>
              <th className="p-2">Referral</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Riya Mehta", gender: "Female", dob: "1999-11-12", visits: 4, ref: "PR Aman" },
              { name: "Ankit Sharma", gender: "Male", dob: "2001-05-03", visits: 1, ref: "App Direct" },
              { name: "Zoya Khan", gender: "Female", dob: "2000-02-20", visits: 2, ref: "PR Raghav" },
            ].map((g, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-2">{g.name}</td>
                <td className="p-2">{g.gender}</td>
                <td className="p-2">{g.dob}</td>
                <td className="p-2">{g.visits}</td>
                <td className="p-2">{g.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketStats />
        <RevenueBreakdown />
        <GuestInsights />
        <PhotoEngagement />
        <PRPerformance />
        <TopInfluencers />
        <StaffPerformance />
        <NotificationStats />
        <SecurityAlerts />
        <EntryHeatmap />
      </div>
    </div>
  );
};

export default EventDashboard;
