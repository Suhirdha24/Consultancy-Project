import React, { useEffect, useState } from "react";
import { adminApiClient } from "../lib/api";
import {
  DollarSign,
  Package,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, alertRes, orderRes] = await Promise.all([
        adminApiClient.get("/analytics/sales-summary"),
        adminApiClient.get("/inventory/alerts?status=ACTIVE"),
        adminApiClient.get("/orders?limit=5"),
      ]);

      setSummary(sumRes.data);
      setAlerts(alertRes.data.alerts || []);
      setRecentOrders(orderRes.data.orders || orderRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Executive Overview</h1>
          <p className="text-slate-500 text-sm">Real-time inventory, sales, and stock health monitoring.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 shadow-md transition"
          >
            <Plus className="w-4 h-4" /> Manage Products
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{(summary?.totalRevenue || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-emerald-600 flex items-center font-medium gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% from last month
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{summary?.totalOrders || 0}</div>
          <p className="text-xs text-slate-500 font-medium">Completed & active orders</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Stock Alerts
            </span>
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{alerts.length}</div>
          <p className="text-xs text-amber-700 font-medium">Requires supplier reorder</p>
        </div>

        {/* Total Products */}
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Product SKU Count
            </span>
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{summary?.totalProducts || 0}</div>
          <p className="text-xs text-purple-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High catalog availability
          </p>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Alerts Widget */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Critical Stock Warnings
            </h3>
            <Link to="/admin/alerts" className="text-xs font-semibold text-emerald-600 hover:underline">
              View All ({alerts.length})
            </Link>
          </div>

          {alerts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              All inventory levels are healthy! No active stock alerts.
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 4).map((alt) => (
                <div
                  key={alt._id}
                  className="flex items-center justify-between p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{alt.product?.name || "Product"}</h4>
                    <span className="text-xs text-amber-700 font-medium">
                      Current Stock: <strong>{alt.currentStock}</strong> (Min: {alt.minThreshold})
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-200 text-amber-900 font-bold text-xs rounded-full">
                    {alt.alertType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Widget */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" /> Recent Customer Orders
            </h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-emerald-600 hover:underline">
              Manage Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">No orders recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {recentOrders.slice(0, 4).map((ord) => (
                <div
                  key={ord._id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-800">
                      #{ord.orderId || ord._id.substring(0, 8)}
                    </span>
                    <p className="text-xs text-slate-500">{ord.customerName || "Customer"}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-600">
                      ₹{(ord.totalAmount || 0).toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      {ord.orderStatus || "PENDING"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
