"use client";

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Simple, <span className="text-blue-400">Transparent Pricing</span>
        </h2>
        <p className="text-xl text-stone-300 max-w-2xl mx-auto mb-12">
          Choose the plan that fits your business needs
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-stone-800 p-8 rounded-2xl border border-stone-700">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-3xl font-bold text-blue-400 mb-6">
              ₹999<span className="text-lg text-stone-400">/mo</span>
            </p>
            <ul className="text-stone-300 space-y-3 mb-6">
              <li>✓ 50 AI Posts</li>
              <li>✓ Basic Chat Support</li>
              <li>✓ Community Access</li>
            </ul>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-full">
              Choose Starter
            </button>
          </div>

          {/* Pro */}
          <div className="bg-stone-800 p-8 rounded-2xl border-2 border-blue-500">
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-3xl font-bold text-purple-400 mb-6">
              ₹2,499<span className="text-lg text-stone-400">/mo</span>
            </p>
            <ul className="text-stone-300 space-y-3 mb-6">
              <li>✓ 200 AI Posts</li>
              <li>✓ Advanced Chat Support</li>
              <li>✓ Trend Analysis</li>
              <li>✓ Premium Community</li>
            </ul>
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-full">
              Choose Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-stone-800 p-8 rounded-2xl border border-stone-700">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-3xl font-bold text-green-400 mb-6">
              Custom<span className="text-lg text-stone-400">/mo</span>
            </p>
            <ul className="text-stone-300 space-y-3 mb-6">
              <li>✓ Unlimited AI Posts</li>
              <li>✓ Dedicated AI Assistant</li>
              <li>✓ Custom Solutions</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 px-6 py-2 rounded-full">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
