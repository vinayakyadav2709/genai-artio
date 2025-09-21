"use client";

import { Share2, MessageCircle, TrendingUp, Target } from "lucide-react";

const features = [
  {
    icon: Share2,
    title: "Smart Social Media Posts",
    description:
      "AI creates engaging posts with trending hashtags, regional content, and optimal timing for maximum reach.",
    color: "bg-blue-500",
    border: "border-blue-500",
  },
  {
    icon: MessageCircle,
    title: "Bulk Conversation Management",
    description:
      "Handle multiple customer conversations with AI-powered responses in native languages.",
    color: "bg-green-500",
    border: "border-green-500",
  },
  {
    icon: TrendingUp,
    title: "Market Research & Trends",
    description:
      "Real-time trend analysis with actionable insights, charts, and data-driven recommendations.",
    color: "bg-purple-500",
    border: "border-purple-500",
  },
  {
    icon: Target,
    title: "Smart Ad Creation",
    description:
      "Generate high-converting ads with performance predictions and audience targeting.",
    color: "bg-orange-500",
    border: "border-orange-500",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-900 
                 border-y-3 border-stone-900 
                 "
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Powerful <span className="text-blue-400">AI Tools</span> for Artisans
        </h2>
        <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-12">
          Everything you need to grow your business online, in one place
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div
              key={idx}
              className={`bg-stone-900 rounded-2xl p-6 border-2 ${f.border} 
                          hover:scale-105 hover:bg-stone-800/70 
                          transition-all duration-300 
                          shadow-lg hover:shadow-xl`}
            >
              <div
                className={`${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
              >
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-stone-300">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
