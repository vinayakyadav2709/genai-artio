// // Chat Details Component
// const ChatDetails = ({ chat, onBack }) => (
//   <div className="min-h-screen bg-gray-950 text-white p-6">
//     <button
//       onClick={onBack}
//       className="flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300 transition-colors"
//     >
//       <ArrowLeft size={20} />
//       Back to Chats
//     </button>

//     <div className="max-w-7xl mx-auto">
//       <div className="border-b border-gray-800 pb-6 mb-8">
//         <h1 className="text-3xl font-bold mb-3">
//           Chat with {chat.customer_name}
//         </h1>
//         <p className="text-gray-400 mb-2">💬 {chat.last_message}</p>
//         <p className="text-sm text-gray-500">
//           Last message: {new Date(chat.last_message_time).toLocaleString()}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//         <div className="space-y-8">
//           <div className="grid grid-cols-3 gap-4">
//             {[
//               {
//                 label: "Messages Sent",
//                 value: chat.stats.messages_sent,
//                 icon: MessageCircle,
//               },
//               {
//                 label: "Messages Received",
//                 value: chat.stats.messages_received,
//                 icon: MessageCircle,
//               },
//               {
//                 label: "Avg Response Time",
//                 value: `${chat.stats.avg_response_time_sec}s`,
//                 icon: Clock,
//               },
//             ].map(({ label, value, icon: Icon }) => (
//               <div
//                 key={label}
//                 className="bg-gray-900 p-4 rounded-2xl border border-gray-800"
//               >
//                 <Icon className="mb-2 text-blue-400" size={20} />
//                 <p className="text-xl font-bold">{value}</p>
//                 <p className="text-xs text-gray-400">{label}</p>
//               </div>
//             ))}
//           </div>

//           <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
//             <h2 className="font-semibold mb-4">Customer Insights</h2>
//             <div className="space-y-3">
//               {chat.insights.map((insight, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
//                 >
//                   <p className="text-sm">{insight.text}</p>
//                   <span className="text-blue-400 text-sm font-medium">
//                     {insight.metric.name}: {insight.metric.value}
//                     {insight.metric.unit || ""}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="space-y-8">
//           {chat.graphs.map((graph, idx) => (
//             <div
//               key={idx}
//               className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80"
//             >
//               <h2 className="text-lg font-semibold mb-4">{graph.title}</h2>
//               <ResponsiveContainer width="100%" height="100%">
//                 {graph.type === "line" ? (
//                   <LineChart data={graph.data}>
//                     <XAxis dataKey="x" stroke="#6B7280" />
//                     <YAxis stroke="#6B7280" />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "#1F2937",
//                         border: "1px solid #374151",
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="y"
//                       stroke="#10B981"
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 ) : (
//                   <BarChart data={graph.data}>
//                     <XAxis dataKey="x" stroke="#6B7280" />
//                     <YAxis stroke="#6B7280" />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "#1F2937",
//                         border: "1px solid #374151",
//                       }}
//                     />
//                     <Bar dataKey="y" fill="#3B82F6" />
//                   </BarChart>
//                 )}
//               </ResponsiveContainer>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// );

"use client";
import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Mail, Reply } from "lucide-react";

export default function ChatDetails({ chat }: { chat: any }) {
  if (!chat) return <p className="text-gray-400">No chat selected.</p>;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit" });

  const formattedGraphs = chat.graphs?.map((g: any) => ({
    ...g,
    data: g.data.map((d: any) => ({ ...d, x: formatDate(d.x) })),
  }));

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold mb-2">{chat.customer_name}</h1>
        <p className="text-gray-400 mb-4">Chat ID: {chat.chat_id}</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Sent", value: chat.stats.messages_sent, icon: Mail },
            {
              label: "Received",
              value: chat.stats.messages_received,
              icon: Reply,
            },
            {
              label: "Avg. Response (s)",
              value: chat.stats.avg_response_time_sec,
              icon: Clock,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-gray-800 p-4 rounded-xl flex flex-col items-center"
            >
              <Icon className="text-blue-400 mb-2" size={20} />
              <p className="font-bold text-lg">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <h2 className="font-semibold mb-4">Chat Insights</h2>
        <div className="space-y-3">
          {chat.insights.map((ins: any, i: number) => (
            <div
              key={i}
              className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
            >
              <p className="text-sm">{ins.text}</p>
              <span className="text-blue-400 text-sm font-medium">
                {ins.metric.name}: {ins.metric.value}
                {ins.metric.unit || ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {formattedGraphs?.map((graph: any, idx: number) => (
          <div
            key={idx}
            className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80"
          >
            <h2 className="text-lg font-semibold mb-4">{graph.title}</h2>
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
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <BarChart data={graph.data}>
                  <XAxis dataKey="x" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                    }}
                  />
                  <Bar dataKey="y" fill="#3B82F6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
