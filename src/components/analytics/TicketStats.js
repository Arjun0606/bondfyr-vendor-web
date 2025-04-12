import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TicketStats = () => {
  const data = [
    { type: "Tier 1", sold: 82 },
    { type: "VIP", sold: 31 },
    { type: "Guestlist", sold: 104 }
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-white">🎟️ Ticket Breakdown (Graph)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="type" stroke="#ccc" />
          <YAxis stroke="#ccc" allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="sold" fill="#38bdf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketStats;
