"use client";

import React, { useState } from "react";

type AssistantOption = {
  label: string;
  value: string;
  type: string;
};

type AssistantDraft = {
  caption?: string;
  headline?: string;
  body_text?: string;
  images?: string[];
  call_to_action?: string;
};

type AssistantResponse = {
  assistant_message: string;
  options?: AssistantOption[];
  affected_products?: string[];
  requirements?: Record<string, string | string[]>;
  insights?: {
    text: string;
    metric?: { name: string; value: number; unit: string };
  }[];
  charts?: { title: string; type: string; data: any[] }[];
  sources?: { title: string; url: string }[];
  draft?: AssistantDraft;
  recommendations?: { hashtags?: string[]; trend_alignment?: string };
  performance_prediction?: {
    text: string;
    metric: { name: string; value: number; unit: string };
  }[];
  state: string;
};

const dummyData: AssistantResponse[] = [
  {
    assistant_message: "Which platforms should I post on?",
    options: [
      { label: "Facebook", value: "facebook", type: "platform" },
      { label: "Instagram", value: "instagram", type: "platform" },
    ],
    affected_products: ["p001"],
    state: "collecting_info",
  },
  {
    assistant_message:
      "Trending insight: Organic Cotton Sarees are up 12% this month.",
    insights: [
      {
        text: "Organic cotton sarees are gaining traction.",
        metric: { name: "Growth Rate", value: 12, unit: "%" },
      },
    ],
    charts: [
      {
        title: "Demand Over Time",
        type: "line",
        data: [
          { x: "2025-05", y: 1200, series: "mentions" },
          { x: "2025-06", y: 1350, series: "mentions" },
        ],
      },
    ],
    sources: [{ title: "Google Trends", url: "https://trends.google.com/" }],
    state: "collecting_info",
  },
  {
    assistant_message: "Here’s your draft post 👇",
    draft: {
      caption: "🌿 Celebrate tradition with eco-friendly handwoven sarees!",
      images: ["https://cdn.ai/posts/sp001.png"],
    },
    recommendations: { hashtags: ["#HandloomLove", "#EcoFriendly"] },
    options: [
      { label: "Post Now", value: "post_now", type: "action" },
      { label: "Edit Caption", value: "edit_caption", type: "action" },
    ],
    affected_products: ["p001"],
    state: "final_draft",
  },
];

const ChatUI = () => {
  const [messages] = useState<AssistantResponse[]>(dummyData);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-stone-900 rounded-2xl p-6 border border-stone-700">
        <h2 className="text-2xl font-bold text-white mb-6">Assistant Chat</h2>

        {messages.map((msg, idx) => (
          <div key={idx} className="mb-8">
            {/* Assistant Message */}
            <div className="bg-stone-800 text-white p-4 rounded-lg mb-3">
              {msg.assistant_message}
            </div>

            {/* Insights */}
            {msg.insights && (
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">Insights</h3>
                {msg.insights.map((ins, i) => (
                  <div key={i} className="text-stone-300 mb-1">
                    {ins.text}{" "}
                    {ins.metric && (
                      <span className="text-blue-400 ml-2">
                        ({ins.metric.name}: {ins.metric.value}
                        {ins.metric.unit})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Draft */}
            {msg.draft && (
              <div className="bg-stone-800 p-4 rounded-lg mb-4">
                {msg.draft.caption && (
                  <p className="text-stone-200 mb-2">{msg.draft.caption}</p>
                )}
                {msg.draft.headline && (
                  <h4 className="text-lg text-white mb-2">
                    {msg.draft.headline}
                  </h4>
                )}
                {msg.draft.body_text && (
                  <p className="text-stone-300 mb-2">{msg.draft.body_text}</p>
                )}
                {msg.draft.images && (
                  <div className="flex gap-2">
                    {msg.draft.images.map((img, j) => (
                      <img
                        key={j}
                        src={img}
                        alt="draft"
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {msg.recommendations && msg.recommendations.hashtags && (
              <div className="text-stone-400 text-sm mb-4">
                Recommended Hashtags:{" "}
                <span className="text-green-400">
                  {msg.recommendations.hashtags.join(", ")}
                </span>
              </div>
            )}

            {/* Options */}
            {msg.options && (
              <div className="flex gap-2 flex-wrap">
                {msg.options.map((opt, i) => (
                  <button
                    key={i}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChatUI;
