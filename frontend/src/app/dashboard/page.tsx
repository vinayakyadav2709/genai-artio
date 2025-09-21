"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Share2,
  MessageCircle,
  Target,
  BarChart3,
  ShoppingBag,
} from "lucide-react";

// Tabs configuration
const tabs = [
  { id: "posts", label: "Posts", icon: Share2, endpoint: "/dashboard/posts" },
  {
    id: "chats",
    label: "Chats",
    icon: MessageCircle,
    endpoint: "/dashboard/chats",
  },
  {
    id: "products",
    label: "Products",
    icon: ShoppingBag,
    endpoint: "/dashboard/products",
  },
  { id: "ads", label: "Ads", icon: Target, endpoint: "/dashboard/ads" },
  {
    id: "research",
    label: "Research",
    icon: BarChart3,
    endpoint: "/dashboard/research",
  },
];

const DashboardPage = () => {
  const [activeSubTabs, setActiveSubTabs] = useState<
    Record<string, "conversation" | "analysis">
  >({});

  const handleSubTabChange = (
    chatId: string,
    tab: "conversation" | "analysis"
  ) => {
    setActiveSubTabs((prev) => ({ ...prev, [chatId]: tab }));
  };
  const [activeTab, setActiveTab] = useState("posts");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch data when tab changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const tabConfig = tabs.find((t) => t.id === activeTab);
      if (!tabConfig) return;

      try {
        const res = await fetch(`http://localhost:8000${tabConfig.endpoint}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data || []);
        } else {
          setError(json.message || "Failed to load data");
        }
      } catch (err: any) {
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <main className="min-h-screen flex bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-stone-950 flex flex-col p-6 space-y-4 border-r border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Artisan Dashboard
        </h1>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white ${
              activeTab === tab.id ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {loading && <p className="text-gray-400 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <section>
            {/* POSTS */}
            {activeTab === "posts" && (
              <div className="grid md:grid-cols-2 gap-6">
                {data.map((post: any) =>
                  post.localizations.map((loc: any, index: number) => (
                    <div
                      key={`${post.post_id}-${index}`}
                      onClick={() =>
                        post?.post_id &&
                        router.push(`dashboard/posts/${post.post_id}`)
                      }
                      className="bg-stone-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-transform duration-300"
                    >
                      {/* Language/Region Tag */}
                      <div className="absolute mt-4 ml-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        {loc.language} / {loc.region}
                      </div>

                      {/* Post Image */}
                      {loc.images && loc.images.length > 0 && (
                        <img
                          src={loc.images[0]}
                          alt="Post Image"
                          className="w-full h-48 object-cover"
                        />
                      )}

                      <div className="p-5 space-y-3">
                        {/* Caption */}
                        <p className="text-white text-md line-clamp-4 hover:line-clamp-none transition-all duration-300">
                          {loc.caption || "No Caption"}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                          {loc.stats &&
                            loc.stats.map((stat: any) => (
                              <div
                                key={stat.name}
                                className="bg-stone-800 p-3 rounded-lg flex flex-col items-center justify-center"
                              >
                                <span className="text-gray-400 text-sm">
                                  {stat.name}
                                </span>
                                <span className="text-white font-bold text-lg">
                                  {stat.value}
                                </span>
                              </div>
                            ))}
                        </div>

                        {/* Hashtags */}
                        {loc.hashtags && loc.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {loc.hashtags.map((tag: string) => (
                              <span
                                key={tag}
                                className="text-blue-400 bg-stone-800 px-2 py-1 rounded-full text-xs hover:bg-blue-500 hover:text-white transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CHATS */}
            {activeTab === "chats" && (
              <div className="space-y-6">
                {data.map((chat: any) => {
                  const activeSubTab =
                    activeSubTabs[chat.chat_id] || "conversation";

                  return (
                    <div
                      key={chat.chat_id}
                      className="bg-stone-900 border border-gray-800 rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 relative"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center mb-5">
                        <h3 className="text-2xl font-semibold text-white">
                          Chat with {chat.customer_name || "Unknown"}
                        </h3>
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                          {chat.language?.toUpperCase() || "EN"}
                        </span>
                      </div>

                      {/* Sub Tabs */}
                      <div className="flex mb-5 border-b border-gray-700">
                        <button
                          onClick={() =>
                            handleSubTabChange(chat.chat_id, "conversation")
                          }
                          className={`flex-1 py-2 text-center text-sm font-semibold transition-colors ${
                            activeSubTab === "conversation"
                              ? "border-b-2 border-blue-500 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          Conversation
                        </button>
                        <button
                          onClick={() =>
                            handleSubTabChange(chat.chat_id, "analysis")
                          }
                          className={`flex-1 py-2 text-center text-sm font-semibold transition-colors ${
                            activeSubTab === "analysis"
                              ? "border-b-2 border-blue-500 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          Analysis
                        </button>
                      </div>

                      {/* Tab Content */}
                      {activeSubTab === "conversation" ? (
                        <div className="flex flex-col space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 mb-12">
                          {chat.conversation_history?.map(
                            (msg: any, idx: number) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-2xl max-w-[75%] break-words ${
                                  msg.role === "customer"
                                    ? "bg-gray-800 text-white self-start ml-0"
                                    : "bg-blue-700 text-white self-end ml-auto"
                                } shadow-md`}
                              >
                                <p className="text-sm">{msg.message}</p>
                                {msg.translation && (
                                  <p className="text-gray-300 text-xs mt-1 italic">
                                    {msg.translation}
                                  </p>
                                )}
                                <span className="text-gray-400 text-xs block mt-1 text-right">
                                  {new Date(msg.timestamp).toLocaleString()}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {/* Analysis tab remains completely unchanged */}
                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            {chat.stats?.map((stat: any) => (
                              <div
                                key={stat.name}
                                className="bg-stone-800 p-4 rounded-xl flex flex-col items-center shadow-inner hover:shadow-lg transition-shadow duration-200"
                              >
                                <span className="text-gray-400 text-sm">
                                  {stat.name}
                                </span>
                                <span className="text-white font-bold mt-1">
                                  {stat.value} {stat.unit}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Recommendations */}
                          {chat.recommendations?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {chat.recommendations.map(
                                (rec: string, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-stone-800 text-blue-400 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors"
                                  >
                                    {rec}
                                  </span>
                                )
                              )}
                            </div>
                          )}

                          {/* Insights */}
                          {chat.insights?.length > 0 && (
                            <div className="space-y-3">
                              {chat.insights.map((insight: any, i: number) => (
                                <div
                                  key={i}
                                  className="bg-stone-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-md"
                                >
                                  <p className="text-gray-200 text-sm">
                                    {insight.text}
                                  </p>
                                  <p className="text-gray-400 text-xs mt-1">
                                    {insight.metric.name}:{" "}
                                    {insight.metric.value} {insight.metric.unit}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Floating Chat Button on Card (Visual Only) */}
                      <button className="absolute bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                        Chat
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === "products" && (
              <div className="grid md:grid-cols-3 gap-6">
                {data.map((product: any) => (
                  <div
                    key={product?.product_id}
                    onClick={() =>
                      product?.product_id &&
                      router.push(`/products/${product.product_id}`)
                    }
                    className="bg-stone-900 border border-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition duration-300"
                  >
                    {/* Product Image */}
                    <img
                      src={product?.images?.[0] || "/placeholder.png"}
                      alt={product?.name || "Product"}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />

                    {/* Product Name & Category */}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {product?.name || "Unnamed Product"}
                      </h3>
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                        {product?.category || "N/A"}
                      </span>
                    </div>

                    {/* Price */}
                    <p className="text-gray-400 font-medium mb-2">
                      ₹{product?.price || "N/A"}
                    </p>

                    {/* Description */}
                    {product?.description && (
                      <p className="text-gray-300 text-sm mb-3">
                        {product.description}
                      </p>
                    )}

                    {/* Hashtags */}
                    {product?.hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {product.hashtags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-stone-800 text-blue-400 px-2 py-1 rounded-full text-xs hover:bg-blue-500 hover:text-white transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {product?.stats?.map((stat: any) => (
                        <div
                          key={stat.name}
                          className="bg-stone-800 p-2 rounded-lg flex flex-col items-center"
                        >
                          <span className="text-gray-400 text-xs">
                            {stat.name}
                          </span>
                          <span className="text-white font-bold">
                            {stat.value} {stat.unit}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    {product?.recommendations?.length > 0 && (
                      <div className="flex flex-col gap-1 mb-3">
                        {product.recommendations.map(
                          (rec: string, idx: number) => (
                            <div
                              key={idx}
                              className="bg-stone-800 px-3 py-1 rounded-lg text-xs text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                            >
                              {rec}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Insights */}
                    {product?.insights?.length > 0 && (
                      <div className="space-y-2">
                        {product.insights.map((insight: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-stone-800 p-3 rounded-lg border-l-4 border-green-500"
                          >
                            <p className="text-gray-200 text-sm">
                              {insight.text}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {insight.metric.name}: {insight.metric.value}{" "}
                              {insight.metric.unit}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ADS */}
            {activeTab === "ads" && (
              <div className="space-y-6">
                {data.map((ad: any) => (
                  <div
                    key={ad?.ad_id}
                    onClick={() => ad?.ad_id && router.push(`/ads/${ad.ad_id}`)}
                    className="bg-stone-900 border border-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition duration-300"
                  >
                    {/* Ad Headline */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {ad?.localizations?.[0]?.headline || "No Headline"}
                    </h3>

                    {/* Ad Status */}
                    <p className="text-gray-400 mb-3">
                      Status:{" "}
                      <span className="text-green-400">
                        {ad?.status || "Unknown"}
                      </span>
                    </p>

                    {/* Platforms & Budget */}
                    {ad?.localizations?.[0] && (
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="bg-stone-800 text-blue-400 px-2 py-1 rounded-full text-xs">
                          Platforms: {ad.localizations[0].platforms.join(", ")}
                        </span>
                        <span className="bg-stone-800 text-green-400 px-2 py-1 rounded-full text-xs">
                          Budget: ₹{ad.localizations[0].budget}
                        </span>
                        <span className="bg-stone-800 text-purple-400 px-2 py-1 rounded-full text-xs">
                          Duration: {ad.localizations[0].duration_days} days
                        </span>
                      </div>
                    )}

                    {/* Images */}
                    {ad?.localizations?.[0]?.images?.length > 0 && (
                      <div className="flex gap-2 mb-3 overflow-x-auto">
                        {ad.localizations[0].images.map(
                          (img: string, idx: number) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Ad Image ${idx + 1}`}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          )
                        )}
                      </div>
                    )}

                    {/* Hashtags */}
                    {ad?.localizations?.[0]?.hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ad.localizations[0].hashtags.map(
                          (tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-stone-800 text-blue-400 px-2 py-1 rounded-full text-xs hover:bg-blue-500 hover:text-white transition-colors"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    {ad?.localizations?.[0]?.stats?.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {ad.localizations[0].stats.map((stat: any) => (
                          <div
                            key={stat.name}
                            className="bg-stone-800 p-3 rounded-lg flex flex-col items-center"
                          >
                            <span className="text-gray-400 text-xs">
                              {stat.name}
                            </span>
                            <span className="text-white font-bold">
                              {stat.value} {stat.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Insights */}
                    {ad?.insights?.length > 0 && (
                      <div className="space-y-2">
                        {ad.insights.map((insight: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-stone-800 p-3 rounded-lg border-l-4 border-green-500"
                          >
                            <p className="text-gray-200 text-sm">
                              {insight.text}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {insight.metric.name}: {insight.metric.value}{" "}
                              {insight.metric.unit}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* RESEARCH */}
            {activeTab === "research" && (
              <div className="space-y-6">
                {data.map((item: any, i: number) => (
                  <div key={i} className="space-y-4">
                    {/* Trending Products */}
                    {item.trending_products?.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                          🔥 Trending Products
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          {item.trending_products.map(
                            (prod: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-stone-900 p-5 rounded-xl border border-gray-800"
                              >
                                <h3 className="text-lg font-semibold text-white">
                                  {prod.trend}
                                </h3>
                                <p className="text-gray-400">
                                  Growth Rate: {prod.growth_rate}
                                </p>
                                <p className="text-gray-400">
                                  Avg Price: ₹{prod.avg_price}
                                </p>

                                {/* Insights */}
                                {prod.insights?.map((ins: any, i: number) => (
                                  <div
                                    key={i}
                                    className="bg-stone-800 p-2 rounded-lg mt-2 border-l-4 border-blue-600"
                                  >
                                    <p className="text-gray-200 text-sm">
                                      {ins.text}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {ins.metric.name}: {ins.metric.value}{" "}
                                      {ins.metric.unit}
                                    </p>
                                  </div>
                                ))}

                                {/* Sources */}
                                {prod.sources?.length > 0 && (
                                  <div className="mt-2">
                                    {prod.sources.map((src: any, j: number) => (
                                      <a
                                        key={j}
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline text-sm block"
                                      >
                                        📊 Source: {src.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trending Social Topics */}
                    {item.trending_social_topics?.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                          💬 Trending Social Topics
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          {item.trending_social_topics.map(
                            (topic: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-stone-900 p-5 rounded-xl border border-gray-800"
                              >
                                <h3 className="text-lg font-semibold text-white">
                                  {topic.topic}
                                </h3>
                                <p className="text-gray-400">
                                  Growth Rate: {topic.growth_rate}
                                </p>

                                {topic.insights?.map((ins: any, i: number) => (
                                  <div
                                    key={i}
                                    className="bg-stone-800 p-2 rounded-lg mt-2 border-l-4 border-blue-600"
                                  >
                                    <p className="text-gray-200 text-sm">
                                      {ins.text}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {ins.metric.name}: {ins.metric.value}{" "}
                                      {ins.metric.unit}
                                    </p>
                                  </div>
                                ))}

                                {topic.sources?.length > 0 && (
                                  <div className="mt-2">
                                    {topic.sources.map(
                                      (src: any, j: number) => (
                                        <a
                                          key={j}
                                          href={src.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-400 hover:underline text-sm block"
                                        >
                                          📊 Source: {src.title}
                                        </a>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trending Ad Topics */}
                    {item.trending_ad_topics?.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                          📢 Trending Ad Topics
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          {item.trending_ad_topics.map(
                            (ad: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-stone-900 p-5 rounded-xl border border-gray-800"
                              >
                                <h3 className="text-lg font-semibold text-white">
                                  {ad.topic}
                                </h3>
                                <p className="text-gray-400">
                                  Growth Rate: {ad.growth_rate}
                                </p>

                                {ad.insights?.map((ins: any, i: number) => (
                                  <div
                                    key={i}
                                    className="bg-stone-800 p-2 rounded-lg mt-2 border-l-4 border-blue-600"
                                  >
                                    <p className="text-gray-200 text-sm">
                                      {ins.text}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {ins.metric.name}: {ins.metric.value}{" "}
                                      {ins.metric.unit}
                                    </p>
                                  </div>
                                ))}

                                {ad.sources?.length > 0 && (
                                  <div className="mt-2">
                                    {ad.sources.map((src: any, j: number) => (
                                      <a
                                        key={j}
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline text-sm block"
                                      >
                                        📊 Source: {src.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* New Product Ideas */}
                    {item.new_product_ideas?.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                          💡 New Product Ideas
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                          {item.new_product_ideas.map(
                            (idea: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-stone-900 p-5 rounded-xl border border-gray-800"
                              >
                                <h3 className="text-lg font-semibold text-white">
                                  {idea.idea}
                                </h3>

                                {idea.insights?.map((ins: any, i: number) => (
                                  <div
                                    key={i}
                                    className="bg-stone-800 p-2 rounded-lg mt-2 border-l-4 border-blue-600"
                                  >
                                    <p className="text-gray-200 text-sm">
                                      {ins.text}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {ins.metric.name}: {ins.metric.value}{" "}
                                      {ins.metric.unit}
                                    </p>
                                  </div>
                                ))}

                                {idea.sources?.length > 0 && (
                                  <div className="mt-2">
                                    {idea.sources.map((src: any, j: number) => (
                                      <a
                                        key={j}
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline text-sm block"
                                      >
                                        📊 Source: {src.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
