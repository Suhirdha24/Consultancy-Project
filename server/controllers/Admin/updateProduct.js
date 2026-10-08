const Product = require("../../models/ProductModel");
const InventoryTransaction = require("../../models/InventoryTransaction");
const { refreshAlerts } = require("../InventoryController");

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, price, costPrice, discount_percent, stock, minStock, maxStock, productType, type, brand, sku, barcode, expiryDate } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const previousStock = existingProduct.stock;
    const newStock = stock !== undefined ? Number(stock) : previousStock;

    existingProduct.name = name || existingProduct.name;
    existingProduct.desc = desc !== undefined ? desc : existingProduct.desc;
    existingProduct.price = price !== undefined ? Number(price) : existingProduct.price;
    existingProduct.costPrice = costPrice !== undefined ? Number(costPrice) : existingProduct.costPrice;
    existingProduct.discount_percent = discount_percent !== undefined ? Number(discount_percent) : existingProduct.discount_percent;
    existingProduct.stock = newStock;
    existingProduct.minStock = minStock !== undefined ? Number(minStock) : existingProduct.minStock;
    existingProduct.maxStock = maxStock !== undefined ? Number(maxStock) : existingProduct.maxStock;
    existingProduct.productType = productType || type || existingProduct.productType;
    existingProduct.brand = brand || existingProduct.brand;
    existingProduct.sku = sku || existingProduct.sku;
    existingProduct.barcode = barcode || existingProduct.barcode;
    if (expiryDate) existingProduct.expiryDate = new Date(expiryDate);

    const savedProduct = await existingProduct.save();

    if (previousStock !== newStock) {
      const diff = newStock - previousStock;
      await InventoryTransaction.create({
        productId: savedProduct._id,
        type: diff > 0 ? "PURCHASE" : "MANUAL_ADJUSTMENT",
        quantity: diff,
        previousStock,
        newStock,
        referenceId: "ADMIN-EDIT-" + Date.now(),
        note: `Stock updated by Admin from ${previousStock} to ${newStock}`,
        createdBy: req.user ? req.user.username : "Admin",
      });
    }

    await refreshAlerts();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

module.exports = {
  updateProduct,
};
