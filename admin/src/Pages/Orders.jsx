import React, { useEffect, useState } from "react";
import { adminApiClient } from "../lib/api";
import { ShoppingBag, Clock, CheckCircle, Truck, AlertCircle, RefreshCw, Eye } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get("/orders");
      setOrders(res.data.orders || res.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await adminApiClient.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderId === orderId)) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-emerald-600" /> Order Fulfillment
          </h1>
          <p className="text-slate-500 text-sm">
            Process customer purchases, change delivery lifecycle states, and review line items.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 shadow-sm transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Orders Placed Yet</h3>
          <p className="text-slate-500 text-sm">Customer checkout orders will show up here automatically.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => {
                  const id = ord._id;
                  const displayId = ord.orderId || id.substring(0, 8);
                  const dateStr = ord.createdAt
                    ? new Date(ord.createdAt).toLocaleDateString("en-IN")
                    : "Recent";

                  return (
                    <tr key={id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-800">#{displayId}</div>
                        <div className="text-[10px] text-slate-400">{dateStr}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {ord.customerName || ord.name || "Customer"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {ord.customerPhone || ord.phone || ord.customerEmail || "N/A"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                        ₹{(ord.totalAmount || 0).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-xs font-semibold">
                        <span className="capitalize">{ord.paymentMethod || "COD"}</span>
                        <span
                          className={`block text-[10px] font-bold ${
                            ord.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {ord.paymentStatus || "PENDING"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.orderStatus || "PENDING"}
                          onChange={(e) => handleUpdateStatus(id, e.target.value)}
                          className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Order #{selectedOrder.orderId || selectedOrder._id}
                </h3>
                <p className="text-xs text-slate-400">
                  Customer: {selectedOrder.customerName || selectedOrder.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <strong className="text-slate-700 block mb-1">Shipping Address:</strong>
                <p className="text-slate-600">{selectedOrder.shippingAddress || selectedOrder.address || "N/A"}</p>
              </div>

              <div>
                <strong className="text-slate-700 block mb-2">Order Line Items:</strong>
                <div className="space-y-2 border rounded-xl p-3 max-h-48 overflow-y-auto">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">
                        {item.product?.name || item.name || "Item"} × {item.quantity}
                      </span>
                      <span className="font-bold text-emerald-600">
                        ₹{((item.price || item.product?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <span className="font-bold text-slate-700">Total Payable:</span>
                <span className="text-lg font-extrabold text-emerald-600">
                  ₹{(selectedOrder.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
