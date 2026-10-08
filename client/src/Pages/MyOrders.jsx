import React, { useEffect, useState } from "react";
import { apiClient } from "../lib/api";
import { Package, Clock, CheckCircle, Truck, AlertCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/orders");
      setOrders(res.data.orders || res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load order history. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
            <Truck className="w-3.5 h-3.5" /> Out for Delivery
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-semibold rounded-full">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
            <Clock className="w-3.5 h-3.5" /> {status || "PENDING"}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-emerald-600" /> My Orders
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-emerald-600">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-center">
          <p>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No orders placed yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Once you make your first grocery purchase, track its live status and invoice right here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderId = order.orderId || order._id;
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recent";

            return (
              <div
                key={orderId}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b dark:border-slate-700 gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        Order #{orderId}
                      </span>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <span className="text-xs text-gray-400">Placed on {dateStr}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">Total Amount</span>
                    <span className="text-lg font-extrabold text-emerald-600">
                      ₹{(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-3">
                  {(order.items || []).map((item, idx) => {
                    const prodName = item.product?.name || item.name || "Grocery Item";
                    const price = item.price || item.product?.price || 0;
                    return (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {prodName} × {item.quantity}
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          ₹{(price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t dark:border-slate-700/60 flex justify-between items-center text-xs text-gray-500">
                  <span>
                    Payment: <strong>{order.paymentMethod || "COD"}</strong> ({order.paymentStatus || "PENDING"})
                  </span>
                  <span>Address: {order.shippingAddress || "Provided during checkout"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
