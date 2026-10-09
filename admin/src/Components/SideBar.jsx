import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  ShoppingBag,
  Users,
  Scan,
  BarChart3,
  TrendingUp,
  Store,
} from "lucide-react";

const SideBar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Products & Stock", path: "/admin/products", icon: Package },
    { label: "Stock Alerts", path: "/admin/alerts", icon: AlertTriangle },
    { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { label: "Suppliers", path: "/admin/suppliers", icon: Users },
    { label: "Barcode Scanner", path: "/admin/scanner", icon: Scan },
    { label: "Analytics & PDF", path: "/admin/report", icon: BarChart3 },
    { label: "AI Forecast", path: "/admin/forecast", icon: TrendingUp },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between shadow-xl">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
            V
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base leading-none">Vishal Super Market</h2>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                    : "hover:bg-slate-800 hover:text-white text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-3 border-t border-slate-800 text-xs text-slate-500">
        <p>System Status: <span className="text-emerald-400 font-semibold">Online</span></p>
        <p className="mt-1 font-mono text-[10px]">v2.4.0 • Enterprise Edition</p>
      </div>
    </aside>
  );
};

export default SideBar;
