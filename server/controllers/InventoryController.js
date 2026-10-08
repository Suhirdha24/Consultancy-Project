const Product = require("../models/ProductModel");
const InventoryTransaction = require("../models/InventoryTransaction");
const StockAlert = require("../models/StockAlert");

const refreshAlerts = async () => {
  const products = await Product.find({ status: "active" });
  const now = new Date();

  for (const prod of products) {
    if (prod.stock === 0) {
      await StockAlert.findOneAndUpdate(
        { productId: prod._id, alertType: "OUT_OF_STOCK" },
        {
          productId: prod._id,
          alertType: "OUT_OF_STOCK",
          severity: "CRITICAL",
          message: `${prod.name} is completely OUT OF STOCK!`,
          resolved: false,
        },
        { upsert: true, new: true }
      );
    } else if (prod.stock <= prod.minStock) {
      await StockAlert.findOneAndUpdate(
        { productId: prod._id, alertType: "LOW_STOCK" },
        {
          productId: prod._id,
          alertType: "LOW_STOCK",
          severity: "HIGH",
          message: `${prod.name} is LOW ON STOCK (${prod.stock} units remaining, min limit: ${prod.minStock})`,
          resolved: false,
        },
        { upsert: true, new: true }
      );
    } else {
      await StockAlert.updateMany(
        { productId: prod._id, alertType: { $in: ["LOW_STOCK", "OUT_OF_STOCK"] } },
        { resolved: true }
      );
    }

    if (prod.expiryDate) {
      const exp = new Date(prod.expiryDate);
      const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        await StockAlert.findOneAndUpdate(
          { productId: prod._id, alertType: "EXPIRED" },
          {
            productId: prod._id,
            alertType: "EXPIRED",
            severity: "CRITICAL",
            message: `${prod.name} EXPIRED ${Math.abs(diffDays)} days ago (${exp.toLocaleDateString()})`,
            resolved: false,
          },
          { upsert: true, new: true }
        );
      } else if (diffDays <= 7) {
        await StockAlert.findOneAndUpdate(
          { productId: prod._id, alertType: "URGENT_EXPIRY" },
          {
            productId: prod._id,
            alertType: "URGENT_EXPIRY",
            severity: "HIGH",
            message: `${prod.name} expires in ${diffDays} days (${exp.toLocaleDateString()}) - URGENT!`,
            resolved: false,
          },
          { upsert: true, new: true }
        );
      } else if (diffDays <= 30) {
        await StockAlert.findOneAndUpdate(
          { productId: prod._id, alertType: "EXPIRING_SOON" },
          {
            productId: prod._id,
            alertType: "EXPIRING_SOON",
            severity: "MEDIUM",
            message: `${prod.name} expires in ${diffDays} days (${exp.toLocaleDateString()})`,
            resolved: false,
          },
          { upsert: true, new: true }
        );
      } else {
        await StockAlert.updateMany(
          { productId: prod._id, alertType: { $in: ["EXPIRING_SOON", "URGENT_EXPIRY", "EXPIRED"] } },
          { resolved: true }
        );
      }
    }
  }
};

const getAlerts = async (req, res) => {
  try {
    await refreshAlerts();
    const alerts = await StockAlert.find({ resolved: false })
      .populate("productId", "name sku barcode stock minStock expiryDate image")
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching alerts", error: err.message });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await StockAlert.findByIdAndUpdate(id, { resolved: true }, { new: true });
    res.status(200).json(alert);
  } catch (err) {
    res.status(500).json({ message: "Error resolving alert", error: err.message });
  }
};

const adjustStock = async (req, res) => {
  try {
    const { productId, type, quantity, note, referenceId } = req.body;
    const prod = await Product.findById(productId);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const qty = Number(quantity);
    const previousStock = prod.stock;
    let newStock = previousStock;

    if (["PURCHASE", "RETURN"].includes(type)) {
      newStock += Math.abs(qty);
    } else if (["SALE", "DAMAGE", "EXPIRY", "MANUAL_ADJUSTMENT"].includes(type)) {
      newStock = type === "MANUAL_ADJUSTMENT" ? qty : Math.max(0, previousStock - Math.abs(qty));
    }

    prod.stock = newStock;
    await prod.save();

    const transaction = new InventoryTransaction({
      productId,
      type,
      quantity: newStock - previousStock,
      previousStock,
      newStock,
      referenceId: referenceId || "ADJ-" + Date.now(),
      note: note || `Manual ${type} adjustment`,
      createdBy: req.user ? req.user.username : "Admin",
    });
    await transaction.save();

    await refreshAlerts();

    res.status(200).json({ message: "Stock adjusted successfully", product: prod, transaction });
  } catch (err) {
    res.status(500).json({ message: "Error adjusting stock", error: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { productId, limit = 100 } = req.query;
    const filter = {};
    if (productId) filter.productId = productId;

    const transactions = await InventoryTransaction.find(filter)
      .populate("productId", "name sku barcode category")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inventory transactions", error: err.message });
  }
};

const getProductByBarcode = async (req, res) => {
  try {
    const { code } = req.params;
    const product = await Product.findOne({
      $or: [{ barcode: code }, { sku: code }, { _id: code.match(/^[0-9a-fA-F]{24}$/) ? code : null }],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found with barcode / SKU: " + code });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error looking up product by barcode", error: err.message });
  }
};

module.exports = { getAlerts, resolveAlert, adjustStock, getTransactions, getProductByBarcode, refreshAlerts };
