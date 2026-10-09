import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../Pages/CartContext";
import { ShoppingBag, Search, Menu, X, LogOut, Phone, Store, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      {/* Top Announcement Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-medium">
          <div className="hidden sm:flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-400" /> Customer Helpline: +91 95006 28734 (8:00 AM - 9:00 PM)
          </div>
          <div className="mx-auto sm:mx-0 text-slate-300">
            <span className="text-emerald-400 font-bold">Vishal Super Market</span> — Wholesale Rates on Daily Ration • Free Delivery over ₹499
          </div>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
              V
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none block">
                Vishal <span className="text-emerald-600">Super Market</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-1">
                Departmental & Grocery Store
              </span>
            </div>
          </Link>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search Atta, Rice, Dal, Milk, Oil, Fresh Produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-2xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-200 font-medium transition"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <Link
              to="/"
              className={`hover:text-emerald-600 transition ${
                location.pathname === "/" ? "text-emerald-600 font-bold border-b-2 border-emerald-600 pb-1" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`hover:text-emerald-600 transition ${
                location.pathname === "/products" ? "text-emerald-600 font-bold border-b-2 border-emerald-600 pb-1" : ""
              }`}
            >
              All Products
            </Link>
            <Link
              to="/orders"
              className={`hover:text-emerald-600 transition ${
                location.pathname === "/orders" ? "text-emerald-600 font-bold border-b-2 border-emerald-600 pb-1" : ""
              }`}
            >
              My Orders
            </Link>
            <Link
              to="/about"
              className={`hover:text-emerald-600 transition ${
                location.pathname === "/about" ? "text-emerald-600 font-bold border-b-2 border-emerald-600 pb-1" : ""
              }`}
            >
              About Store
            </Link>
            <Link
              to="/contact"
              className={`hover:text-emerald-600 transition ${
                location.pathname === "/contact" ? "text-emerald-600 font-bold border-b-2 border-emerald-600 pb-1" : ""
              }`}
            >
              Support
            </Link>
          </nav>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-2xl transition flex items-center gap-2 font-bold text-xs border border-slate-200"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <span className="hidden sm:inline">My Basket</span>
              {totalItems > 0 && (
                <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-2xl font-bold transition border border-slate-200"
                  title="View Profile & Settings"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hi, <strong className="text-slate-900">{user.username || user.name}</strong></span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-3 py-2 rounded-2xl font-bold transition border border-slate-200"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-2xl font-bold transition border border-slate-200 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-2xl font-bold shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-emerald-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl pl-3 pr-9 py-2 border border-slate-200"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-2 text-xs font-bold text-slate-600">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-xl">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-xl">
              All Products
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-xl">
              My Basket ({totalItems})
            </Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-xl">
              My Orders
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-xl">
              About Store
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-slate-50 rounded-xl">
              Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
