const mongoose = require("mongoose");

const InventoryTransactionSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    type: {
      type: String,
      enum: ["PURCHASE", "SALE", "RETURN", "DAMAGE", "EXPIRY", "MANUAL_ADJUSTMENT"],
      required: true,
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    referenceId: { type: String, default: "" },
    note: { type: String, default: "" },
    createdBy: { type: String, default: "System" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryTransaction", InventoryTransactionSchema);
