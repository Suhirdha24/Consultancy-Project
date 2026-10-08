require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/Products");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin",adminRoutes);

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grocery_db";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

