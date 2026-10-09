require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const seedData = require("./seed");

const productRoutes = require("./routes/Products");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/admin");
const supplierRoutes = require("./routes/supplierRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Health Check Endpoints for Deployment Platforms
app.get("/health", (req, res) => res.status(200).json({ status: "OK", timestamp: new Date() }));
app.get("/", (req, res) => res.status(200).json({ message: "Vishal Super Market Backend API is Running", status: "OK" }));

// Versioned / Standard API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/suppliers", supplierRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// Legacy routes for backwards compatibility
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/analytics", analyticsRoutes);

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grocery_db";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("✅ MongoDB connected successfully!");
    await seedData();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

module.exports = app;
