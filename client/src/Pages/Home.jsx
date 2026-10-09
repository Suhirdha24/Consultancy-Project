import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { apiClient } from "../lib/api";
import {
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Percent,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  PhoneCall,
  Sparkles,
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
    { name: "Dairy & Milk", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300", offer: "Up to 15% OFF" },
    { name: "Atta & Rice", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", offer: "Best Wholesale Rates" },
    { name: "Fresh Vegetables", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300", offer: "Daily Morning Harvest" },
    { name: "Edible Oils & Ghee", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300", offer: "Top Brands Available" },
    { name: "Snacks & Beverages", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300", offer: "Flat Discounts" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* 🏬 HERO BANNER SECTION */}
      <section className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <span className="inline-block px-3.5 py-1 bg-yellow-400 text-gray-950 font-black text-xs rounded-md uppercase tracking-wider shadow">
              Vishal Super Market • Monthly Savings Fair
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Best Quality Groceries <br />
              <span className="text-yellow-300">At Super Market Wholesale Prices</span>
            </h1>

            <p className="text-red-100 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Shop fresh farm produce, branded flour, pulses, cooking oils, and daily essentials from your trusted local departmental store.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-7 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="w-4 h-4" /> Browse All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-extrabold text-lg text-red-700">Today's Store Highlights</h3>
                <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full">
                  Special Offers
                </span>
              </div>

              <div className="space-y-3 text-xs font-semibold text-gray-700">
                <div className="flex items-center justify-between p-2.5 bg-red-50 rounded-xl border border-red-100">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600" /> Aashirvaad & India Gate Atta/Rice
                  </span>
                  <span className="font-bold text-red-700">Save up to 12%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-xl border border-green-100">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Amul Dairy & Butter Products
                  </span>
                  <span className="font-bold text-green-700">Fresh Daily Stock</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" /> Free Home Delivery
                  </span>
                  <span className="font-bold text-amber-800">On Orders Over ₹499</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📦 CATEGORY CAROUSEL / GRID */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b pb-3 border-gray-200">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Shop By Category</span>
            <h2 className="text-2xl font-black text-gray-900">Explore Departmental Store Sections</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to="/products"
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition text-center space-y-3 group"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-16 h-16 object-cover rounded-full mx-auto group-hover:scale-105 transition"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition">
                  {cat.name}
                </h4>
                <span className="text-[11px] text-red-600 font-semibold">{cat.offer}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🛒 FEATURED PRODUCTS GRID */}
      <section className="py-10 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Popular Items</span>
              <h2 className="text-2xl font-black text-gray-900">Recommended Daily Staples</h2>
            </div>
            <Link
              to="/products"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl border border-gray-300 transition"
            >
              View Full Catalog
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500 font-medium">Loading grocery catalog...</div>
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
                    className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden h-40 bg-gray-50">
                        <img
                          src={
                            prod.imageUrl ||
                            prod.image ||
                            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"
                          }
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                        {prod.discount > 0 && (
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded-full uppercase">
                            {prod.discount}% OFF
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                          {prod.category || prod.productType || "Grocery"}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{prod.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{prod.desc || "High quality grocery staple."}</p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-gray-900">₹{unitPrice.toFixed(2)}</span>
                        {prod.discount > 0 && (
                          <span className="text-xs line-through text-gray-400 ml-1.5">₹{prod.price.toFixed(2)}</span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 🛡️ WHY CHOOSE VISHAL SUPER MARKET */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl inline-block">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-gray-900">Wholesale Prices Every Day</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We source directly from manufacturers and farmers to offer unbeatable savings on your monthly kitchen budget.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl inline-block">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-gray-900">Reliable Doorstep Delivery</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Order online from the comfort of your home and receive carefully packed groceries right at your door.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl inline-block">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-gray-900">100% Quality Assurance</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Strict quality inspection for food grains, fresh produce, and packaged items with easy store returns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
