"use client";

import React, { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-stone-900/95 backdrop-blur-md z-50 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Artio
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-white text-stone-300">
              Features
            </a>
            <a href="/dashboard" className="hover:text-white text-stone-300">
              Dashboard
            </a>
            <a href="/chatbot" className="hover:text-white text-stone-300">
              ChatBot
            </a>
            <a href="#testimonials" className="hover:text-white text-stone-300">
              Reviews
            </a>

            <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-full hover:scale-105 transition">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
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
              className="block hover:text-white text-stone-300"
            >
              Features
            </a>
            <a
              href="#dashboard"
              className="block hover:text-white text-stone-300"
            >
              Dashboard
            </a>
            <a
              href="#testimonials"
              className="block hover:text-white text-stone-300"
            >
              Reviews
            </a>
            <a
              href="#pricing"
              className="block hover:text-white text-stone-300"
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
  );
};

export default Navbar;
