"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  TrendingUp,
  Eye,
  MousePointer,
  Calendar,
  Hash,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  Image as ImageIcon,
  Edit3,
  Settings,
  Zap,
} from "lucide-react";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Cell,
} from "recharts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: ChatBotResponse;
}

interface Option {
  label: string;
  value: string;
  type: string;
}

interface Metric {
  name: string;
  value: number;
  unit: string;
}

interface Insight {
  text: string;
  metric: Metric;
}

interface ChartData {
  title: string;
  type: "line" | "bar" | "pie";
  data: Array<{
    x: string;
    y: number;
    series?: string;
  }>;
}

interface Source {
  title: string;
  url: string;
}

interface Draft {
  caption?: string;
  headline?: string;
  body_text?: string;
  images?: string[];
  call_to_action?: string;
}

interface Requirements {
  post_type?: string;
  tone?: string;
  keywords?: string[];
  image_style?: string;
  schedule_time?: string;
}

interface Recommendations {
  hashtags?: string[];
  trend_alignment?: string;
}

interface ChatBotResponse {
  assistant_message: string;
  options?: Option[];
  affected_products?: string[];
  requirements?: Requirements;
  insights?: Insight[];
  charts?: ChartData[];
  sources?: Source[];
  draft?: Draft;
  recommendations?: Recommendations;
  performance_prediction?: Insight[];
  state: "collecting_info" | "awaiting_confirmation" | "final_draft";

  // Boolean flags to control UI rendering
  show_options?: boolean;
  show_insights?: boolean;
  show_charts?: boolean;
  show_sources?: boolean;
  show_draft?: boolean;
  show_recommendations?: boolean;
  show_performance?: boolean;
  show_requirements?: boolean;
}

const COLORS = ["#000000", "#333333", "#666666", "#999999", "#cccccc"];

const renderChart = (chart: ChartData) => {
  const chartData = chart.data.map((item) => ({
    name: item.x,
    value: item.y,
    series: item.series || "default",
  }));

  switch (chart.type) {
    case "line":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <RechartsLine data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#000"
              strokeWidth={2}
              dot={{ fill: "#000", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#000" }}
            />
          </RechartsLine>
        </ResponsiveContainer>
      );
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="name" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" fill="#000" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case "pie":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <RechartsPie>
            <RechartsPie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </RechartsPie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </RechartsPie>
        </ResponsiveContainer>
      );
  }
};

export default renderChart;
