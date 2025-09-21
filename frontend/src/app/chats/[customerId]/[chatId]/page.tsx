import ChatsList from "@/components/ChatList";
import ChatDetails from "@/components/Chatdetails";

export default async function ChatDetailsPage({
  params,
}: {
  params: { customerId: string; chatId: string };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Fetch all chats from API
  const res = await fetch(`${baseUrl}/api/chats`, {
    cache: "no-store", // always fetch fresh data
  });

  if (!res.ok) {
    return (
      <p className="text-red-500 flex items-center justify-center h-screen">
        Failed to load chats
      </p>
    );
  }

  const data = await res.json();
  const chats = data.chats || [];

  // Filter chats for the current customer
  const customerChats = chats.filter(
    (c: any) => c.customer_id === params.customerId
  );

  // Find chat by chatId
  const chat = customerChats.find((c: any) => c.chat_id === params.chatId);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <ChatsList chats={customerChats} selectedChatId={params.chatId} />
      <div className="flex-1 p-6 overflow-y-auto">
        {chat ? <ChatDetails chat={chat} /> : <p>Chat not found</p>}
      </div>
    </div>
  );
}
