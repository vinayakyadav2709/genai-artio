"use client";
import React from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ChatsList({
  chats,
  selectedChatId,
}: {
  chats: any[];
  selectedChatId?: string | null;
}) {
  return (
    <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="text-blue-400" size={18} />
          Chats
        </h2>
      </div>
      <div className="divide-y divide-gray-800">
        {chats.map((chat) => (
          <Link
            key={chat.chat_id}
            href={`/chats/${chat.customer_id}/${chat.chat_id}`}
            className={`block p-4 hover:bg-gray-800 transition-colors ${
              selectedChatId === chat.chat_id ? "bg-gray-800" : ""
            }`}
          >
            <p className="font-semibold">{chat.customer_name}</p>
            <p className="text-sm text-gray-400 truncate">
              {chat.last_message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(chat.last_message_time).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
