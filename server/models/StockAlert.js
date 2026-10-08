const mongoose = require("mongoose");

const StockAlertSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    alertType: {
      type: String,
      enum: ["LOW_STOCK", "OUT_OF_STOCK", "EXPIRING_SOON", "URGENT_EXPIRY", "EXPIRED"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockAlert", StockAlertSchema);
