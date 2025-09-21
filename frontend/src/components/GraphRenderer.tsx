"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

export default function GraphRenderer({ graph }) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80">
      <h2 className="text-lg font-semibold mb-4">{graph.title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        {graph.type === "line" ? (
          <LineChart data={graph.data}>
            <XAxis dataKey="x" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
              }}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#3B82F6"
              strokeWidth={2}
            />
          </LineChart>
        ) : graph.type === "bar" ? (
          <BarChart data={graph.data}>
            <XAxis dataKey="x" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
              }}
            />
            <Bar dataKey="y" fill="#10B981" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={graph.data}
              dataKey="y"
              nameKey="x"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {graph.data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
