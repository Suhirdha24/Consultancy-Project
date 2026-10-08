import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../Pages/CartContext";
import { ShoppingCart, Search, Menu, X, Shield, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
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
    <header className="sticky top-0 z-50 bg-emerald-900 text-white shadow-md transition-colors duration-200">
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 text-center font-medium">
        🚀 Superfast Grocery Delivery | Fresh & Certified Organic Daily Products | Free delivery on orders over ₹499!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              🌿
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                GreenBasket
              </span>
              <span className="block text-[10px] text-emerald-300 tracking-wider font-semibold uppercase">
                Supermarket & Express
              </span>
            </div>
          </Link>

          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search fresh groceries, milk, rice, fruits, spices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-800 text-white placeholder-emerald-300 text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-emerald-700"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-emerald-100">
            <Link
              to="/"
              className={`hover:text-white transition-colors ${
                location.pathname === "/" ? "text-white font-semibold border-b-2 border-emerald-400 pb-1" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`hover:text-white transition-colors ${
                location.pathname === "/products" ? "text-white font-semibold border-b-2 border-emerald-400 pb-1" : ""
              }`}
            >
              Products
            </Link>
            <Link
              to="/about"
              className={`hover:text-white transition-colors ${
                location.pathname === "/about" ? "text-white font-semibold border-b-2 border-emerald-400 pb-1" : ""
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`hover:text-white transition-colors ${
                location.pathname === "/contact" ? "text-white font-semibold border-b-2 border-emerald-400 pb-1" : ""
              }`}
            >
              Contact
            </Link>
            {user && (
              <Link
                to="/my-orders"
                className={`hover:text-white transition-colors ${
                  location.pathname === "/my-orders" ? "text-white font-semibold border-b-2 border-emerald-400 pb-1" : ""
                }`}
              >
                My Orders
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 rounded-lg font-bold text-xs shadow transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-emerald-100 hover:text-white hover:bg-emerald-800 rounded-full transition-colors flex items-center"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs text-emerald-200 font-medium">
                  Hi, <strong className="text-white">{user.username}</strong>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs bg-emerald-800 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
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
                  className="text-xs bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-900 px-3 py-1.5 rounded-lg font-bold shadow transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-emerald-100 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-t border-emerald-800 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-900 text-white placeholder-emerald-400 text-sm rounded-lg pl-3 pr-9 py-2 border border-emerald-800"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-emerald-300">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-2 pt-2 text-sm">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-emerald-900 rounded">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-emerald-900 rounded">
              Products
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-emerald-900 rounded">
              Cart ({totalItemsCount})
            </Link>
            {user && (
              <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-emerald-900 rounded">
                My Orders
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 bg-amber-500 text-slate-900 font-bold rounded">
                Admin Panel
              </Link>
            )}
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-emerald-900 rounded">
              About Us
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-emerald-900 rounded">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
