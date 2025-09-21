import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Dashboard from "@/components/Dashboard";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import ChatUI from "@/components/ChatUI";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <Navbar />
      <Hero />

      <Features />
      <Dashboard />

      <Testimonials />

      <Footer />
    </div>
  );
}
