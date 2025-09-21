"use client";

import React, { useEffect, useState } from "react";

import {
  MessageCircle,
  TrendingUp,
  Share2,
  Target,
  Users,
  BarChart3,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Star,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const ArtisanMarketplaceWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Share2,
      title: "Smart Social Media Posts",
      description:
        "AI creates engaging posts with trending hashtags, regional content, and optimal timing for maximum reach.",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      title: "Bulk Conversation Management",
      description:
        "Handle multiple customer conversations with AI-powered responses in native languages.",
      color: "bg-green-500",
    },
    {
      icon: TrendingUp,
      title: "Market Research & Trends",
      description:
        "Real-time trend analysis with actionable insights, charts, and data-driven recommendations.",
      color: "bg-purple-500",
    },
    {
      icon: Target,
      title: "Smart Ad Creation",
      description:
        "Generate high-converting ads with performance predictions and audience targeting.",
      color: "bg-orange-500",
    },
  ];

  const stats = [
    { label: "Local Artisans Helped", value: "2,500+", icon: Users },
    { label: "Posts Created", value: "50,000+", icon: Share2 },
    { label: "Revenue Generated", value: "₹2.5Cr+", icon: TrendingUp },
    { label: "Success Rate", value: "94%", icon: CheckCircle },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      craft: "Handloom Sarees",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b332c1bb?w=100&h=100&fit=crop&crop=face",
      quote:
        "This AI assistant tripled my online sales in just 2 months. The posts it creates are perfect!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      craft: "Pottery & Ceramics",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote:
        "Managing customer conversations has never been easier. It even replies in local languages!",
      rating: 5,
    },
    {
      name: "Meera Patel",
      craft: "Jewelry Design",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      quote:
        "The trend insights helped me create products that customers actually want. Amazing results!",
      rating: 5,
    },
  ];

  const dashboardTabs = [
    { id: "posts", label: "Posts", icon: Share2 },
    { id: "chats", label: "Chats", icon: MessageCircle },
    { id: "products", label: "Products", icon: Target },
    { id: "research", label: "Research", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-stone-900/95 backdrop-blur-md z-50 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CraftAI
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-stone-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#dashboard"
                className="text-stone-300 hover:text-white transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#testimonials"
                className="text-stone-300 hover:text-white transition-colors"
              >
                Reviews
              </a>
              <a
                href="#pricing"
                className="text-stone-300 hover:text-white transition-colors"
              >
                Pricing
              </a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                Get Started
              </button>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-stone-900 border-t border-stone-800">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#features"
                className="block text-stone-300 hover:text-white"
              >
                Features
              </a>
              <a
                href="#dashboard"
                className="block text-stone-300 hover:text-white"
              >
                Dashboard
              </a>
              <a
                href="#testimonials"
                className="block text-stone-300 hover:text-white"
              >
                Reviews
              </a>
              <a
                href="#pricing"
                className="block text-stone-300 hover:text-white"
              >
                Pricing
              </a>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible.hero
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Empower Your Craft
                </span>
                <br />
                <span className="text-white">with AI Intelligence</span>
              </h1>

              <p className="text-xl md:text-2xl text-stone-300 mb-8 max-w-3xl mx-auto">
                Transform your artisan business with AI-powered social media
                management, customer conversations, market research, and
                targeted advertising.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border border-stone-600 px-8 py-4 rounded-full text-lg font-semibold hover:border-stone-500 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`transition-all duration-1000 delay-${
                    index * 200
                  } ${
                    isVisible.hero
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div className="bg-stone-900 p-6 rounded-xl border border-stone-800 hover:border-stone-700 transition-colors">
                    <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-stone-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to{" "}
              <span className="text-blue-400">Grow Your Craft</span>
            </h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto">
              Our AI assistant handles the digital marketing so you can focus on
              what you do best - creating beautiful crafts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`transition-all duration-1000 delay-${index * 100} ${
                  isVisible.features
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="bg-stone-800 p-6 rounded-xl hover:bg-stone-750 transition-colors border border-stone-700 hover:border-stone-600 group">
                  <div
                    className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-stone-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your <span className="text-purple-400">Smart Dashboard</span>
            </h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto">
              Get insights, manage conversations, and track performance all in
              one place.
            </p>
          </div>

          <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
            {/* Dashboard Tabs */}
            <div className="border-b border-stone-800">
              <div className="flex overflow-x-auto">
                {dashboardTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "text-white border-b-2 border-blue-500 bg-stone-800"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {activeTab === "posts" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recent Posts
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-stone-750 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                        <div>
                          <div className="text-white font-medium">
                            Eco-friendly Sarees
                          </div>
                          <div className="text-stone-400 text-sm">
                            Facebook, Instagram • 2.3K views
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-stone-750 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"></div>
                        <div>
                          <div className="text-white font-medium">
                            Handcrafted Pottery
                          </div>
                          <div className="text-stone-400 text-sm">
                            Instagram • 1.8K views
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Performance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-300">Total Reach</span>
                        <span className="text-white font-semibold">25.6K</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-300">Engagement Rate</span>
                        <span className="text-green-400 font-semibold">
                          6.8%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-300">New Followers</span>
                        <span className="text-blue-400 font-semibold">
                          +342
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "chats" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Active Conversations
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-stone-750 rounded-lg">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                          A
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            Asha Patel
                          </div>
                          <div className="text-stone-400 text-sm">
                            Interested in blue sarees...
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-stone-750 rounded-lg">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          R
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            Rajesh Kumar
                          </div>
                          <div className="text-stone-400 text-sm">
                            Asked about pottery classes...
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Response Analytics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-300">
                          Avg Response Time
                        </span>
                        <span className="text-white font-semibold">
                          2.3 min
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-300">
                          Customer Satisfaction
                        </span>
                        <span className="text-green-400 font-semibold">
                          94%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-300">Conversion Rate</span>
                        <span className="text-blue-400 font-semibold">
                          18.5%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "products" && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <div className="w-full h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4"></div>
                    <h3 className="text-white font-semibold">Handloom Saree</h3>
                    <p className="text-stone-400 text-sm mb-2">₹2,500</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-300">Views: 1.2K</span>
                      <span className="text-green-400">+12% ↗</span>
                    </div>
                  </div>
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg mb-4"></div>
                    <h3 className="text-white font-semibold">Clay Pottery</h3>
                    <p className="text-stone-400 text-sm mb-2">₹800</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-300">Views: 956</span>
                      <span className="text-green-400">+8% ↗</span>
                    </div>
                  </div>
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <div className="w-full h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mb-4"></div>
                    <h3 className="text-white font-semibold">Silver Jewelry</h3>
                    <p className="text-stone-400 text-sm mb-2">₹3,200</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-300">Views: 2.1K</span>
                      <span className="text-green-400">+25% ↗</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "research" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Trending Topics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-stone-750 rounded-lg">
                        <span className="text-white">Eco-friendly Fashion</span>
                        <span className="text-green-400 font-semibold">
                          +15%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-stone-750 rounded-lg">
                        <span className="text-white">Handmade Jewelry</span>
                        <span className="text-green-400 font-semibold">
                          +12%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-stone-750 rounded-lg">
                        <span className="text-white">Traditional Crafts</span>
                        <span className="text-green-400 font-semibold">
                          +8%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Market Insights
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-stone-750 rounded-lg">
                        <div className="text-white font-medium mb-2">
                          Best Posting Time
                        </div>
                        <div className="text-stone-300">
                          6-8 PM IST for maximum engagement
                        </div>
                      </div>
                      <div className="p-4 bg-stone-750 rounded-lg">
                        <div className="text-white font-medium mb-2">
                          Popular Hashtags
                        </div>
                        <div className="text-stone-300">
                          #HandmadeInIndia #SustainableFashion
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Loved by{" "}
              <span className="text-green-400">Artisans Everywhere</span>
            </h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto">
              See how CraftAI is transforming businesses across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`transition-all duration-1000 delay-${index * 200} ${
                  isVisible.testimonials
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <div className="bg-stone-800 p-6 rounded-xl border border-stone-700 hover:border-stone-600 transition-colors">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-stone-400 text-sm">
                        {testimonial.craft}
                      </div>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-stone-300 italic">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, <span className="text-blue-400">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-stone-800 p-8 rounded-2xl border border-stone-700 hover:border-stone-600 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <div className="text-3xl font-bold text-blue-400 mb-6">
                  ₹999<span className="text-lg text-stone-400">/month</span>
                </div>
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      10 social media posts
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      Basic chat management
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">Weekly trend reports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">5 products listing</span>
                  </li>
                </ul>
                <button className="w-full bg-stone-700 px-6 py-3 rounded-full hover:bg-stone-600 transition-colors">
                  Get Started
                </button>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-gradient-to-b from-blue-600/20 to-purple-600/20 p-8 rounded-2xl border border-blue-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Professional
                </h3>
                <div className="text-3xl font-bold text-blue-400 mb-6">
                  ₹2,499<span className="text-lg text-stone-400">/month</span>
                </div>
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      50 social media posts
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      Advanced chat management
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">Daily trend insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">25 products listing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      Ad creation & management
                    </span>
                  </li>
                </ul>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-stone-800 p-8 rounded-2xl border border-stone-700 hover:border-stone-600 transition-colors">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Enterprise
                </h3>
                <div className="text-3xl font-bold text-blue-400 mb-6">
                  ₹4,999<span className="text-lg text-stone-400">/month</span>
                </div>
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      Unlimited social media posts
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">Full chat automation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      Real-time trend tracking
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      Unlimited product listings
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-stone-300">
                      Dedicated account manager
                    </span>
                  </li>
                </ul>
                <button className="w-full bg-stone-700 px-6 py-3 rounded-full hover:bg-stone-600 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-stone-400">
            © {new Date().getFullYear()} CraftAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ArtisanMarketplaceWebsite;
