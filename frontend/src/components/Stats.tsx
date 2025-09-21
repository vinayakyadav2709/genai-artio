"use client";

import { Users, Share2, TrendingUp, CheckCircle } from "lucide-react";

const stats = [
  { label: "Local Artisans Helped", value: "2,500+", icon: Users },
  { label: "Posts Created", value: "50,000+", icon: Share2 },
  { label: "Revenue Generated", value: "₹2.5Cr+", icon: TrendingUp },
  { label: "Success Rate", value: "94%", icon: CheckCircle },
];

const Stats = () => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-12">
      {stats.map((stat, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <stat.icon className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="text-stone-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
