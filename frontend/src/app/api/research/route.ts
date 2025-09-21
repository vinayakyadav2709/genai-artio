import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    research: {
      social_trends: [
        {
          topic: "Eco-friendly Fashion",
          growth_rate: "15%",
          sources: [
            { title: "Google Trends", url: "https://trends.google.com/..." },
          ],
        },
        {
          topic: "Minimalist Jewelry",
          growth_rate: "10%",
          sources: [
            {
              title: "Local Market Report",
              url: "https://market.ai/jewel2025",
            },
          ],
        },
      ],
    },
  });
}
