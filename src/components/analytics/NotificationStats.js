import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const NotificationStats = () => {
  const data = [
    { label: "Push Opens", count: 72 },
    { label: "Conversions", count: 38 }
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-white">🛑 Notification Stats</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis type="number" stroke="#ccc" allowDecimals={false} />
          <YAxis dataKey="label" type="category" stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="count" fill="#818cf8" barSize={30} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NotificationStats;
