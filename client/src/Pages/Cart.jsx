import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle, Download } from "lucide-react";
import { apiClient } from "../lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.username || user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const generateInvoice = (orderData) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Vishal Super Market - Order Invoice", 14, 18);
      doc.setFontSize(10);
      doc.text(`Invoice No: ${orderData.orderId || orderData._id || 'ORD-' + Date.now()}`, 14, 25);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Customer Name: ${name}`, 14, 35);
      doc.text(`Phone: ${phone}`, 14, 40);
      doc.text(`Email: ${email || 'N/A'}`, 14, 45);
      doc.text(`Delivery Address: ${address}`, 14, 50);

      const tableRows = (orderData.items || []).map((item) => [
        item.name || "Grocery Item",
        item.quantity || 1,
        `₹${(item.price || 0).toFixed(2)}`,
        `₹${(item.total || item.price * item.quantity || 0).toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [["Product Name", "Qty", "Unit Price", "Total"]],
        body: tableRows,
        startY: 55,
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Total Payable Amount: Rs. ${subtotal.toFixed(2)}`, 14, finalY);
      doc.setFontSize(10);
      doc.text("Thank you for shopping with Vishal Super Market!", 14, finalY + 10);

      doc.save(`Invoice_${orderData.orderId || 'Order'}.pdf`);
    } catch (e) {
      console.error("Failed to generate PDF invoice:", e);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return;

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please provide a shipping address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const itemsPayload = cartItems.map((item) => {
        const p = item.product;
        const discountedPrice = p.discount
          ? p.price * (1 - p.discount / 100)
          : p.price;
        return {
          productId: p._id || p.id,
          name: p.name,
          quantity: item.quantity,
          price: p.price,
          discount: p.discount || 0,
          total: parseFloat((discountedPrice * item.quantity).toFixed(2)),
        };
      });

      const res = await apiClient.post("/orders/place-order", {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        items: itemsPayload,
        paymentMethod,
      });

      const createdOrder = res.data.order || { orderId: res.data.orderId || "ORD-" + Date.now(), items: itemsPayload };
      setOrderSuccess(createdOrder);
      generateInvoice(createdOrder);
      clearCart();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-4">
        <div className="inline-flex p-4 bg-emerald-100 dark:bg-emerald-800/40 rounded-full text-emerald-600 dark:text-emerald-400 mb-2">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Order Confirmed!</h2>
        <p className="text-slate-600">
          Thank you for shopping with <strong className="text-emerald-700">Vishal Super Market</strong>. Your order ID is{" "}
          <strong className="text-emerald-700 font-mono">
            {orderSuccess.orderId || orderSuccess._id}
          </strong>.
        </p>
        <p className="text-xs text-slate-500">Your PDF invoice has been downloaded automatically.</p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => generateInvoice(orderSuccess)}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-xl border border-slate-300 transition flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Download Invoice PDF
          </button>
          <Link
            to="/products"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition text-sm shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-slate-800">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-emerald-600" /> Shopping Basket
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-800">Your basket is currently empty</h3>
          <p className="text-slate-400 max-w-sm mx-auto text-xs">
            Explore our fresh produce, organic dairy, and daily essentials to fill your basket!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition text-xs"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} Selected
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold underline"
              >
                Clear Cart
              </button>
            </div>

            {cartItems.map(({ product, quantity }) => {
              const id = product._id || product.id;
              const unitPrice = product.discount
                ? product.price * (1 - product.discount / 100)
                : product.price;
              const itemTotal = unitPrice * quantity;

              return (
                <div
                  key={id}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                      <p className="text-xs text-slate-400 capitalize">
                        Category: {product.category || product.productType || "Grocery"}
                      </p>
                      {product.sku && (
                        <p className="text-[10px] text-slate-400 font-mono">SKU: {product.sku}</p>
                      )}
                      <div className="mt-1 text-sm font-bold text-emerald-600">
                        ₹{unitPrice.toFixed(2)}{" "}
                        {product.discount > 0 && (
                          <span className="text-xs line-through text-slate-400 font-normal ml-1">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(id, -1)}
                        className="p-2 text-slate-600 hover:bg-slate-200 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-extrabold text-sm text-slate-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(id, 1)}
                        className="p-2 text-slate-600 hover:bg-slate-200 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="font-extrabold text-slate-900 text-sm">
                        ₹{itemTotal.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary & Checkout Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-emerald-600">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com (optional)"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Shipping Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no, street name, city, pincode..."
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="UPI">UPI / Online Payment</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-xs"
                >
                  {isSubmitting ? "Processing Order..." : `Place Order (₹${subtotal.toFixed(2)})`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
