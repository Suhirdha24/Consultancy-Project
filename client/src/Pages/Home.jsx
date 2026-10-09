import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { apiClient } from "../lib/api";
import {
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ShoppingBasket,
  BadgePercent,
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
      setFeaturedProducts((data || []).slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Dairy & Eggs", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300", tag: "Fresh Daily" },
    { name: "Atta, Rice & Dal", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", tag: "Wholesale Rates" },
    { name: "Fresh Produce", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300", tag: "Farm Harvest" },
    { name: "Edible Oils & Ghee", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300", tag: "Pure & Refined" },
    { name: "Snacks & Beverages", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300", tag: "Best Discounts" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 🏬 HERO BANNER SECTION */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Vishal Super Market • Monthly Ration Fair
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Quality Groceries & Staples <br />
                <span className="text-emerald-600">At Unbeatable Savings Every Day.</span>
              </h1>

              <p className="text-slate-500 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Shop branded wheat flour, rice, lentils, cooking oil, fresh dairy, and daily essentials from your trusted departmental store.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm transition flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-4 h-4" /> Shop All Products <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Clock className="w-4 h-4 text-emerald-600" /> Express Delivery Available
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BadgePercent className="w-4 h-4 text-emerald-600" /> Daily Store Specials
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                    Verified Lowest Price
                  </span>
                </div>

                <div className="space-y-3 text-xs font-medium text-slate-700">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Aashirvaad Atta & Basmati Rice
                    </span>
                    <strong className="text-emerald-700 font-bold">10-15% Off</strong>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fresh Amul Milk & Butter
                    </span>
                    <strong className="text-slate-900 font-bold">Fresh Morning Stock</strong>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Home Delivery
                    </span>
                    <strong className="text-slate-900 font-bold">Orders Above ₹499</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📦 CATEGORIES SECTION */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Browse Departments</span>
            <h2 className="text-xl font-bold text-slate-900">Shop By Category</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to="/products"
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-emerald-500 transition text-center space-y-2.5 group"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-16 h-16 object-cover rounded-2xl mx-auto group-hover:scale-105 transition"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-xs group-hover:text-emerald-600 transition">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-emerald-600 font-semibold">{cat.tag}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🛒 FEATURED PRODUCTS GRID */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Store Inventory</span>
            <h2 className="text-xl font-bold text-slate-900">Featured Daily Staples</h2>
          </div>
          <Link
            to="/products"
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition shadow-sm"
          >
            View Complete Store Catalog
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium text-xs">Loading grocery items...</div>
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
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden h-44 bg-slate-50">
                      <img
                        src={
                          prod.imageUrl ||
                          prod.image ||
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
                        }}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      {prod.discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold text-[10px] rounded-full uppercase shadow-sm">
                          {prod.discount}% OFF
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        {prod.category || prod.productType || "Grocery"}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{prod.desc || "Quality food product."}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">₹{unitPrice.toFixed(2)}</span>
                      {prod.discount > 0 && (
                        <span className="text-xs line-through text-slate-400 ml-1.5">₹{prod.price.toFixed(2)}</span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 🛡️ VALUE PROPOSITIONS */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block">
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Wholesale Store Rates</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enjoy direct wholesale pricing on food grains, flours, oils, and daily kitchen supplies.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Fast Doorstep Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Carefully packed grocery items delivered straight to your doorstep on time.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Quality Tested Products</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cleaned, hygiene-tested grains and products with easy returns and replacement assurance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
