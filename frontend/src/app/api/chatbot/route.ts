// app/api/chatbot/route.ts
import { NextRequest, NextResponse } from "next/server";

interface ChatBotRequest {
  user_id: string;
  message?: string;
  selection?: string;
}

interface Option {
  label: string;
  value: string;
  type: string;
}

interface Metric {
  name: string;
  value: number;
  unit: string;
}

interface Insight {
  text: string;
  metric: Metric;
}

interface ChartData {
  title: string;
  type: "line" | "bar" | "pie";
  data: Array<{
    x: string;
    y: number;
    series?: string;
  }>;
}

interface Source {
  title: string;
  url: string;
}

interface Draft {
  caption?: string;
  headline?: string;
  body_text?: string;
  images?: string[];
  call_to_action?: string;
}

interface Requirements {
  post_type?: string;
  tone?: string;
  keywords?: string[];
  image_style?: string;
  schedule_time?: string;
}

interface Recommendations {
  hashtags?: string[];
  trend_alignment?: string;
}

interface ChatBotResponse {
  assistant_message: string;
  options?: Option[];
  affected_products?: string[];
  requirements?: Requirements;
  insights?: Insight[];
  charts?: ChartData[];
  sources?: Source[];
  draft?: Draft;
  recommendations?: Recommendations;
  performance_prediction?: Insight[];
  state: "collecting_info" | "awaiting_confirmation" | "final_draft";

  // Boolean flags to control UI rendering
  show_options?: boolean;
  show_insights?: boolean;
  show_charts?: boolean;
  show_sources?: boolean;
  show_draft?: boolean;
  show_recommendations?: boolean;
  show_performance?: boolean;
  show_requirements?: boolean;
}

// Mock conversation state (in a real app, this would be stored in a database)
const conversationStates: { [userId: string]: any } = {};

export async function POST(request: NextRequest) {
  try {
    const body: ChatBotRequest = await request.json();
    const { user_id, message, selection } = body;

    // Initialize user state if not exists
    if (!conversationStates[user_id]) {
      conversationStates[user_id] = {
        step: "initial",
        selectedPlatforms: [],
        productType: null,
        tone: null,
        focus: null,
      };
    }

    const userState = conversationStates[user_id];
    const input = message || selection || "";

    // Determine response based on current state and input
    const response = await generateResponse(input, userState);

    // Update user state
    updateUserState(userState, input, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      {
        assistant_message:
          "I'm experiencing some technical difficulties. Please try again.",
        state: "collecting_info",
        show_options: false,
      },
      { status: 500 }
    );
  }
}

async function generateResponse(
  input: string,
  userState: any
): Promise<ChatBotResponse> {
  const lowerInput = input.toLowerCase();

  // Initial greeting or general queries
  if (
    userState.step === "initial" ||
    lowerInput.includes("post") ||
    lowerInput.includes("saree") ||
    lowerInput.includes("product")
  ) {
    userState.step = "platform_selection";
    return {
      assistant_message:
        "Great! I'd love to help you create content for your sarees. Which platforms would you like to post on?",
      options: [
        { label: "📘 Facebook", value: "facebook", type: "platform" },
        { label: "📸 Instagram", value: "instagram", type: "platform" },
        { label: "🐦 Twitter", value: "twitter", type: "platform" },
        { label: "💼 LinkedIn", value: "linkedin", type: "platform" },
        { label: "🎵 TikTok", value: "tiktok", type: "platform" },
      ],
      state: "collecting_info",
      show_options: true,
      show_insights: false,
      show_charts: false,
      show_sources: false,
      show_draft: false,
      show_recommendations: false,
      show_performance: false,
      show_requirements: false,
    };
  }

  // Platform selection
  if (userState.step === "platform_selection") {
    userState.selectedPlatforms.push(input);
    userState.step = "show_insights";

    return {
      assistant_message: `Perfect! I'll create content for ${input}. Let me show you some current market insights for sarees to help optimize your content.`,
      insights: [
        {
          text: "Organic cotton sarees are gaining significant traction in the market",
          metric: { name: "Growth Rate", value: 12, unit: "%" },
        },
        {
          text: "Average market price for handloom sarees",
          metric: { name: "Average Price", value: 2500, unit: "INR" },
        },
        {
          text: "Peak engagement time for saree content",
          metric: { name: "Best Time", value: 7, unit: "PM" },
        },
      ],
      charts: [
        {
          title: "Saree Demand Trends (Last 6 Months)",
          type: "line",
          data: [
            { x: "Apr", y: 1200 },
            { x: "May", y: 1350 },
            { x: "Jun", y: 1600 },
            { x: "Jul", y: 1450 },
            { x: "Aug", y: 1800 },
            { x: "Sep", y: 2100 },
          ],
        },
        {
          title: "Popular Saree Categories",
          type: "bar",
          data: [
            { x: "Silk", y: 45 },
            { x: "Cotton", y: 35 },
            { x: "Georgette", y: 25 },
            { x: "Chiffon", y: 20 },
            { x: "Handloom", y: 40 },
          ],
        },
      ],
      sources: [
        {
          title: "Google Trends - Saree Market Analysis",
          url: "https://trends.google.com/saree-trends",
        },
        {
          title: "Fashion Industry Report 2024",
          url: "https://fashionreport.com/2024",
        },
      ],
      options: [
        {
          label: "✨ Focus on Organic/Eco-friendly",
          value: "organic_focus",
          type: "trend_choice",
        },
        {
          label: "🎨 Highlight Traditional Craftsmanship",
          value: "traditional_focus",
          type: "trend_choice",
        },
        {
          label: "💎 Emphasize Premium Quality",
          value: "premium_focus",
          type: "trend_choice",
        },
        {
          label: "🎉 Festival/Occasion Special",
          value: "festival_focus",
          type: "trend_choice",
        },
      ],
      state: "collecting_info",
      show_options: true,
      show_insights: true,
      show_charts: true,
      show_sources: true,
      show_draft: false,
      show_recommendations: false,
      show_performance: false,
      show_requirements: false,
    };
  }

  // Focus selection
  if (userState.step === "show_insights") {
    userState.focus = input;
    userState.step = "tone_selection";

    return {
      assistant_message: `Excellent choice! ${getFocusMessage(
        input
      )} Now, what tone would you like for your content?`,
      options: [
        { label: "😊 Casual & Friendly", value: "casual", type: "tone" },
        {
          label: "💼 Professional & Elegant",
          value: "professional",
          type: "tone",
        },
        { label: "❤️ Emotional & Heartfelt", value: "emotional", type: "tone" },
        { label: "🎉 Exciting & Energetic", value: "energetic", type: "tone" },
      ],
      state: "collecting_info",
      show_options: true,
      show_insights: false,
      show_charts: false,
      show_sources: false,
      show_draft: false,
      show_recommendations: false,
      show_performance: false,
      show_requirements: false,
    };
  }

  // Tone selection and draft generation
  if (userState.step === "tone_selection") {
    userState.tone = input;
    userState.step = "final_draft";

    const draft = generateDraft(userState);
    const recommendations = generateRecommendations(userState);
    const performance = generatePerformancePrediction(userState);

    return {
      assistant_message:
        "Perfect! Here's your personalized content draft based on your preferences and current market trends:",
      draft,
      recommendations,
      performance_prediction: performance,
      options: [
        { label: "🚀 Publish Now", value: "publish_now", type: "action" },
        { label: "✏️ Edit Caption", value: "edit_caption", type: "action" },
        { label: "🖼️ Change Images", value: "change_images", type: "action" },
        { label: "📅 Schedule Post", value: "schedule_post", type: "action" },
        {
          label: "🔄 Generate New Version",
          value: "regenerate",
          type: "action",
        },
      ],
      state: "final_draft",
      show_options: true,
      show_insights: false,
      show_charts: false,
      show_sources: false,
      show_draft: true,
      show_recommendations: true,
      show_performance: true,
      show_requirements: false,
    };
  }

  // Handle final actions
  if (userState.step === "final_draft") {
    return handleFinalActions(input, userState);
  }

  // Default response
  return {
    assistant_message:
      "I'd love to help you create amazing content for your business! You can ask me to create posts, analyze trends, or generate ads for your products.",
    options: [
      { label: "📝 Create a Post", value: "create_post", type: "action" },
      { label: "📊 Show Market Trends", value: "show_trends", type: "action" },
      { label: "🎯 Generate Ad Campaign", value: "create_ad", type: "action" },
    ],
    state: "collecting_info",
    show_options: true,
    show_insights: false,
    show_charts: false,
    show_sources: false,
    show_draft: false,
    show_recommendations: false,
    show_performance: false,
    show_requirements: false,
  };
}

function getFocusMessage(focus: string): string {
  const messages = {
    organic_focus:
      "Focusing on eco-friendly and sustainable aspects will resonate well with environmentally conscious customers.",
    traditional_focus:
      "Highlighting traditional craftsmanship will appeal to customers who value heritage and authenticity.",
    premium_focus:
      "Emphasizing premium quality will attract customers looking for luxury and exclusivity.",
    festival_focus:
      "Festival-themed content performs exceptionally well during celebration seasons.",
  };
  return messages[focus as keyof typeof messages] || "Great choice!";
}

function generateDraft(userState: any): Draft {
  const focusContent = {
    organic_focus: {
      caption:
        "🌿 Embrace sustainable fashion with our eco-friendly handwoven sarees! Each piece tells a story of traditional craftsmanship while caring for our planet. ✨ #SustainableFashion #EcoFriendlySarees",
      headline: "Eco-Friendly Handloom Sarees - Sustainable Style!",
      body_text:
        "Discover our collection of organic cotton sarees, handwoven by skilled artisans using sustainable practices. Perfect for the environmentally conscious fashionista.",
      call_to_action: "Shop Eco Collection",
    },
    traditional_focus: {
      caption:
        "✨ Celebrate timeless elegance with our authentic handloom sarees. Each thread woven with love, each design rooted in tradition. Experience the beauty of Indian heritage! 🇮🇳 #HandloomLove #TraditionalWear",
      headline: "Authentic Handloom Sarees - Heritage Collection",
      body_text:
        "Immerse yourself in the rich tradition of Indian weaving. Our handloom sarees are crafted by master weavers, preserving centuries-old techniques.",
      call_to_action: "Explore Heritage",
    },
    premium_focus: {
      caption:
        "💎 Indulge in luxury with our premium saree collection. Exquisite craftsmanship meets contemporary elegance. Because you deserve nothing but the finest! ✨ #LuxurySarees #PremiumFashion",
      headline: "Premium Luxury Sarees - Exclusive Collection",
      body_text:
        "Experience unparalleled luxury with our meticulously crafted premium sarees. Each piece is a masterwork of design and quality.",
      call_to_action: "Shop Luxury",
    },
    festival_focus: {
      caption:
        "🎉 Light up every celebration with our stunning festival saree collection! Perfect for Diwali, weddings, and special occasions. Shine bright like the star you are! ⭐ #FestivalWear #CelebrationStyle",
      headline: "Festival Special Sarees - Limited Time Offer!",
      body_text:
        "Make every celebration memorable with our specially curated festival collection. Vibrant colors, rich fabrics, and intricate designs await you.",
      call_to_action: "Shop Festival Collection",
    },
  };

  const content =
    focusContent[userState.focus as keyof typeof focusContent] ||
    focusContent.traditional_focus;

  return {
    ...content,
    images: [
      "https://cdn.ai/posts/saree001.jpg",
      "https://cdn.ai/posts/saree002.jpg",
    ],
  };
}

function generateRecommendations(userState: any): Recommendations {
  const hashtagSets = {
    organic_focus: [
      "#EcoFriendlySarees",
      "#SustainableFashion",
      "#OrganicCotton",
      "#EthicalFashion",
      "#GreenFashion",
    ],
    traditional_focus: [
      "#HandloomSarees",
      "#TraditionalWear",
      "#IndianHeritage",
      "#HandwovenLove",
      "#AuthenticCraft",
    ],
    premium_focus: [
      "#LuxurySarees",
      "#PremiumFashion",
      "#ExclusiveCollection",
      "#HighEndFashion",
      "#LuxuryWear",
    ],
    festival_focus: [
      "#FestivalWear",
      "#CelebrationStyle",
      "#FestivalFashion",
      "#SpecialOccasion",
      "#FestiveWear",
    ],
  };

  const alignments = {
    organic_focus:
      "Aligns with the growing eco-conscious fashion trend, which has seen 15% growth this quarter.",
    traditional_focus:
      "Capitalizes on the heritage fashion revival trend, popular during wedding season.",
    premium_focus:
      "Targets the luxury market segment, which shows consistent high engagement rates.",
    festival_focus:
      "Perfect timing with upcoming festival season, historically our highest sales period.",
  };

  return {
    hashtags:
      hashtagSets[userState.focus as keyof typeof hashtagSets] ||
      hashtagSets.traditional_focus,
    trend_alignment:
      alignments[userState.focus as keyof typeof alignments] ||
      alignments.traditional_focus,
  };
}

function generatePerformancePrediction(userState: any): Insight[] {
  const baseMetrics = {
    facebook: { reach: 15000, engagement: 800, clicks: 120 },
    instagram: { reach: 12000, engagement: 1200, clicks: 200 },
    twitter: { reach: 8000, engagement: 400, clicks: 80 },
    linkedin: { reach: 5000, engagement: 200, clicks: 50 },
    tiktok: { reach: 20000, engagement: 2000, clicks: 300 },
  };

  const platform = userState.selectedPlatforms[0] || "instagram";
  const metrics =
    baseMetrics[platform as keyof typeof baseMetrics] || baseMetrics.instagram;

  // Adjust based on focus and tone
  const focusMultiplier = userState.focus === "festival_focus" ? 1.3 : 1.1;
  const toneMultiplier = userState.tone === "emotional" ? 1.2 : 1.0;

  const adjustedReach = Math.round(
    metrics.reach * focusMultiplier * toneMultiplier
  );
  const adjustedEngagement = Math.round(
    metrics.engagement * focusMultiplier * toneMultiplier
  );
  const adjustedClicks = Math.round(
    metrics.clicks * focusMultiplier * toneMultiplier
  );

  return [
    {
      text: "Estimated organic reach for this post based on your content strategy",
      metric: { name: "Estimated Reach", value: adjustedReach, unit: "users" },
    },
    {
      text: "Predicted engagement rate based on similar content performance",
      metric: {
        name: "Expected Engagement",
        value: adjustedEngagement,
        unit: "interactions",
      },
    },
    {
      text: "Projected click-through rate to your store or website",
      metric: {
        name: "Estimated Clicks",
        value: adjustedClicks,
        unit: "clicks",
      },
    },
  ];
}

function handleFinalActions(action: string, userState: any): ChatBotResponse {
  switch (action) {
    case "publish_now":
      return {
        assistant_message:
          "🎉 Your post has been published successfully! I'm monitoring its performance and will update you with analytics. Would you like to create another post or analyze current trends?",
        options: [
          {
            label: "📊 View Analytics",
            value: "view_analytics",
            type: "action",
          },
          {
            label: "📝 Create Another Post",
            value: "create_new_post",
            type: "action",
          },
          { label: "📈 Show Trends", value: "show_trends", type: "action" },
        ],
        state: "collecting_info",
        show_options: true,
        show_insights: false,
        show_charts: false,
        show_sources: false,
        show_draft: false,
        show_recommendations: false,
        show_performance: false,
        show_requirements: false,
      };

    case "schedule_post":
      return {
        assistant_message:
          "📅 When would you like to schedule this post? Based on your audience insights, I recommend posting during peak engagement hours.",
        options: [
          {
            label: "🌅 Tomorrow 7 AM",
            value: "schedule_7am",
            type: "schedule",
          },
          {
            label: "🌆 Tomorrow 7 PM",
            value: "schedule_7pm",
            type: "schedule",
          },
          {
            label: "📅 This Weekend",
            value: "schedule_weekend",
            type: "schedule",
          },
          {
            label: "🗓️ Custom Time",
            value: "custom_schedule",
            type: "schedule",
          },
        ],
        insights: [
          {
            text: "Your audience is most active during evening hours",
            metric: { name: "Peak Hour", value: 7, unit: "PM" },
          },
          {
            text: "Weekend posts get higher engagement for fashion content",
            metric: { name: "Weekend Boost", value: 25, unit: "%" },
          },
        ],
        state: "awaiting_confirmation",
        show_options: true,
        show_insights: true,
        show_charts: false,
        show_sources: false,
        show_draft: false,
        show_recommendations: false,
        show_performance: false,
        show_requirements: false,
      };

    case "edit_caption":
      userState.step = "tone_selection"; // Go back to regenerate
      return {
        assistant_message:
          "Let's refine your caption! What aspect would you like to adjust?",
        options: [
          { label: "📝 Change Tone", value: "change_tone", type: "edit" },
          { label: "🔑 Add Keywords", value: "add_keywords", type: "edit" },
          { label: "📏 Make it Shorter", value: "make_shorter", type: "edit" },
          { label: "📏 Make it Longer", value: "make_longer", type: "edit" },
        ],
        state: "collecting_info",
        show_options: true,
        show_insights: false,
        show_charts: false,
        show_sources: false,
        show_draft: false,
        show_recommendations: false,
        show_performance: false,
        show_requirements: false,
      };

    case "regenerate":
      userState.step = "tone_selection";
      return {
        assistant_message:
          "Let's create a fresh version! Should I keep the same focus or try a different approach?",
        options: [
          {
            label: "🔄 Same Focus, Different Style",
            value: "same_focus",
            type: "regenerate",
          },
          {
            label: "🎨 Try Different Focus",
            value: "different_focus",
            type: "regenerate",
          },
          {
            label: "🎯 A/B Test Version",
            value: "ab_test",
            type: "regenerate",
          },
        ],
        state: "collecting_info",
        show_options: true,
        show_insights: false,
        show_charts: false,
        show_sources: false,
        show_draft: false,
        show_recommendations: false,
        show_performance: false,
        show_requirements: false,
      };

    default:
      return {
        assistant_message: "I'm here to help! What would you like to do next?",
        options: [
          { label: "📝 Create New Post", value: "create_post", type: "action" },
          {
            label: "📊 View Analytics",
            value: "view_analytics",
            type: "action",
          },
          { label: "📈 Market Trends", value: "show_trends", type: "action" },
        ],
        state: "collecting_info",
        show_options: true,
        show_insights: false,
        show_charts: false,
        show_sources: false,
        show_draft: false,
        show_recommendations: false,
        show_performance: false,
        show_requirements: false,
      };
  }
}

function updateUserState(
  userState: any,
  input: string,
  response: ChatBotResponse
): void {
  // Update user state based on the current step and input
  if (response.state === "final_draft" && input === "publish_now") {
    userState.step = "initial"; // Reset for new conversation
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Chatbot API is running",
    endpoints: {
      POST: "/api/chatbot - Send messages to the chatbot",
    },
  });
}
