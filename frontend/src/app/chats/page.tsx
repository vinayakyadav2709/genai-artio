import ChatsList from "@/components/ChatList";

export default async function ChatsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/chats`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load chats
      </div>
    );
  }

  const data = await res.json();
  const chats = data.chats || [];

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <ChatsList chats={chats} />
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to view details
      </div>
    </div>
  );
}
