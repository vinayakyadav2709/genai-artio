"use client";

import React, { useState } from "react";
import {
  Share2,
  MessageCircle,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react"; // Added PieChart for analytics tab

// Tabs configuration
const dashboardTabs = [
  { id: "posts", label: "Posts", icon: Share2 },
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "products", label: "Products", icon: Target },
  { id: "research", label: "Research", icon: BarChart3 },
  { id: "analytics", label: "Analytics", icon: PieChart }, // 5th tab
];

// Dashboard data
const dashboardData = {
  posts: {
    recentPosts: [
      {
        title: "Eco-friendly Sarees",
        subtitle: "Facebook, Instagram • 2.3K views",
        gradient: "from-blue-500 to-purple-500",
      },
      {
        title: "Handcrafted Pottery",
        subtitle: "Instagram • 1.8K views",
        gradient: "from-green-500 to-blue-500",
      },
    ],
    performance: [
      { label: "Total Reach", value: "25.6K", color: "text-white" },
      { label: "Engagement Rate", value: "6.8%", color: "text-green-400" },
      { label: "New Followers", value: "+342", color: "text-blue-400" },
    ],
  },
  chats: {
    activeConversations: [
      {
        name: "Asha Patel",
        lastMessage: "Interested in blue sarees...",
        badgeColor: "bg-green-500",
        avatarColor: "bg-green-600",
        avatarText: "A",
      },
      {
        name: "Rajesh Kumar",
        lastMessage: "Asked about pottery classes...",
        badgeColor: "bg-yellow-500",
        avatarColor: "bg-blue-600",
        avatarText: "R",
      },
    ],
    responseAnalytics: [
      { label: "Avg Response Time", value: "2.3 min", color: "text-white" },
      { label: "Customer Satisfaction", value: "94%", color: "text-green-400" },
      { label: "Conversion Rate", value: "18.5%", color: "text-blue-400" },
    ],
  },
  products: [
    {
      name: "Handloom Saree",
      price: "₹2,500",
      views: "1.2K",
      growth: "+12% ↗",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Clay Pottery",
      price: "₹800",
      views: "956",
      growth: "+8% ↗",
      gradient: "from-blue-500 to-green-500",
    },
    {
      name: "Silver Jewelry",
      price: "₹3,200",
      views: "2.1K",
      growth: "+25% ↗",
      gradient: "from-orange-500 to-red-500",
    },
  ],
  research: {
    trendingTopics: [
      { name: "Eco-friendly Fashion", growth: "+15%" },
      { name: "Handmade Jewelry", growth: "+12%" },
      { name: "Traditional Crafts", growth: "+8%" },
    ],
    marketInsights: [
      {
        title: "Best Posting Time",
        detail: "6-8 PM IST for maximum engagement",
      },
      {
        title: "Popular Hashtags",
        detail: "#HandmadeInIndia #SustainableFashion",
      },
    ],
  },
  analytics: {
    overview: [
      { label: "Total Revenue", value: "₹1.2M", color: "text-green-400" },
      { label: "Total Orders", value: "4.8K", color: "text-blue-400" },
      { label: "Conversion Rate", value: "18%", color: "text-white" },
    ],
    charts: [
      { title: "Monthly Sales", type: "bar" },
      { title: "Visitor Trends", type: "line" },
    ],
  },
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <section className="min-h-screen bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">
            Your <span className="text-blue-400">Smart Dashboard</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get insights, manage conversations, and track performance all in one
            place.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-800 overflow-x-auto">
            {dashboardTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* POSTS */}
            {activeTab === "posts" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
                  <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {dashboardData.posts.recentPosts.map((post, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                      >
                        <div
                          className={`w-14 h-14 bg-gradient-to-r ${post.gradient} rounded-lg`}
                        />
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-gray-400">
                            {post.subtitle}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
                  <h3 className="text-lg font-semibold mb-4">Performance</h3>
                  <div className="space-y-4">
                    {dashboardData.posts.performance.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-400">{item.label}</span>
                        <span className={`${item.color} font-semibold`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CHATS */}
            {activeTab === "chats" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
                  <h3 className="text-lg font-semibold mb-4">
                    Active Conversations
                  </h3>
                  <div className="space-y-4">
                    {dashboardData.chats.activeConversations.map((chat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                      >
                        <div
                          className={`w-10 h-10 ${chat.avatarColor} rounded-full flex items-center justify-center font-semibold`}
                        >
                          {chat.avatarText}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{chat.name}</div>
                          <div className="text-sm text-gray-400">
                            {chat.lastMessage}
                          </div>
                        </div>
                        <div
                          className={`w-3 h-3 ${chat.badgeColor} rounded-full`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
                  <h3 className="text-lg font-semibold mb-4">
                    Response Analytics
                  </h3>
                  <div className="space-y-4">
                    {dashboardData.chats.responseAnalytics.map((metric, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-400">{metric.label}</span>
                        <span className={`${metric.color} font-semibold`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === "products" && (
              <div className="grid md:grid-cols-3 gap-6">
                {dashboardData.products.map((product, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow hover:bg-gray-800 transition"
                  >
                    <div
                      className={`w-full h-32 bg-gradient-to-r ${product.gradient} rounded-lg mb-4`}
                    />
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {product.price}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Views: {product.views}
                      </span>
                      <span className="text-green-400">{product.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RESEARCH */}
            {activeTab === "research" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
                  <h3 className="text-lg font-semibold mb-4">
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {dashboardData.research.trendingTopics.map((topic, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                      >
                        <span>{topic.name}</span>
                        <span className="text-green-400 font-semibold">
                          {topic.growth}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
                  <h3 className="text-lg font-semibold mb-4">
                    Market Insights
                  </h3>
                  <div className="space-y-3">
                    {dashboardData.research.marketInsights.map((insight, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                      >
                        <div className="font-medium mb-2">{insight.title}</div>
                        <div className="text-gray-400">{insight.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <div className="space-y-4">
                    {dashboardData.analytics.overview.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-400">{item.label}</span>
                        <span className={`${item.color} font-semibold`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
                  <h3 className="text-lg font-semibold mb-4">Charts</h3>
                  <div className="space-y-4">
                    {dashboardData.analytics.charts.map((chart, i) => (
                      <div key={i} className="p-4 bg-gray-800 rounded-lg">
                        <div className="font-medium mb-2">{chart.title}</div>
                        <div className="text-gray-400">
                          [Chart placeholder for {chart.type}]
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
