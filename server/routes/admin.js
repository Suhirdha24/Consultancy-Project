const express = require("express");
const { getAllProduct } = require("../controllers/Admin/adminProduct");
const { getAllOrders } = require("../controllers/Admin/adminOrders");
const { updateOrderStatus } = require("../controllers/Order");

const router = express.Router();

router.get("/product", getAllProduct);
router.get("/order", getAllOrders);
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
