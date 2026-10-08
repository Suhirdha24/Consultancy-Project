import React, { useState } from "react";
import { adminApiClient } from "../lib/api";
import { Scan, Search, CheckCircle2, AlertCircle, Package, RefreshCw } from "lucide-react";

const BarcodeScanner = () => {
  const [barcodeQuery, setBarcodeQuery] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [scanHistory, setScanHistory] = useState([]);

  const handleLookup = async (codeToLookup) => {
    const code = codeToLookup || barcodeQuery;
    if (!code.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setProduct(null);

    try {
      const res = await adminApiClient.get(`/products/barcode/${code.trim()}`);
      if (res.data.product) {
        setProduct(res.data.product);
        setScanHistory((prev) => [
          { code, name: res.data.product.name, time: new Date().toLocaleTimeString() },
          ...prev.slice(0, 4),
        ]);
      } else {
        setErrorMsg(`No product found registered under barcode/SKU: ${code}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || `No product found for code: ${code}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickScan = (code) => {
    setBarcodeQuery(code);
    handleLookup(code);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Scan className="w-8 h-8 text-emerald-600" /> Barcode & SKU Lookup Tool
        </h1>
        <p className="text-slate-500 text-sm">
          Simulate point-of-sale barcode scans for instant price verification and live stock counts.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Scan className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter or scan Barcode / SKU (e.g. 890103000001, APP-001)..."
              value={barcodeQuery}
              onChange={(e) => setBarcodeQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Scan Code
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
          <span className="font-semibold">Quick Sample Codes:</span>
          {["APP-001", "MILK-002", "BREAD-003", "RICE-004"].map((sample) => (
            <button
              key={sample}
              onClick={() => handleQuickScan(sample)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono rounded-lg transition"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {product && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-md space-y-6">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
            <div className="flex items-center gap-4">
              <img
                src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-xl border"
              />
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{product.name}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  SKU: {product.sku} • Barcode: {product.barcode || "N/A"}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Code Matched
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block">Retail Price</span>
              <strong className="text-lg text-emerald-600">₹{product.price?.toFixed(2)}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block">Cost Price</span>
              <strong className="text-lg text-slate-700">₹{(product.costPrice || 0).toFixed(2)}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block">Stock Available</span>
              <strong
                className={`text-lg ${
                  product.stock <= (product.minStock || 10) ? "text-amber-600" : "text-slate-800"
                }`}
              >
                {product.stock} {product.unit || "units"}
              </strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block">Expiry Date</span>
              <strong className="text-sm text-slate-800">
                {product.expiryDate
                  ? new Date(product.expiryDate).toLocaleDateString("en-IN")
                  : "N/A"}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Recent Scans */}
      {scanHistory.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-700">Scan Session Log</h4>
          <div className="space-y-2">
            {scanHistory.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg">
                <span className="font-mono font-bold text-slate-800">{item.code}</span>
                <span className="text-slate-600">{item.name}</span>
                <span className="text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
