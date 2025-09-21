"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    craft: "Handloom Sarees",
    image:
      "https://unsplash.com/photos/woman-staring-directly-at-camera-near-pink-wall-bqe0J0b26RQ?w=100&h=100&fit=crop&crop=face",
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

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white"
    >
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Loved by <span className="text-green-400">Artisans</span> Everywhere
        </h2>
        <p className="text-xl text-stone-300 max-w-2xl mx-auto">
          Hear what real artisans have to say about CraftAI
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-stone-950 p-6 rounded-2xl border border-stone-900 text-left 
                       hover:scale-105 transition-transform duration-300 shadow-lg 
                       hover:shadow-green-500/20"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-stone-400">{t.craft}</p>
              </div>
            </div>
            <p className="text-stone-300 mb-4">"{t.quote}"</p>
            <div className="flex text-yellow-400">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
