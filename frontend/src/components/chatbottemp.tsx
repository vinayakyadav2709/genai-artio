// components/ChatBot.tsx
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

const COLORS = ["#0a0a0a", "#333333", "#666666", "#999999", "#cccccc"];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your AI marketing assistant. I can help you create posts, ads, and analyze trends for your business. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const sendMessage = async (message: string, optionValue?: string) => {
    if (!message.trim() && !optionValue) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message || optionValue || "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "123",
          message: message,
          selection: optionValue,
        }),
      });

      const data: ChatBotResponse = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.assistant_message,
        timestamp: new Date(),
        data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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
                  backgroundColor: "#",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#"
                strokeWidth={2}
                dot={{ fill: "#", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#" }}
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
                  backgroundColor: "#",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" fill="#" radius={[4, 4, 0, 0]} />
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
                  backgroundColor: "#",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    const data = message.data;

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
      >
        <div
          className={`flex max-w-[80%] ${
            isUser ? "flex-row-reverse" : "flex-row"
          } gap-3`}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isUser
                ? "bg-black text-white"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-black"
            }`}
          >
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>

          {/* Message Content */}
          <div className="flex flex-col gap-4">
            {/* Main Message */}
            <div
              className={`p-4 rounded-2xl ${
                isUser
                  ? "bg-black text-white rounded-br-md"
                  : "bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>

            {/* Assistant Data Components */}
            {!isUser && data && (
              <div className="space-y-4">
                {/* Insights */}
                {data.show_insights &&
                  data.insights &&
                  data.insights.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="text-blue-600" size={16} />
                        <span className="font-medium text-blue-900">
                          Market Insights
                        </span>
                      </div>
                      <div className="space-y-3">
                        {data.insights.map((insight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-700">
                              {insight.text}
                            </span>
                            <div className="bg-blue-100 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-blue-800">
                                {insight.metric.value} {insight.metric.unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Charts */}
                {data.show_charts && data.charts && data.charts.length > 0 && (
                  <div className="space-y-4">
                    {data.charts.map((chart, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 className="text-gray-600" size={16} />
                          <span className="font-medium text-gray-900">
                            {chart.title}
                          </span>
                        </div>
                        {renderChart(chart)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Draft */}
                {data.show_draft && data.draft && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Edit3 className="text-purple-600" size={16} />
                      <span className="font-medium text-purple-900">
                        Content Draft
                      </span>
                    </div>

                    {data.draft.headline && (
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                          {data.draft.headline}
                        </h3>
                      </div>
                    )}

                    {data.draft.caption && (
                      <div className="mb-4">
                        <p className="text-gray-800 leading-relaxed">
                          {data.draft.caption}
                        </p>
                      </div>
                    )}

                    {data.draft.body_text && (
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {data.draft.body_text}
                        </p>
                      </div>
                    )}

                    {data.draft.images && data.draft.images.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="text-gray-600" size={14} />
                          <span className="text-sm text-gray-600">Images</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {data.draft.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                            >
                              <ImageIcon className="text-gray-400" size={24} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.draft.call_to_action && (
                      <div className="flex justify-end">
                        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                          {data.draft.call_to_action}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendations */}
                {data.show_recommendations && data.recommendations && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="text-green-600" size={16} />
                      <span className="font-medium text-green-900">
                        Recommendations
                      </span>
                    </div>

                    {data.recommendations.hashtags && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Hash className="text-green-600" size={14} />
                          <span className="text-sm font-medium text-green-800">
                            Suggested Hashtags
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {data.recommendations.hashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.recommendations.trend_alignment && (
                      <div className="text-sm text-green-700">
                        <strong>Trend Alignment:</strong>{" "}
                        {data.recommendations.trend_alignment}
                      </div>
                    )}
                  </div>
                )}

                {/* Performance Prediction */}
                {data.show_performance &&
                  data.performance_prediction &&
                  data.performance_prediction.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="text-orange-600" size={16} />
                        <span className="font-medium text-orange-900">
                          Performance Prediction
                        </span>
                      </div>
                      <div className="space-y-3">
                        {data.performance_prediction.map((pred, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-700">
                              {pred.text}
                            </span>
                            <div className="bg-orange-100 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-orange-800">
                                {pred.metric.value.toLocaleString()}{" "}
                                {pred.metric.unit}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Sources */}
                {data.show_sources &&
                  data.sources &&
                  data.sources.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Settings className="text-gray-600" size={16} />
                        <span className="font-medium text-gray-900">
                          Sources
                        </span>
                      </div>
                      <div className="space-y-2">
                        {data.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Options */}
                {data.show_options &&
                  data.options &&
                  data.options.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {data.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage("", option.value)}
                          className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:border-gray-400 hover:shadow-sm"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-black to-gray-800 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              AI Marketing Assistant
            </h1>
            <p className="text-sm text-gray-600">
              Create posts, ads, and analyze trends
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map(renderMessage)}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-black flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200 text-sm"
                rows={1}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 bottom-2 w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
