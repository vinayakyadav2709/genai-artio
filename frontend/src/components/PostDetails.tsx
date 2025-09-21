"use client";

import {
  ArrowLeft,
  Eye,
  ThumbsUp,
  Share,
  MessageCircle,
  Calendar,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

export interface PostDetailsProps {
  post: any; // You can type this fully if you want
  onBack?: () => void;
}

const PostDetails = ({ post, onBack }: PostDetailsProps) => {
  if (!post) return <p className="text-white">No post data provided.</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Posts
        </button>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Post Header */}
        <div className="border-b border-gray-800 pb-6 mb-8">
          <h1 className="text-3xl font-bold mb-3">{post.caption}</h1>
          <p className="text-gray-400 flex items-center gap-2 mb-4">
            <Calendar size={16} />
            {new Date(post.scheduled_time).toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-3">
            {post.platforms.map((platform: string) => (
              <span
                key={platform}
                className="px-4 py-2 rounded-full bg-gray-800 text-sm capitalize"
              >
                {platform}
              </span>
            ))}
            <span
              className={`px-4 py-2 rounded-full text-sm ${
                post.status === "posted"
                  ? "bg-green-700 text-green-200"
                  : "bg-yellow-700 text-yellow-200"
              }`}
            >
              {post.status}
            </span>
          </div>
        </div>

        {/* Stats + Insights */}
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Eye,
                  label: "Impressions",
                  value: post.stats.impressions,
                  color: "blue",
                },
                {
                  icon: ThumbsUp,
                  label: "Likes",
                  value: post.stats.likes,
                  color: "pink",
                },
                {
                  icon: Share,
                  label: "Shares",
                  value: post.stats.shares,
                  color: "yellow",
                },
                {
                  icon: MessageCircle,
                  label: "Comments",
                  value: post.stats.comments,
                  color: "green",
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="bg-gray-900 p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <Icon className={`mb-2 text-${color}-400`} size={20} />
                  <p className="text-xl font-bold">{value.toLocaleString()}</p>
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
                {post.insights.map((insight: any, idx: number) => (
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
          </div>

          {/* Graphs */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.graphs.map((graph, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80"
                >
                  <h2 className="text-lg font-semibold  ">{graph.title}</h2>
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
                    ) : (
                      <PieChart>
                        <Pie
                          data={graph.data}
                          dataKey="y"
                          nameKey="x"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
