import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-sm">
        {/* Brand Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-black text-xl flex items-center justify-center">
              V
            </div>
            <span className="text-xl font-bold text-white">Vishal Super Market</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your trusted family neighborhood departmental store providing farm-fresh produce, daily staples, edible oils, dairy, and household essentials at the lowest prices every day.
          </p>
          <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Store Hours: 8:00 AM - 10:00 PM (Mon-Sun)
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-white text-base mb-4">Quick Navigation</h3>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>
              <Link to="/" className="hover:text-white transition">Home Page</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition">All Grocery Products</Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-white transition">My Order History</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">About Our Super Market</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">Customer Support</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold text-white text-base mb-4">Popular Categories</h3>
          <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
            <li>Atta, Dal & Food Grains</li>
            <li>Milk, Butter & Dairy Products</li>
            <li>Edible Oils & Cooking Ghee</li>
            <li>Fresh Farm Vegetables & Fruits</li>
            <li>Snacks, Biscuits & Beverages</li>
          </ul>
        </div>

        {/* Store Contact */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-base mb-1">Store Address</h3>
          <div className="flex items-start gap-2.5 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>Main Market Road, Tiruppur, Tamil Nadu, India</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>+91 95006 28734 / +91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-blue-400 shrink-0" />
            <span>support@vishalsupermarket.com</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
        <div>
          © {new Date().getFullYear()} <strong>Vishal Super Market</strong>. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Quality Guaranteed</span> • <span>Fast Doorstep Delivery</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
