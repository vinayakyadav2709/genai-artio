"use client";

const Hero = () => {
  return (
    <section id="hero" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* ✅ Replace with your Hero content */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Empowering <span className="text-blue-400">Artisans</span> with AI
        </h1>
        <p className="text-xl text-stone-300 mb-8">
          Smart tools to grow your craft business online with ease
        </p>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-full text-lg">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
