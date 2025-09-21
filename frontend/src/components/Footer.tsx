"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-stone-900 border-t border-stone-800 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-stone-400">
          © {new Date().getFullYear()} CraftAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
