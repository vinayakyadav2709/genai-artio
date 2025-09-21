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

const COLORS = ["#000000", "#333333", "#666666", "#999999", "#cccccc"];

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
      const formData = new FormData();
      formData.append("message", message);
      formData.append(
        "selections",
        JSON.stringify(optionValue ? [{ value: optionValue }] : [{}])
      );

      const response = await fetch("http://localhost:8000/assistant/chat", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      const history = await response.json();

      const lastTurn = history[history.length - 1];

      const assistantMessage: Message = {
        id: lastTurn.turn_id || (Date.now() + 1).toString(),
        role: "assistant",
        content: lastTurn.assistant_message || lastTurn.content || "",
        timestamp: new Date(lastTurn.timestamp),
        data: lastTurn,
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
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />{" "}
              {/* gray-700 */}
              <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />{" "}
              {/* gray-300 */}
              <YAxis stroke="#d1d5db" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1917", // stone-950
                  border: "1px solid #374151", // gray-700
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#60a5fa" // blue-400
                strokeWidth={2}
                dot={{ fill: "#60a5fa", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#3b82f6" }} // blue-500
              />
            </RechartsLine>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#d1d5db" fontSize={12} />
              <YAxis stroke="#d1d5db" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1917",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />{" "}
              {/* blue-400 */}
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
                    fill={COLORS[index % COLORS.length]} // Use your COLORS array
                  />
                ))}
              </RechartsPie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1c1917",
                  border: "1px solid #374151",
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
    console.log(data);

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
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 text-black`}
          >
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>

          {/* Message Content */}
          <div className="flex flex-col gap-4">
            {/* Main Message */}
            <div
              className={`p-4 rounded-2xl border ${
                isUser
                  ? "bg-stone-950 text-white border-gray-700 rounded-br-md"
                  : "bg-stone-950 text-white border-gray-700 rounded-bl-md"
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
                    <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="text-blue-400" size={16} />
                        <span className="font-medium text-white">
                          Market Insights
                        </span>
                      </div>
                      <div className="space-y-3">
                        {data.insights.map((insight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-300">
                              {insight.text}
                            </span>
                            <div className="bg-blue-900/40 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-blue-300">
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
                        className="bg-stone-950 border border-gray-700 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 className="text-gray-400" size={16} />
                          <span className="font-medium text-white">
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
                  <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Edit3 className="text-purple-400" size={16} />
                      <span className="font-medium text-purple-200">
                        Content Draft
                      </span>
                    </div>

                    {data.draft.headline && (
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-white mb-2">
                          {data.draft.headline}
                        </h3>
                      </div>
                    )}

                    {data.draft.caption && (
                      <div className="mb-4">
                        <p className="text-gray-200 leading-relaxed">
                          {data.draft.caption}
                        </p>
                      </div>
                    )}

                    {data.draft.body_text && (
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {data.draft.body_text}
                        </p>
                      </div>
                    )}

                    {data.draft.images && data.draft.images.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="text-gray-400" size={14} />
                          <span className="text-sm text-gray-400">Images</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {data.draft.images.map((_, idx) => (
                            <div
                              key={idx}
                              className="aspect-square bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center"
                            >
                              <ImageIcon className="text-gray-500" size={24} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.draft.call_to_action && (
                      <div className="flex justify-end">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-500 transition-colors">
                          {data.draft.call_to_action}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendations */}
                {data.show_recommendations && data.recommendations && (
                  <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="text-green-400" size={16} />
                      <span className="font-medium text-green-200">
                        Recommendations
                      </span>
                    </div>

                    {data.recommendations.hashtags && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Hash className="text-green-400" size={14} />
                          <span className="text-sm font-medium text-green-300">
                            Suggested Hashtags
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {data.recommendations.hashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-green-900/40 text-green-300 px-3 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.recommendations.trend_alignment && (
                      <div className="text-sm text-green-300">
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
                    <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="text-orange-400" size={16} />
                        <span className="font-medium text-orange-200">
                          Performance Prediction
                        </span>
                      </div>
                      <div className="space-y-3">
                        {data.performance_prediction.map((pred, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-300">
                              {pred.text}
                            </span>
                            <div className="bg-orange-900/40 px-3 py-1 rounded-full">
                              <span className="text-sm font-medium text-orange-300">
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
                    <div className="bg-stone-950 border border-gray-700 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Settings className="text-gray-400" size={16} />
                        <span className="font-medium text-white">Sources</span>
                      </div>
                      <div className="space-y-2">
                        {data.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-400 hover:text-blue-300 hover:underline"
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
                          className="bg-stone-950 text-white border border-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-stone-900"
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

  //reder of whole
  return (
    <div className="flex flex-col h-screen bg-stone-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-stone-950 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Marketing Assistant</h1>
            <p className="text-sm text-gray-300">
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md p-4">
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
      <div className="bg-stone-950 px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);

                  // Auto-grow until max height
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    200
                  )}px`; // max 200px (~6 lines)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full resize-none rounded-2xl border border-gray-700 bg-stone-900 text-white px-4 py-3 pr-12 
             focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all duration-200 text-sm
             max-h-[200px] overflow-y-auto custom-scrollbar"
                rows={1}
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 bottom-2 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
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

// app/chatbot/page.tsx
// "use client";

// import React from "react";
// import ChatBot from "@/components/ChatBotcomps/chatScreen";

// export default function ChatBotPage() {
//   return (
//     <div className="w-full h-screen">
//       <ChatBot />
//     </div>
//   );
// }
