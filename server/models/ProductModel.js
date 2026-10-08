const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" },
    productType: { type: String, default: "General", trim: true },
    brand: { type: String, default: "Generic" },
    sku: { type: String, unique: true, sparse: true, trim: true },
    barcode: { type: String, unique: true, sparse: true, trim: true },
    discount_percent: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 5, min: 0 },
    maxStock: { type: Number, default: 100, min: 0 },
    unit: { type: String, default: "pcs" },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    batchNumber: { type: String, default: "" },
    expiryDate: { type: Date },
    status: { type: String, enum: ["active", "inactive", "discontinued"], default: "active" },
  },
  { timestamps: true }
);

ProductSchema.virtual("effectivePrice").get(function () {
  return this.price * (1 - (this.discount_percent || 0) / 100);
});

module.exports = mongoose.model("Product", ProductSchema);
