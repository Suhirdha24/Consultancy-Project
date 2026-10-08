const Product = require("../models/ProductModel");
const InventoryTransaction = require("../models/InventoryTransaction");
const { refreshAlerts } = require("./InventoryController");

const createProduct = async (req, res) => {
  try {
    const { name, desc, price, costPrice, image, productType, brand, sku, barcode, discount_percent, stock, minStock, maxStock, unit, expiryDate } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const generatedSku = sku || "SKU-" + Math.floor(100000 + Math.random() * 900000);
    const generatedBarcode = barcode || "890" + Math.floor(100000000 + Math.random() * 900000000);

    const newProduct = new Product({
      name,
      desc,
      price: Number(price),
      costPrice: Number(costPrice || 0),
      image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
      productType: productType || "General",
      brand: brand || "Generic",
      sku: generatedSku,
      barcode: generatedBarcode,
      discount_percent: Number(discount_percent || 0),
      stock: Number(stock || 0),
      minStock: Number(minStock || 5),
      maxStock: Number(maxStock || 100),
      unit: unit || "pcs",
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    const savedProduct = await newProduct.save();

    if (savedProduct.stock > 0) {
      await InventoryTransaction.create({
        productId: savedProduct._id,
        type: "PURCHASE",
        quantity: savedProduct.stock,
        previousStock: 0,
        newStock: savedProduct.stock,
        referenceId: "INIT-" + savedProduct._id,
        note: "Initial product stock onboarding",
        createdBy: req.user ? req.user.username : "Admin",
      });
    }

    await refreshAlerts();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, flat } = req.query;
    const filter = { status: { $ne: "discontinued" } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { barcode: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.productType = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);

    if (sort === "price-low") query = query.sort({ price: 1 });
    else if (sort === "price-high") query = query.sort({ price: -1 });
    else if (sort === "name") query = query.sort({ name: 1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;

    if (flat === "true") {
      return res.status(200).json(products);
    }

    const grouped = {};
    products.forEach((product) => {
      const cat = product.productType || "General";
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(product);
    });

    res.status(200).json(grouped);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching product", error: err.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { items, type = "SALE", referenceId } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Items array is required" });
    }

    for (const item of items) {
      const prod = await Product.findById(item.productId);
      if (prod) {
        const previousStock = prod.stock;
        const decQty = Number(item.quantity);
        const newStock = Math.max(0, previousStock - decQty);
        prod.stock = newStock;
        await prod.save();

        await InventoryTransaction.create({
          productId: prod._id,
          type,
          quantity: -decQty,
          previousStock,
          newStock,
          referenceId: referenceId || "ORD-TX-" + Date.now(),
          note: `Stock deduction for order`,
          createdBy: req.user ? req.user.username : "Customer",
        });
      }
    }

    await refreshAlerts();
    res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndUpdate(id, { status: "discontinued" }, { new: true });
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product marked as discontinued", product: deleted });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateStock,
  deleteProduct,
};
