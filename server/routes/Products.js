const express = require("express");
const { createProduct, getAllProduct, getSingleProduct, updateStock, deleteProduct } = require("../controllers/Products");
const { updateProduct } = require("../controllers/Admin/updateProduct");
const { getProductByBarcode } = require("../controllers/InventoryController");

const router = express.Router();

router.post("/add-product", createProduct);
router.post("/", createProduct);
router.get("/getall-products", getAllProduct);
router.get("/", getAllProduct);
router.put("/update-product/:id", updateProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/barcode/:code", getProductByBarcode);
router.get("/:id", getSingleProduct);
router.put("/update-stock", updateStock);

module.exports = router;
