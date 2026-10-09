import React from "react";
import { Link } from "react-router-dom";
import door from "../assets/fast-delivery.png";
import pay from "../assets/payment-method.png";
import sup from "../assets/support.png";
import TestimonialCard from "./TestimonialCard";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Headphones } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {/* 🌟 Hero Section */}
      <div className="relative bg-emerald-900 text-white overflow-hidden py-24 px-6 sm:px-12 lg:px-24">
        <div className="absolute inset-0 z-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-full border border-emerald-400/30 uppercase tracking-widest">
            🚀 Farm Fresh • Superfast 15-Minute Delivery
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Fresh Groceries Delivered <br className="hidden sm:inline" />
            <span className="text-emerald-400">Right to Your Doorstep</span>
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto font-light">
            Order organic produce, daily dairy, premium grains, and everyday household essentials with guaranteed freshness and best market prices.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" /> Start Shopping Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 🚚 Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition text-center space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl inline-block">
              <Truck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Express Delivery</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get your daily essentials delivered straight to your doorstep — safely, quickly, and fresh.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition text-center space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl inline-block">
              <Headphones className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">24/7 Customer Support</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Our support team is always just a message away to assist with your order inquiries.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition text-center space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl inline-block">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">100% Quality Guarantee</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Strict quality control, organic certification, and hassle-free returns on damaged items.
            </p>
          </div>
        </div>
      </div>

      {/* 🎉 Offer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-amber-400 via-emerald-500 to-emerald-700 text-white rounded-3xl p-8 sm:p-12 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Limited Period Offer
            </span>
            <h2 className="text-3xl font-extrabold">🔥 Festive Grocery Bonanza!</h2>
            <p className="text-emerald-50 font-medium">
              Enjoy up to <strong className="text-white text-xl">50% OFF</strong> on bestselling staples, oils, and dairy!
            </p>
          </div>
          <Link
            to="/products"
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition shrink-0"
          >
            Explore Special Offers
          </Link>
        </div>
      </div>

      {/* 🗣️ Customer Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          💬 What Our Happy Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TestimonialCard
            name="Ravi Kumar"
            text="Super fast delivery, fresh produce, and a seamless shopping experience. Best grocery service in town!"
          />
          <TestimonialCard
            name="Meena Sundaram"
            text="Affordable prices, well-packed orders, and always reliable quality—my family relies on GreenBasket!"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
