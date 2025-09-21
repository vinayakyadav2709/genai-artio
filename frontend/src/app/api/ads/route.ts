import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ads: [
      {
        ad_id: "ad001",
        product_id: "p001",
        headline: "Authentic Handloom Sarees",
        platforms: ["facebook_ads", "instagram_ads"],
        budget: 5000,
        duration_days: 7,
        status: "running",
        stats: {
          impressions: 15000,
          clicks: 1200,
          conversions: 90,
          spent: 3500,
        },
        insights: [
          {
            text: "Ad has a high click-through rate.",
            metric: { name: "CTR", value: 8, unit: "%" },
          },
          {
            text: "Strong return on ad spend.",
            metric: { name: "ROAS", value: 3.2, unit: "x" },
          },
        ],
        graphs: [
          {
            title: "Spend vs Performance",
            type: "line",
            data: [
              { x: "2025-09-01", y: 500, series: "spend" },
              { x: "2025-09-01", y: 80, series: "clicks" },
              { x: "2025-09-01", y: 6, series: "conversions" },
              { x: "2025-09-02", y: 600, series: "spend" },
              { x: "2025-09-02", y: 120, series: "clicks" },
              { x: "2025-09-02", y: 10, series: "conversions" },
            ],
          },
          {
            title: "Audience Demographics",
            type: "bar",
            data: [
              { x: "18-25", y: 300 },
              { x: "26-35", y: 500 },
              { x: "36-45", y: 400 },
            ],
          },
        ],
      },
      {
        ad_id: "ad002",
        product_id: "p002",
        headline: "Eco-Friendly Handmade Bags",
        platforms: ["instagram_ads", "google_ads"],
        budget: 3000,
        duration_days: 10,
        status: "paused",
        stats: {
          impressions: 20000,
          clicks: 1800,
          conversions: 120,
          spent: 2800,
        },
        insights: [
          {
            text: "High engagement from younger audience.",
            metric: { name: "CTR", value: 9, unit: "%" },
          },
          {
            text: "Cost per conversion is low.",
            metric: { name: "CPC", value: 23.3, unit: "₹" },
          },
        ],
        graphs: [
          {
            title: "Spend vs Performance",
            type: "line",
            data: [
              { x: "2025-09-01", y: 400, series: "spend" },
              { x: "2025-09-01", y: 100, series: "clicks" },
              { x: "2025-09-01", y: 8, series: "conversions" },
              { x: "2025-09-02", y: 500, series: "spend" },
              { x: "2025-09-02", y: 150, series: "clicks" },
              { x: "2025-09-02", y: 12, series: "conversions" },
            ],
          },
          {
            title: "Audience Demographics",
            type: "bar",
            data: [
              { x: "18-25", y: 250 },
              { x: "26-35", y: 400 },
              { x: "36-45", y: 350 },
            ],
          },
        ],
      },
      {
        ad_id: "ad003",
        product_id: "p003",
        headline: "Luxury Silk Scarves Collection",
        platforms: ["facebook_ads", "pinterest_ads"],
        budget: 7000,
        duration_days: 14,
        status: "running",
        stats: {
          impressions: 30000,
          clicks: 2500,
          conversions: 200,
          spent: 6200,
        },
        insights: [
          {
            text: "Premium product resonates well with audience.",
            metric: { name: "CTR", value: 8.3, unit: "%" },
          },
          {
            text: "Strong sales conversion during weekends.",
            metric: { name: "ROAS", value: 4.5, unit: "x" },
          },
        ],
        graphs: [
          {
            title: "Spend vs Performance",
            type: "line",
            data: [
              { x: "2025-09-01", y: 700, series: "spend" },
              { x: "2025-09-01", y: 200, series: "clicks" },
              { x: "2025-09-01", y: 15, series: "conversions" },
              { x: "2025-09-02", y: 800, series: "spend" },
              { x: "2025-09-02", y: 250, series: "clicks" },
              { x: "2025-09-02", y: 18, series: "conversions" },
            ],
          },
          {
            title: "Audience Demographics",
            type: "bar",
            data: [
              { x: "18-25", y: 400 },
              { x: "26-35", y: 600 },
              { x: "36-45", y: 450 },
            ],
          },
        ],
      },
    ],
  });
}
