import React, { useEffect, useState } from "react";
import { adminApiClient } from "../lib/api";
import { BarChart3, Printer, DollarSign, Package, TrendingUp, Download, PieChart } from "lucide-react";

const ReportPage = () => {
  const [summary, setSummary] = useState(null);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [sumRes, catRes] = await Promise.all([
        adminApiClient.get("/analytics/sales-summary"),
        adminApiClient.get("/analytics/category-sales"),
      ]);

      setSummary(sumRes.data);
      setCategorySales(catRes.data.categorySales || catRes.data || []);
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:p-0 print:bg-white">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-emerald-600" /> Sales & Stock Analytics
          </h1>
          <p className="text-slate-500 text-sm">
            Comprehensive financial performance and category turnover analysis.
          </p>
        </div>
        <button
          onClick={handlePrintReport}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 shadow-md transition"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block text-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">FreshGrocery Inventory & Sales Audit Report</h1>
        <p className="text-xs text-slate-500">Generated on: {new Date().toLocaleString("en-IN")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Gross Revenue</span>
          <div className="text-3xl font-extrabold text-emerald-600">
            ₹{(summary?.totalRevenue || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-slate-500">Calculated across all completed orders</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Orders Processed</span>
          <div className="text-3xl font-extrabold text-slate-900">{summary?.totalOrders || 0}</div>
          <p className="text-xs text-slate-500">Fulfilling customer checkout requests</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Catalog SKU Count</span>
          <div className="text-3xl font-extrabold text-slate-900">{summary?.totalProducts || 0}</div>
          <p className="text-xs text-slate-500">Managed under inventory tracking</p>
        </div>
      </div>

      {/* Category Sales Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <PieChart className="w-5 h-5 text-emerald-600" /> Sales by Product Category
        </h3>

        {categorySales.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            No category sales recorded yet. Place orders to see live category performance!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Items Sold</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categorySales.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-800 capitalize">
                      {cat._id || "General Grocery"}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {cat.totalQuantitySold || cat.count || 0}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-600">
                      ₹{(cat.totalRevenue || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;