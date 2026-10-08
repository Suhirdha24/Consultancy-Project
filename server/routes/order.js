const express = require("express");
const router = express.Router();
const { placeOrder, getCustomerOrders, updateOrderStatus } = require("../controllers/Order");

router.post("/place-order", placeOrder);
router.post("/", placeOrder);
router.get("/my-orders", getCustomerOrders);
router.get("/", getCustomerOrders);
router.put("/:id/status", updateOrderStatus);

module.exports = router;
