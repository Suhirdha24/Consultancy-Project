import React, { useEffect, useState } from "react";
import { adminApiClient } from "../lib/api";
import { AlertTriangle, CheckCircle2, RefreshCw, Plus, Package } from "lucide-react";

const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustModal, setAdjustModal] = useState(null);
  const [newStockVal, setNewStockVal] = useState("");
  const [reasonVal, setReasonVal] = useState("MANUAL_ADJUSTMENT");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get("/inventory/alerts");
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!adjustModal || !newStockVal) return;

    setUpdating(true);
    try {
      const prodId = adjustModal.product._id || adjustModal.product.id;
      await adminApiClient.post("/inventory/adjust-stock", {
        productId: prodId,
        newStock: parseInt(newStockVal),
        type: reasonVal,
        notes: "Stock adjusted from Admin Stock Alerts portal",
      });

      setAdjustModal(null);
      fetchAlerts();
    } catch (err) {
      console.error(err);
      alert("Failed to adjust stock.");
    } finally {
      setUpdating(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await adminApiClient.put(`/inventory/alerts/${alertId}/resolve`);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-500" /> Stock & Expiry Alerts
          </h1>
          <p className="text-slate-500 text-sm">
            Automated alerts when items fall below minimum reorder thresholds or approach expiration.
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 shadow-sm transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-emerald-600">Loading stock alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">All Stock Levels Healthy!</h3>
          <p className="text-slate-500 text-sm">No items currently require inventory reordering.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alt) => {
            const prod = alt.product || {};
            const isResolved = alt.status === "RESOLVED";

            return (
              <div
                key={alt._id}
                className={`p-5 rounded-2xl border transition shadow-sm space-y-4 ${
                  isResolved
                    ? "bg-slate-50 border-slate-200 opacity-60"
                    : "bg-white border-amber-200 hover:border-amber-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">{prod.name || "Product"}</h3>
                    <p className="text-xs text-slate-400 font-mono">SKU: {prod.sku || "N/A"}</p>
                  </div>
                  <span
                    className={`px-3 py-1 font-bold text-xs rounded-full ${
                      alt.alertType === "OUT_OF_STOCK"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {alt.alertType}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-slate-400 block">Current Stock</span>
                    <strong className="text-base text-slate-800">{alt.currentStock}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Min Threshold</span>
                    <strong className="text-base text-slate-800">{alt.minThreshold}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Max Level</span>
                    <strong className="text-base text-slate-800">{alt.maxLevel}</strong>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  {!isResolved && (
                    <button
                      onClick={() => handleResolveAlert(alt._id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border"
                    >
                      Mark Resolved
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setAdjustModal(alt);
                      setNewStockVal(alt.maxLevel || alt.minThreshold * 3 || 50);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Reorder / Restock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              Restock Product: {adjustModal.product?.name}
            </h3>
            <form onSubmit={handleAdjustStock} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  New Quantity in Stock
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Transaction Type
                </label>
                <select
                  value={reasonVal}
                  onChange={(e) => setReasonVal(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="PURCHASE">Supplier Reorder (PURCHASE)</option>
                  <option value="MANUAL_ADJUSTMENT">Manual Stock Count (MANUAL)</option>
                  <option value="RETURN">Customer Return (RETURN)</option>
                  <option value="DAMAGE">Damaged / Expired Stock Removal (DAMAGE)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md"
                >
                  {updating ? "Saving..." : "Update Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAlerts;
