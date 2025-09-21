import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { message } = body;

  if (message?.toLowerCase().includes("sarees")) {
    return NextResponse.json({
      assistant_message: "Which platforms should I post on?",
      options: [
        { label: "Facebook", value: "facebook", type: "platform" },
        { label: "Instagram", value: "instagram", type: "platform" },
        { label: "Pinterest", value: "pinterest", type: "platform" },
      ],
      affected_products: ["p001"],
      state: "collecting_info",
    });
  }

  return NextResponse.json({
    assistant_message: "Tell me more about your craft 🙂",
    options: [
      { label: "Jewelry", value: "jewelry", type: "category" },
      { label: "Pottery", value: "pottery", type: "category" },
      { label: "Handloom", value: "handloom", type: "category" },
    ],
    state: "collecting_info",
  });
}
