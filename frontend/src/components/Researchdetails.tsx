import { TrendingUp } from "lucide-react";


const ResearchDetails = ({ research, onBack }) => (
  <div className="min-h-screen bg-gray-950 text-white p-6">
    <button
      onClick={onBack}
      className="flex items-center gap-2 mb-6 text-blue-400 hover:text-blue-300 transition-colors"
    >
      <ArrowLeft size={20} />
      Back to Research
    </button>

    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold mb-3">{research.topic}</h1>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-green-400">
            {research.growth_rate}
          </span>
          <span className="text-gray-400">growth rate</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-400" size={18} />
              Research Insights
            </h2>
            <div className="space-y-3">
              {research.insights.map((insight, idx) => (
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

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
            <h2 className="font-semibold mb-4">Sources</h2>
            <div className="space-y-2">
              {research.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 hover:underline"
                >
                  📊 {source.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {research.charts.map((chart, idx) => (
            <div
              key={idx}
              className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-80"
            >
              <h2 className="text-lg font-semibold mb-4">{chart.title}</h2>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart.data}>
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
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);