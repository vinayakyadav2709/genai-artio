"use client";

import { ArrowLeft, Eye, MousePointer, ShoppingCart } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export interface ProductDetailsProps {
  product: any;
  onBack?: () => void;
}

// helper: format date as "02 Sep"
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")} ${d.toLocaleString(
    "en-US",
    { month: "short" }
  )}`;
};

const ProductDetails = ({ product, onBack }: ProductDetailsProps) => {
  if (!product) return <p className="text-white">No product data provided.</p>;

  // format graphs data dates
  const formattedGraphs = product.graphs?.map((graph: any) => ({
    ...graph,
    data: graph.data.map((d: any) => ({
      ...d,
      x: formatDate(d.x),
    })),
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Product top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <div>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl border border-gray-800"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-400 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-green-400">
                ₹{product.price.toLocaleString()}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-800 rounded-full text-sm">
                {product.category}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Views", value: product.stats.views, icon: Eye },
                {
                  label: "Clicks",
                  value: product.stats.clicks,
                  icon: MousePointer,
                },
                {
                  label: "Conversions",
                  value: product.stats.conversions,
                  icon: ShoppingCart,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-gray-900 p-4 rounded-2xl border border-gray-800"
                >
                  <Icon className="mb-2 text-blue-400" size={20} />
                  <p className="text-xl font-bold">{value.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights → full width */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 mb-8">
          <h2 className="font-semibold mb-4">Product Insights</h2>
          <div className="space-y-3">
            {product.insights.map((insight: any, idx: number) => (
              <div
                key={idx}
                className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
              >
                <p className="text-sm">{insight.text}</p>
                <span className="text-blue-400 text-sm font-medium">
                  {insight.metric.name}: {insight.metric.value}
                  {insight.metric.unit || ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Graphs → 2 side by side */}
        <div
          className={`grid gap-8 ${
            formattedGraphs?.length > 1
              ? "grid-cols-1 xl:grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          {formattedGraphs?.map((graph: any, idx: number) => (
            <div
              key={idx}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80"
            >
              <h2 className="text-lg font-semibold ">{graph.title}</h2>
              <ResponsiveContainer width="100%" height="100%">
                {graph.type === "line" ? (
                  <LineChart data={graph.data}>
                    <XAxis dataKey="x" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={graph.data}>
                    <XAxis dataKey="x" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                      }}
                    />
                    <Bar dataKey="y" fill="#3B82F6" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
