"use client";

export default function InsightCard({ insight }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl flex justify-between items-center">
      <p className="text-sm">{insight.text}</p>
      <span className="text-blue-400 text-sm font-medium">
        {insight.metric.name}: {insight.metric.value}
        {insight.metric.unit || ""}
      </span>
    </div>
  );
}
