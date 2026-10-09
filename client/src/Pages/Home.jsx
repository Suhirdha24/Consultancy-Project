import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { apiClient } from "../lib/api";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Zap,
  Truck,
  ShieldCheck,
  Star,
  Plus,
  Clock,
  ChevronRight,
  Flame,
  Award,
} from "lucide-react";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/products");
      let data = res.data;
      if (typeof data === "object" && !Array.isArray(data)) {
        data = Object.values(data).flat();
      }
      setFeaturedProducts((data || []).slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Dairy & Eggs", icon: "🥛", count: "24+ Items", color: "from-blue-500/10 to-indigo-500/10 text-blue-600" },
    { name: "Rice & Grains", icon: "🌾", count: "18+ Items", color: "from-amber-500/10 to-yellow-500/10 text-amber-600" },
    { name: "Fruits & Veggies", icon: "🍎", count: "40+ Items", color: "from-emerald-500/10 to-green-500/10 text-emerald-600" },
    { name: "Snacks & Munchies", icon: "🍪", count: "30+ Items", color: "from-orange-500/10 to-red-500/10 text-orange-600" },
    { name: "Beverages", icon: "🧃", count: "15+ Items", color: "from-purple-500/10 to-pink-500/10 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 🌟 ULTRA MODERN HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        {/* Background Glowing Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-400/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-900/80 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold tracking-wide shadow-inner backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Next-Gen Grocery Marketplace • 15 Min Delivery</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Freshness You <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Can Taste
                </span>
                , Speed You <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Can Trust.
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Experience farm-fresh organic produce, cold-pressed oils, aged rice, and daily dairy delivered straight to your kitchen table in minutes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-base"
                >
                  <ShoppingBag className="w-5 h-5" /> Explore Catalog <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#deals"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-800 transition flex items-center justify-center gap-2 text-base"
                >
                  <Flame className="w-5 h-5 text-amber-400" /> Today's Offers
                </a>
              </div>

              {/* Live Trust Metrics */}
              <div className="pt-6 border-t border-slate-900 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-black text-white font-mono">15 Min</div>
                  <div className="text-xs text-slate-500 font-medium">Hyperlocal Delivery</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Organic Certified</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-400 font-mono">50K+</div>
                  <div className="text-xs text-slate-500 font-medium">Happy Families</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Glassmorphism Hero Card */}
                <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl overflow-hidden space-y-6">
                  <div className="relative rounded-2xl overflow-hidden h-72 group">
                    <img
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                      alt="Fresh Organic Basket"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-emerald-500/30">
                          Featured Produce
                        </span>
                        <h4 className="text-lg font-bold text-white mt-1">Farm Organic Grocery Basket</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-md">
                        25% OFF
                      </span>
                    </div>
                  </div>

                  {/* Micro Live Order Ticker */}
                  <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                      <Zap className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Live Orders Processing
                      </div>
                      <div className="text-[11px] text-slate-400">
                        2,480+ groceries dispatched in Bengaluru & Mumbai today.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏷️ CATEGORY SPEED BROWSER */}
      <section className="py-12 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Categories</span>
              <h2 className="text-2xl font-extrabold text-white">Explore What You Need</h2>
            </div>
            <Link to="/products" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to="/products"
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition hover:-translate-y-1 space-y-3 group text-center"
              >
                <div className="text-3xl transform group-hover:scale-125 transition duration-300">{cat.icon}</div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                    {cat.name}
                  </h4>
                  <span className="text-[11px] text-slate-500">{cat.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 FEATURED LIVE PRODUCTS FROM CLOUD */}
      <section id="deals" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 text-amber-400 font-bold text-xs rounded-md border border-amber-400/20 mb-2">
                <Flame className="w-4 h-4 text-amber-400" /> Hot Deals & Bestsellers
              </div>
              <h2 className="text-3xl font-extrabold text-white">Trending Grocery Daily Picks</h2>
            </div>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-800 transition"
            >
              Browse Complete Catalog
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center text-emerald-400 font-mono">Loading fresh produce...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => {
                const id = prod._id || prod.id;
                const unitPrice = prod.discount
                  ? prod.price * (1 - prod.discount / 100)
                  : prod.price;

                return (
                  <div
                    key={id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-950">
                        <img
                          src={
                            prod.imageUrl ||
                            prod.image ||
                            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"
                          }
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {prod.discount > 0 && (
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-rose-500 text-slate-950 font-black text-[10px] rounded-full uppercase">
                            {prod.discount}% OFF
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          {prod.category || prod.productType || "Grocery"}
                        </span>
                        <h3 className="font-bold text-white text-base leading-snug line-clamp-1">{prod.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">{prod.desc || "Fresh organic staple."}</p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-emerald-400">₹{unitPrice.toFixed(2)}</span>
                        {prod.discount > 0 && (
                          <span className="text-xs line-through text-slate-500 ml-1.5">₹{prod.price.toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition shadow-md"
                        title="Quick Add to Cart"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 🛡️ VALUE PROPOSITION GRID */}
      <section className="py-16 bg-slate-900/60 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl inline-block border border-emerald-500/20">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Hyperlocal Speed</h3>
              <p className="text-sm text-slate-400">
                Direct fulfillment from local dark stores ensures your produce arrives within 15 minutes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl inline-block border border-teal-500/20">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Direct Farm Sourcing</h3>
              <p className="text-sm text-slate-400">
                We partner with verified organic farmers, cutting out middlemen for better prices & quality.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl inline-block border border-amber-500/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Safe & Hygiene Packed</h3>
              <p className="text-sm text-slate-400">
                Zero human touch packaging with strict temperature-controlled storage and eco-bags.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
