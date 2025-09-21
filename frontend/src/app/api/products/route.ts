import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    products: [
      {
        product_id: "p001",
        name: "Handloom Cotton Saree",
        description: "Eco-friendly, handcrafted cotton saree.",
        price: 2500,
        category: "Traditional Wear",
        images: [
          "https://www.vastranand.in/cdn/shop/files/1_68502a91-0be7-4d4a-9b61-c32b60b10708.jpg?v=1743078757&width=1000",
        ],
        stats: {
          views: 1500,
          clicks: 200,
          conversions: 25,
        },
        insights: [
          {
            text: "Strong conversion rate.",
            metric: { name: "Conversion Rate", value: 12.5, unit: "%" },
          },
          {
            text: "Instagram is top referrer.",
            metric: { name: "Referrals", value: 65, unit: "% from Instagram" },
          },
          {
            text: "Instagram is top referrer.",
            metric: { name: "Referrals", value: 65, unit: "% from Instagram" },
          },
          {
            text: "Instagram is top referrer.",
            metric: { name: "Referrals", value: 65, unit: "% from Instagram" },
          },
          {
            text: "Instagram is top referrer.",
            metric: { name: "Referrals", value: 65, unit: "% from Instagram" },
          },
        ],
        graphs: [
          {
            title: "Product Views Over Time",
            type: "line",
            data: [
              { x: "2025-09-01", y: 200, series: "views" },
              { x: "2025-09-02", y: 300, series: "views" },
            ],
          },
          {
            title: "Conversion Funnel",
            type: "funnel",
            data: [
              { x: "views", y: 1500 },
              { x: "clicks", y: 200 },
              { x: "conversions", y: 25 },
            ],
          },
        ],
      },
      {
        product_id: "p002",
        name: "Terracotta Jewelry Set",
        description: "Handmade terracotta jewelry, eco-friendly and stylish.",
        price: 1200,
        category: "Jewelry",
        images: ["https://cdn.ai/products/terracotta_jewelry.png"],
        stats: {
          views: 800,
          clicks: 150,
          conversions: 40,
        },
        insights: [
          {
            text: "High engagement among young buyers.",
            metric: { name: "Engagement Rate", value: 18.7, unit: "%" },
          },
          {
            text: "Facebook driving more clicks.",
            metric: { name: "Referrals", value: 58, unit: "% from Facebook" },
          },
        ],
        graphs: [
          {
            title: "Clicks Over Time",
            type: "line",
            data: [
              { x: "2025-09-01", y: 30, series: "clicks" },
              { x: "2025-09-02", y: 50, series: "clicks" },
              { x: "2025-09-03", y: 70, series: "clicks" },
            ],
          },
          {
            title: "Demographics",
            type: "bar",
            data: [
              { x: "18-25", y: 300 },
              { x: "26-35", y: 350 },
              { x: "36-45", y: 150 },
            ],
          },
        ],
      },
      {
        product_id: "p003",
        name: "Bamboo Craft Lamp",
        description: "Eco-friendly bamboo lamp perfect for home decor.",
        price: 1800,
        category: "Home Decor",
        images: ["https://cdn.ai/products/bamboo_lamp.png"],
        stats: {
          views: 2100,
          clicks: 400,
          conversions: 55,
        },
        insights: [
          {
            text: "Excellent click-to-conversion ratio.",
            metric: { name: "Conversion Rate", value: 13.7, unit: "%" },
          },
          {
            text: "Pinterest traffic is growing.",
            metric: { name: "Referrals", value: 40, unit: "% from Pinterest" },
          },
        ],
        graphs: [
          {
            title: "Conversion Trend",
            type: "line",
            data: [
              { x: "2025-09-01", y: 10, series: "conversions" },
              { x: "2025-09-02", y: 20, series: "conversions" },
              { x: "2025-09-03", y: 25, series: "conversions" },
            ],
          },
          {
            title: "Source Distribution",
            type: "bar",
            data: [
              { x: "Instagram", y: 700 },
              { x: "Pinterest", y: 850 },
              { x: "Facebook", y: 550 },
            ],
          },
        ],
      },
      {
        product_id: "p004",
        name: "Madhubani Painting",
        description: "Traditional hand-painted Madhubani art on canvas.",
        price: 4500,
        category: "Art",
        images: ["https://cdn.ai/products/madhubani.png"],
        stats: {
          views: 3200,
          clicks: 600,
          conversions: 70,
        },
        insights: [
          {
            text: "Premium buyers showing strong interest.",
            metric: { name: "Average Order Value", value: 5200, unit: "INR" },
          },
          {
            text: "High CTR from email campaigns.",
            metric: { name: "CTR", value: 10.2, unit: "%" },
          },
        ],
        graphs: [
          {
            title: "Views & Clicks Over Time",
            type: "line",
            data: [
              { x: "2025-09-01", y: 500, series: "views" },
              { x: "2025-09-01", y: 100, series: "clicks" },
              { x: "2025-09-02", y: 700, series: "views" },
              { x: "2025-09-02", y: 120, series: "clicks" },
              { x: "2025-09-03", y: 800, series: "views" },
              { x: "2025-09-03", y: 150, series: "clicks" },
            ],
          },
          {
            title: "Conversion Funnel",
            type: "funnel",
            data: [
              { x: "views", y: 3200 },
              { x: "clicks", y: 600 },
              { x: "conversions", y: 70 },
            ],
          },
        ],
      },
    ],
  });
}
