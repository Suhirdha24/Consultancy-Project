import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  LogOut,
  Save,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: user?.username || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-slate-50 py-12 px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center max-w-md w-full space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Please Sign In</h2>
          <p className="text-sm text-slate-500">
            You need to be logged in to view your profile and account settings.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/login"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Log In Now
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initialLetter = (form.username || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white font-black text-3xl flex items-center justify-center shadow-md shrink-0">
              {initialLetter}
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Valued Customer • Vishal Super Market
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {form.username || "Customer Profile"}
              </h1>
              <p className="text-xs text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {form.email || "No email linked"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Profile details updated successfully! Your account info has been saved.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Form Details */}
          <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" /> Personal Account Details
              </h3>
              <p className="text-xs text-slate-400">
                Update your contact details and default delivery address.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full text-xs p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full text-xs p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile / Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  className="w-full text-xs p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Default Shipping Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter house no, street, city, pincode..."
                  className="w-full text-xs p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-xs"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Quick Shortcuts & Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Quick Shortcuts
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 rounded-xl border border-slate-200 transition"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" /> My Order History
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 rounded-xl border border-slate-200 transition"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" /> My Shopping Basket
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 rounded-xl border border-slate-200 transition"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" /> Customer Support
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-emerald-900 text-slate-100 p-6 rounded-3xl space-y-3 shadow-sm">
              <div className="inline-flex p-2 bg-emerald-800 rounded-xl text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Store Hours & Delivery</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vishal Super Market is open 7 days a week from 8:00 AM to 10:00 PM. Same-day delivery for local orders!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
