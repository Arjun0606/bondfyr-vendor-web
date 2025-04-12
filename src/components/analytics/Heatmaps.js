import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const EntryHeatmap = () => {
  const data = [
    { time: "9:00 PM", checkIns: 12 },
    { time: "9:30 PM", checkIns: 34 },
    { time: "10:00 PM", checkIns: 57 },
    { time: "10:30 PM", checkIns: 68 },
    { time: "11:00 PM", checkIns: 54 },
    { time: "11:30 PM", checkIns: 30 },
    { time: "12:00 AM", checkIns: 15 }
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-white">🔥 Entry Heatmap
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#ccc" />
          <YAxis stroke="#ccc" allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="checkIns" stroke="#34d399" strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EntryHeatmap;
