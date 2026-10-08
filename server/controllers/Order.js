const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const InventoryTransaction = require("../models/InventoryTransaction");
const { refreshAlerts } = require("./InventoryController");

const VALID_TRANSITIONS = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: ["RETURN_REQUESTED"],
  RETURN_REQUESTED: ["RETURNED", "DELIVERED"],
  RETURNED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

const placeOrder = async (req, res) => {
  try {
    const { name, phone, email, address, items, paymentDetails } = req.body;

    if (!name || !phone || !address || !items || !items.length) {
      return res.status(400).json({ message: "Please fill in all required delivery details and add items" });
    }

    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const prodId = item.productId || item.id || item._id;
      const product = prodId ? await Product.findById(prodId) : null;

      const price = product ? product.price : Number(item.price) || 0;
      const discount = product ? product.discount_percent : Number(item.discount) || 0;
      const effectivePrice = price * (1 - discount / 100);
      const qty = Number(item.quantity) || 1;
      const itemTotal = effectivePrice * qty;

      subtotal += itemTotal;

      processedItems.push({
        productId: product ? product._id : null,
        name: item.name || (product ? product.name : "Grocery Item"),
        quantity: qty,
        price,
        discount,
        total: parseFloat(itemTotal.toFixed(2)),
      });

      if (product) {
        const previousStock = product.stock;
        const newStock = Math.max(0, previousStock - qty);
        product.stock = newStock;
        await product.save();

        await InventoryTransaction.create({
          productId: product._id,
          type: "SALE",
          quantity: -qty,
          previousStock,
          newStock,
          referenceId: "ORD-" + Date.now(),
          note: `Customer purchase by ${name}`,
          createdBy: req.user ? req.user.username : name,
        });
      }
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = parseFloat(subtotal.toFixed(2));

    const newOrder = new Order({
      orderId,
      userId: req.user ? req.user.userId : null,
      name,
      phone,
      email: email || "",
      address,
      items: processedItems,
      subtotal: totalAmount,
      totalAmount,
      paymentStatus: paymentDetails ? "PAID" : "PAID",
      orderStatus: "PLACED",
      paymentDetails: paymentDetails || {},
    });

    await newOrder.save();
    await refreshAlerts();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const { phone, email } = req.query;
    const filter = {};

    if (req.user && req.user.userId) {
      filter.$or = [{ userId: req.user.userId }];
      if (email) filter.$or.push({ email });
      if (phone) filter.$or.push({ phone });
    } else if (phone || email) {
      filter.$or = [];
      if (phone) filter.$or.push({ phone });
      if (email) filter.$or.push({ email });
    } else {
      return res.status(200).json([]);
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order history", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (orderStatus && orderStatus !== order.orderStatus) {
      const allowed = VALID_TRANSITIONS[order.orderStatus] || [];
      if (!allowed.includes(orderStatus)) {
        return res.status(400).json({
          message: `Invalid order status transition from ${order.orderStatus} to ${orderStatus}. Allowed transitions: [${allowed.join(
            ", "
          )}]`,
        });
      }
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

module.exports = {
  placeOrder,
  getCustomerOrders,
  updateOrderStatus,
};
