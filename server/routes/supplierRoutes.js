const express = require("express");
const router = express.Router();
const { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } = require("../controllers/SupplierController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", getAllSuppliers);
router.post("/", verifyToken, requireAdmin, createSupplier);
router.put("/:id", verifyToken, requireAdmin, updateSupplier);
router.delete("/:id", verifyToken, requireAdmin, deleteSupplier);

module.exports = router;
