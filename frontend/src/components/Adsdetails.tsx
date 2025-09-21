"use client";

import {
  ArrowLeft,
  Eye,
  ShoppingCart,
  DollarSign,
  MousePointer,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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

export interface AdDetailsProps {
  ad: any;
  onBack?: () => void;
}

// helper to format date as DD MMM
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")} ${d.toLocaleString(
    "en-US",
    {
      month: "short",
    }
  )}`;
};

const AdDetails = ({ ad, onBack }: AdDetailsProps) => {
  if (!ad) return <p className="text-white">No ad data provided.</p>;

  // format dates in line chart data
  const formattedGraphs = ad.graphs?.map((graph: any) => {
    if (graph.type === "line") {
      return {
        ...graph,
        data: graph.data.map((d: any) => ({
          ...d,
          x: formatDate(d.x),
        })),
      };
    }
    return graph;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Ads
        </button>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Ad Header */}
        <div className="border-b border-gray-800 pb-6 mb-8">
          <h1 className="text-3xl font-bold mb-3">{ad.headline}</h1>
          <div className="flex flex-wrap gap-3 mb-4">
            {ad.platforms.map((platform: string) => (
              <span
                key={platform}
                className="px-4 py-2 rounded-full bg-gray-800 text-sm capitalize"
              >
                {platform.replace("_", " ")}
              </span>
            ))}
            <span
              className={`px-4 py-2 rounded-full text-sm ${
                ad.status === "running"
                  ? "bg-green-700 text-green-200"
                  : ad.status === "paused"
                  ? "bg-yellow-700 text-yellow-200"
                  : "bg-gray-700"
              }`}
            >
              {ad.status}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <span>Budget: ₹{ad.budget.toLocaleString()}</span>
            <span>Duration: {ad.duration_days} days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Impressions",
                value: ad.stats.impressions,
                icon: Eye,
                color: "blue",
              },
              {
                label: "Clicks",
                value: ad.stats.clicks,
                icon: MousePointer,
                color: "yellow",
              },
              {
                label: "Conversions",
                value: ad.stats.conversions,
                icon: ShoppingCart,
                color: "green",
              },
              {
                label: "Spent",
                value: `₹${ad.stats.spent}`,
                icon: DollarSign,
                color: "red",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-gray-900 p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <Icon className={`mb-2 text-${color}-400`} size={20} />
                <p className="text-xl font-bold">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-400" size={18} />
              Insights
            </h2>
            <div className="space-y-3">
              {ad.insights.map((insight: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
                >
                  <p className="text-sm">{insight.text}</p>
                  <span className="text-blue-400 text-sm font-medium">
                    {insight.metric.name}: {insight.metric.value}
                    {insight.metric.unit || ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formattedGraphs?.map((graph: any, idx: number) => (
              <div
                key={idx}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80"
              >
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
                      {Object.keys(graph.data[0] || {})
                        .filter((k) => k !== "x")
                        .map((key, i) => (
                          <Line
                            key={i}
                            type="monotone"
                            dataKey={key}
                            stroke={COLORS[i % COLORS.length]}
                            strokeWidth={2}
                          />
                        ))}
                    </LineChart>
                  ) : (
                    <BarChart data={graph.data}>
                      <XAxis dataKey="x" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                        }}
                      />
                      <Bar dataKey="y" fill="#F59E0B" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
