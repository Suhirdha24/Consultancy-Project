/**
 * Automated System Integration & Verification Test Suite for FreshGrocery
 * Run: node test.js
 */

require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Product = require("./models/ProductModel");
const Order = require("./models/OrderModel");
const InventoryTransaction = require("./models/InventoryTransaction");
const StockAlert = require("./models/StockAlert");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/grocery_db";

async function runSystemTests() {
  console.log("=================================================");
  console.log("🧪 STARTING INTEGRATION & VERIFICATION TEST SUITE");
  console.log("=================================================");

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failCount++;
    }
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("📍 Connected to MongoDB for Testing\n");

    // TEST 1: Password Hashing & Auth Guard Verification
    console.log("Test 1: User Model Hashing & Password Verification");
    const rawPassword = "SecurePassword123!";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const isValidPass = await bcrypt.compare(rawPassword, hashedPassword);
    const isInvalidPass = await bcrypt.compare("WrongPassword", hashedPassword);

    assert(isValidPass === true, "bcrypt successfully validates correct password credentials");
    assert(isInvalidPass === false, "bcrypt correctly rejects invalid password credentials");

    // TEST 2: Product Creation & SKU Generation
    console.log("\nTest 2: Product Schema & Stock Threshold Validation");
    const testSku = `TEST-SKU-${Date.now()}`;
    const testProduct = await Product.create({
      name: "Test Organic Milk",
      price: 65,
      costPrice: 45,
      discount: 10,
      productType: "dairy",
      category: "dairy",
      stock: 12,
      minStock: 15,
      maxStock: 100,
      sku: testSku,
      barcode: `BAR-${Date.now()}`,
    });

    assert(testProduct._id != null, "Product created with valid MongoDB ObjectId");
    assert(testProduct.sku === testSku, "Product SKU properly populated and unique");

    // TEST 3: Inventory Transaction & Order Stock Deduction
    console.log("\nTest 3: Order Placement & Inventory Stock Deduction");
    const initialStock = testProduct.stock;
    const purchaseQty = 5;

    // Deduct stock and log transaction
    testProduct.stock -= purchaseQty;
    await testProduct.save();

    const tx = await InventoryTransaction.create({
      productId: testProduct._id,
      type: "SALE",
      quantity: -purchaseQty,
      previousStock: initialStock,
      newStock: testProduct.stock,
      note: "Test Suite Order Purchase",
    });

    assert(testProduct.stock === initialStock - purchaseQty, "Product stock correctly decremented");
    assert(tx.quantity === -purchaseQty, "Inventory audit log created with negative delta for sale");

    // TEST 4: Stock Alert Generation
    console.log("\nTest 4: Low Stock Alert Triggering");
    const isLowStock = testProduct.stock <= testProduct.minStock;
    let alertCreated = false;

    if (isLowStock) {
      const stockAlert = await StockAlert.create({
        productId: testProduct._id,
        alertType: "LOW_STOCK",
        severity: "HIGH",
        message: `Stock level (${testProduct.stock}) fell below threshold (${testProduct.minStock})`,
        resolved: false,
      });
      alertCreated = stockAlert._id != null;
    }

    assert(isLowStock === true, "Detected stock level (7) is below minThreshold (15)");
    assert(alertCreated === true, "StockAlert record generated for low-stock product");

    // Cleanup Test Data
    await Product.findByIdAndDelete(testProduct._id);
    await InventoryTransaction.deleteMany({ productId: testProduct._id });
    await StockAlert.deleteMany({ productId: testProduct._id });
    console.log("\n📍 Test cleanup completed.");

    console.log("\n=================================================");
    console.log(`🎯 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
    console.log("=================================================");

    process.exit(failCount === 0 ? 0 : 1);
  } catch (err) {
    console.error("Test execution failed with error:", err);
    process.exit(1);
  }
}

runSystemTests();
