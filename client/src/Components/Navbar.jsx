import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../Pages/CartContext";
import { ShoppingBag, Search, Menu, X, Shield, LogOut, Phone, Store, User as UserIcon } from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      {/* Top Announcement Bar */}
      <div className="bg-red-700 text-white text-xs py-1.5 px-4 text-center font-semibold tracking-wide flex justify-between items-center max-w-7xl mx-auto">
        <div className="hidden sm:flex items-center gap-2">
          <Phone className="w-3.5 h-3.5" /> Customer Care: +91 98765 43210 (8 AM - 9 PM)
        </div>
        <div className="mx-auto sm:mx-0">
          Vishal Super Market — Maximum Savings On Monthly Ration & Daily Staples! Free Delivery over ₹499
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
              V
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-gray-900 leading-none block">
                Vishal <span className="text-red-600">Super Market</span>
              </span>
              <span className="text-[11px] text-gray-500 font-semibold tracking-wider uppercase block mt-0.5">
                Grocery & Departmental Store
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              placeholder="Search for Atta, Rice, Dal, Milk, Oil, Fresh Produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 text-sm rounded-xl pl-4 pr-11 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-300 font-medium"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-red-600 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-700">
            <Link
              to="/"
              className={`hover:text-red-600 transition-colors ${
                location.pathname === "/" ? "text-red-600 border-b-2 border-red-600 pb-1" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`hover:text-red-600 transition-colors ${
                location.pathname === "/products" ? "text-red-600 border-b-2 border-red-600 pb-1" : ""
              }`}
            >
              All Products
            </Link>
            <Link
              to="/orders"
              className={`hover:text-red-600 transition-colors ${
                location.pathname === "/orders" ? "text-red-600 border-b-2 border-red-600 pb-1" : ""
              }`}
            >
              My Orders
            </Link>
            <Link
              to="/about"
              className={`hover:text-red-600 transition-colors ${
                location.pathname === "/about" ? "text-red-600 border-b-2 border-red-600 pb-1" : ""
              }`}
            >
              About Store
            </Link>
            <Link
              to="/contact"
              className={`hover:text-red-600 transition-colors ${
                location.pathname === "/contact" ? "text-red-600 border-b-2 border-red-600 pb-1" : ""
              }`}
            >
              Help & Support
            </Link>
          </nav>

          {/* Right User Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2 font-bold text-xs"
            >
              <ShoppingBag className="w-6 h-6 text-red-600" />
              <span className="hidden sm:inline">Basket</span>
              {totalItems > 0 && (
                <span className="bg-red-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs text-gray-600 font-semibold">
                  Hello, <strong className="text-gray-900">{user.username || user.name}</strong>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-3 py-2 rounded-xl font-bold transition border border-gray-200"
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
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-xl font-bold transition border border-gray-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl font-extrabold shadow transition"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-red-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 text-sm rounded-xl pl-3 pr-9 py-2 border border-gray-300"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-500">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-2 text-sm font-bold text-gray-700">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-lg">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-lg">
              All Products
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-lg">
              My Basket ({totalItems})
            </Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-lg">
              My Orders
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-lg">
              About Store
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-lg">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
