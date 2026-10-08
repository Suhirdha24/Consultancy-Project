const express = require("express");
const router = express.Router();
const { getAlerts, resolveAlert, adjustStock, getTransactions, getProductByBarcode } = require("../controllers/InventoryController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/alerts", getAlerts);
router.put("/alerts/:id/resolve", verifyToken, requireAdmin, resolveAlert);
router.post("/adjust", verifyToken, requireAdmin, adjustStock);
router.get("/transactions", getTransactions);
router.get("/barcode/:code", getProductByBarcode);

module.exports = router;
