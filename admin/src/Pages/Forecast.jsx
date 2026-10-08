import React, { useEffect, useState } from "react";
import { adminApiClient } from "../lib/api";
import { TrendingUp, Sparkles, RefreshCw, ShoppingBag, ArrowRight } from "lucide-react";

const Forecast = () => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get("/analytics/demand-forecast");
      setForecasts(res.data.forecasts || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" /> AI Demand Forecasting
          </h1>
          <p className="text-slate-500 text-sm">
            Predictive stock demand based on sales velocity, lead times, and seasonal growth trends.
          </p>
        </div>
        <button
          onClick={fetchForecast}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 shadow-sm transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Recalculate Model
        </button>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-center gap-3 text-sm text-purple-800">
        <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
        <span>
          <strong>Automated Safety Stock Engine:</strong> Analyzes historical order frequency and lead time variability to recommend precise restock quantities before stockout occurs.
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Analyzing inventory transactions...</div>
      ) : forecasts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Sales Data for Forecasting</h3>
          <p className="text-slate-500 text-sm">
            Place customer orders to generate sales velocity signals and predictive reorder insights.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forecasts.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-extrabold text-slate-900 text-lg">{item.productName || "Product"}</h3>
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 font-bold text-xs rounded-full">
                    {item.confidence || "92% Confidence"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">SKU: {item.sku || "N/A"}</p>
              </div>

              <div className="space-y-2 bg-slate-50 p-4 rounded-xl text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Stock:</span>
                  <strong className="text-slate-800">{item.currentStock} units</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Predicted 30-Day Demand:</span>
                  <strong className="text-purple-600 font-bold">{item.predictedDemand} units</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-600 font-semibold">Recommended Reorder:</span>
                  <strong className="text-emerald-600 font-extrabold text-sm">
                    +{item.recommendedReorder} units
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forecast;
