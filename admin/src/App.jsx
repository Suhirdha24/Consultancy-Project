import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./Components/SideBar";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import StockAlerts from "./Pages/StockAlerts";
import Orders from "./Pages/Orders";
import Suppliers from "./Pages/Suppliers";
import BarcodeScanner from "./Pages/BarcodeScanner";
import ReportPage from "./Pages/Report";
import Forecast from "./Pages/Forecast";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
        <SideBar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/alerts" element={<StockAlerts />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/suppliers" element={<Suppliers />} />
            <Route path="/admin/scanner" element={<BarcodeScanner />} />
            <Route path="/admin/report" element={<ReportPage />} />
            <Route path="/admin/forecast" element={<Forecast />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
