import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle } from "lucide-react";
import { apiClient } from "../lib/api";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cartItems.length) return;
    if (!shippingAddress.trim()) {
      setErrorMsg("Please provide a shipping address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const itemsPayload = cartItems.map((item) => ({
        product: item.product._id || item.product.id,
        quantity: item.quantity,
        price: item.product.discount
          ? item.product.price * (1 - item.product.discount / 100)
          : item.product.price,
      }));

      const res = await apiClient.post("/orders/place-order", {
        items: itemsPayload,
        shippingAddress,
        paymentMethod,
        customerName: user?.name || "Guest",
        customerEmail: user?.email || "guest@example.com",
      });

      setOrderSuccess(res.data.order || { orderId: res.data.orderId || "ORD-SUCCESS" });
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
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Order Confirmed!</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Thank you for shopping with FreshGrocery. Your order reference is{" "}
          <strong className="text-emerald-700 dark:text-emerald-400 font-mono">
            {orderSuccess.orderId || orderSuccess._id}
          </strong>.
        </p>
        <p className="text-sm text-gray-500">We are preparing your items for fast dispatch.</p>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/products"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-emerald-600" /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">Your cart is currently empty</h3>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Explore our fresh produce, organic dairy, and everyday essentials to fill your basket!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b dark:border-slate-700">
              <span className="text-sm font-semibold text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
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
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={product.imageUrl || product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-50 dark:bg-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{product.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        Category: {product.category || "Grocery"}
                      </p>
                      {product.sku && (
                        <p className="text-xs text-gray-400 font-mono">SKU: {product.sku}</p>
                      )}
                      <div className="mt-1 text-sm font-bold text-emerald-600">
                        ₹{unitPrice.toFixed(2)}{" "}
                        {product.discount > 0 && (
                          <span className="text-xs line-through text-gray-400 font-normal ml-1">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-900">
                      <button
                        onClick={() => updateQuantity(id, -1)}
                        className="p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-800"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-semibold text-sm text-gray-800 dark:text-gray-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(id, 1)}
                        className="p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-800"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="font-extrabold text-gray-900 dark:text-white">
                        ₹{itemTotal.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-3 border-b dark:border-slate-700">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="pt-3 border-t dark:border-slate-700 flex justify-between text-base font-extrabold text-gray-900 dark:text-white">
                  <span>Total Payable</span>
                  <span className="text-emerald-600">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter street, city, pincode..."
                    className="w-full text-sm p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="UPI">UPI / Online Payment</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
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
