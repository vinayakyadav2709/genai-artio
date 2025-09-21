import ChatsList from "@/components/ChatList";

export default async function CustomerChatsPage({
  params,
}: {
  params: { customerId: string };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Fetch chats from API
  const res = await fetch(`${baseUrl}/api/chats`, {
    cache: "no-store",
  });

  if (!res.ok)
    return (
      <p className="text-red-500 flex items-center justify-center h-screen">
        Failed to load chats
      </p>
    );

  const data = await res.json();
  const chats = (data.chats || []).filter(
    (c: any) => c.customer_id === params.customerId
  );

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <ChatsList chats={chats} />
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat from{" "}
        <span className="ml-1 font-semibold">{params.customerId}</span>
      </div>
    </div>
  );
}
