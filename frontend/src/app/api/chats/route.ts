import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    chats: [
      {
        chat_id: "c001",
        customer_id: "cust_101",
        customer_name: "Asha",
        last_message: "Do you have blue color available?",
        last_message_time: "2025-09-10T14:30:00Z",
        stats: {
          messages_sent: 12,
          messages_received: 15,
          avg_response_time_sec: 135,
        },
        insights: [
          {
            text: "Customer sentiment is positive.",
            metric: {
              name: "Sentiment Score",
              value: 0.75,
              unit: "probability",
            },
          },
          {
            text: "Customer shows high loyalty.",
            metric: { name: "Loyalty Score", value: 0.85, unit: "probability" },
          },
        ],
        graphs: [
          {
            title: "Response Time Trend",
            type: "line",
            data: [
              { x: "2025-09-01", y: 160, series: "response_time_sec" },
              { x: "2025-09-02", y: 120, series: "response_time_sec" },
            ],
          },
          {
            title: "Sentiment Distribution",
            type: "bar",
            data: [
              { x: "positive", y: 10 },
              { x: "neutral", y: 3 },
              { x: "negative", y: 2 },
            ],
          },
        ],
      },

      {
        chat_id: "c005",
        customer_id: "cust_101",
        customer_name: "Asha",
        last_message: "Do you have blue color available?",
        last_message_time: "2025-09-10T14:30:00Z",
        stats: {
          messages_sent: 12,
          messages_received: 15,
          avg_response_time_sec: 135,
        },
        insights: [
          {
            text: "Customer sentiment is positive.",
            metric: {
              name: "Sentiment Score",
              value: 0.75,
              unit: "probability",
            },
          },
          {
            text: "Customer shows high loyalty.",
            metric: { name: "Loyalty Score", value: 0.85, unit: "probability" },
          },
        ],
        graphs: [
          {
            title: "Response Time Trend",
            type: "line",
            data: [
              { x: "2025-09-01", y: 160, series: "response_time_sec" },
              { x: "2025-09-02", y: 120, series: "response_time_sec" },
            ],
          },
          {
            title: "Sentiment Distribution",
            type: "bar",
            data: [
              { x: "positive", y: 10 },
              { x: "neutral", y: 3 },
              { x: "negative", y: 2 },
            ],
          },
        ],
      },
      {
        chat_id: "c002",
        customer_id: "cust_102",
        customer_name: "Ravi",
        last_message: "Can you ship this by tomorrow?",
        last_message_time: "2025-09-11T09:15:00Z",
        stats: {
          messages_sent: 8,
          messages_received: 10,
          avg_response_time_sec: 95,
        },
        insights: [
          {
            text: "Customer is time-sensitive.",
            metric: { name: "Urgency Score", value: 0.9, unit: "probability" },
          },
          {
            text: "Customer prefers fast replies.",
            metric: { name: "Response Expectation", value: 60, unit: "sec" },
          },
        ],
        graphs: [
          {
            title: "Response Time Trend",
            type: "line",
            data: [
              { x: "2025-09-01", y: 110, series: "response_time_sec" },
              { x: "2025-09-02", y: 80, series: "response_time_sec" },
            ],
          },
          {
            title: "Sentiment Distribution",
            type: "bar",
            data: [
              { x: "positive", y: 5 },
              { x: "neutral", y: 4 },
              { x: "negative", y: 1 },
            ],
          },
        ],
      },
      {
        chat_id: "c003",
        customer_id: "cust_103",
        customer_name: "Meera",
        last_message: "I’d like to order two more pieces.",
        last_message_time: "2025-09-11T16:45:00Z",
        stats: {
          messages_sent: 20,
          messages_received: 22,
          avg_response_time_sec: 150,
        },
        insights: [
          {
            text: "Customer likely to repeat purchase.",
            metric: {
              name: "Repeat Purchase Probability",
              value: 0.82,
              unit: "probability",
            },
          },
          {
            text: "High engagement in chats.",
            metric: {
              name: "Engagement Score",
              value: 0.78,
              unit: "probability",
            },
          },
        ],
        graphs: [
          {
            title: "Response Time Trend",
            type: "line",
            data: [
              { x: "2025-09-01", y: 140, series: "response_time_sec" },
              { x: "2025-09-02", y: 160, series: "response_time_sec" },
            ],
          },
          {
            title: "Sentiment Distribution",
            type: "bar",
            data: [
              { x: "positive", y: 15 },
              { x: "neutral", y: 5 },
              { x: "negative", y: 2 },
            ],
          },
        ],
      },
      {
        chat_id: "c004",
        customer_id: "cust_104",
        customer_name: "Karan",
        last_message: "Do you give discounts on bulk orders?",
        last_message_time: "2025-09-12T12:10:00Z",
        stats: {
          messages_sent: 6,
          messages_received: 7,
          avg_response_time_sec: 100,
        },
        insights: [
          {
            text: "Customer is price-sensitive.",
            metric: {
              name: "Price Sensitivity",
              value: 0.88,
              unit: "probability",
            },
          },
          {
            text: "Bulk buyer potential.",
            metric: {
              name: "Bulk Purchase Likelihood",
              value: 0.7,
              unit: "probability",
            },
          },
        ],
        graphs: [
          {
            title: "Response Time Trend",
            type: "line",
            data: [
              { x: "2025-09-01", y: 95, series: "response_time_sec" },
              { x: "2025-09-02", y: 105, series: "response_time_sec" },
            ],
          },
          {
            title: "Sentiment Distribution",
            type: "bar",
            data: [
              { x: "positive", y: 4 },
              { x: "neutral", y: 2 },
              { x: "negative", y: 1 },
            ],
          },
        ],
      },
    ],
  });
}
