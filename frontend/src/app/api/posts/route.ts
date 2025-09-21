import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    posts: [
      {
        post_id: "post_001",
        product_id: "p001",
        caption: "Eco-friendly handloom sarees 🌿",
        platforms: ["facebook", "instagram"],
        status: "posted",
        scheduled_time: "2025-09-11T09:00:00Z",
        stats: { impressions: 1200, likes: 300, shares: 50, comments: 25 },
        insights: [
          {
            type: "text+metric",
            text: "Engagement rate is healthy.",
            metric: { name: "Engagement Rate", value: 5.8, unit: "%" },
          },
          {
            type: "text+metric",
            text: "Best performing hashtag.",
            metric: { name: "#HandloomLove", value: 150, unit: "uses" },
          },
        ],
        graphs: [
          {
            title: "Engagement Over Time",
            type: "line",
            data: [
              { x: "Sep 1", y: 20 },
              { x: "Sep 2", y: 35 },
              { x: "Sep 3", y: 45 },
              { x: "Sep 4", y: 30 },
              { x: "Sep 5", y: 55 },
              { x: "Sep 6", y: 65 },
            ],
          },
          {
            title: "Platform Split",
            type: "pie",
            data: [
              { x: "Facebook", y: 700 },
              { x: "Instagram", y: 500 },
              { x: "Twitter", y: 500 },
            ],
          },
        ],
      },
      {
        post_id: "post_002",
        product_id: "p002",
        caption: "Handcrafted ceramic mugs ☕",
        platforms: ["instagram", "pinterest"],
        status: "scheduled",
        scheduled_time: "2025-09-12T14:30:00Z",
        stats: { impressions: 800, likes: 120, shares: 20, comments: 10 },
        insights: [
          {
            type: "text+metric",
            text: "High interest from Pinterest audience.",
            metric: { name: "Engagement Rate", value: 4.2, unit: "%" },
          },
          {
            type: "text+metric",
            text: "Top hashtag this week.",
            metric: { name: "#CeramicArt", value: 90, unit: "uses" },
          },
        ],
        graphs: [
          {
            title: "Engagement Over Time",
            type: "line",
            data: [
              { x: "Sep 1", y: 15 },
              { x: "Sep 2", y: 25 },
              { x: "Sep 3", y: 35 },
              { x: "Sep 4", y: 20 },
              { x: "Sep 5", y: 30 },
              { x: "Sep 6", y: 40 },
            ],
          },
          {
            title: "Platform Split",
            type: "pie",
            data: [
              { x: "Instagram", y: 500 },
              { x: "Pinterest", y: 300 },
            ],
          },
        ],
      },
      {
        post_id: "post_003",
        product_id: "p003",
        caption: "Organic skincare set 🌸",
        platforms: ["facebook", "twitter"],
        status: "posted",
        scheduled_time: "2025-09-10T10:00:00Z",
        stats: { impressions: 1500, likes: 400, shares: 70, comments: 40 },
        insights: [
          {
            type: "text+metric",
            text: "Very high engagement rate.",
            metric: { name: "Engagement Rate", value: 6.1, unit: "%" },
          },
          {
            type: "text+metric",
            text: "Most shared product.",
            metric: { name: "#SkincareRoutine", value: 180, unit: "uses" },
          },
        ],
        graphs: [
          {
            title: "Engagement Over Time",
            type: "line",
            data: [
              { x: "Sep 1", y: 25 },
              { x: "Sep 2", y: 40 },
              { x: "Sep 3", y: 50 },
              { x: "Sep 4", y: 35 },
              { x: "Sep 5", y: 60 },
              { x: "Sep 6", y: 70 },
            ],
          },
          {
            title: "Platform Split",
            type: "pie",
            data: [
              { x: "Facebook", y: 900 },
              { x: "Twitter", y: 600 },
            ],
          },
        ],
      },
      {
        post_id: "post_004",
        product_id: "p004",
        caption: "Handwoven cotton scarves 🧣",
        platforms: ["instagram", "facebook"],
        status: "scheduled",
        scheduled_time: "2025-09-13T08:00:00Z",
        stats: { impressions: 600, likes: 150, shares: 15, comments: 5 },
        insights: [
          {
            type: "text+metric",
            text: "Good early engagement.",
            metric: { name: "Engagement Rate", value: 3.8, unit: "%" },
          },
          {
            type: "text+metric",
            text: "Popular color theme.",
            metric: { name: "#ScarfStyle", value: 75, unit: "uses" },
          },
        ],
        graphs: [
          {
            title: "Engagement Over Time",
            type: "line",
            data: [
              { x: "Sep 1", y: 10 },
              { x: "Sep 2", y: 20 },
              { x: "Sep 3", y: 25 },
              { x: "Sep 4", y: 15 },
              { x: "Sep 5", y: 30 },
              { x: "Sep 6", y: 35 },
            ],
          },
          {
            title: "Platform Split",
            type: "pie",
            data: [
              { x: "Instagram", y: 350 },
              { x: "Facebook", y: 250 },
            ],
          },
        ],
      },
      {
        post_id: "post_005",
        product_id: "p005",
        caption: "Artisan leather wallets 👜",
        platforms: ["twitter", "linkedin"],
        status: "posted",
        scheduled_time: "2025-09-09T12:00:00Z",
        stats: { impressions: 1000, likes: 250, shares: 40, comments: 30 },
        insights: [
          {
            type: "text+metric",
            text: "Steady engagement across platforms.",
            metric: { name: "Engagement Rate", value: 4.9, unit: "%" },
          },
          {
            type: "text+metric",
            text: "Most liked hashtag.",
            metric: { name: "#LeatherCraft", value: 120, unit: "uses" },
          },
        ],
        graphs: [
          {
            title: "Engagement Over Time",
            type: "line",
            data: [
              { x: "Sep 1", y: 20 },
              { x: "Sep 2", y: 30 },
              { x: "Sep 3", y: 40 },
              { x: "Sep 4", y: 25 },
              { x: "Sep 5", y: 50 },
              { x: "Sep 6", y: 60 },
            ],
          },
          {
            title: "Platform Split",
            type: "pie",
            data: [
              { x: "Twitter", y: 600 },
              { x: "LinkedIn", y: 400 },
            ],
          },
        ],
      },
    ],
  });
}
