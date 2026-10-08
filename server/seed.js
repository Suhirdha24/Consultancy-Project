const Product = require("./models/ProductModel");
const Supplier = require("./models/Supplier");
const User = require("./models/User");
const Order = require("./models/OrderModel");
const InventoryTransaction = require("./models/InventoryTransaction");
const bcrypt = require("bcrypt");

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("🌱 Seeding default Admin and Customer accounts...");
      const adminPass = await bcrypt.hash("admin123", 10);
      const custPass = await bcrypt.hash("user123", 10);

      await User.create([
        { username: "admin", email: "admin@grocery.com", password: adminPass, role: "admin" },
        { username: "john_doe", email: "john@example.com", password: custPass, role: "customer" },
      ]);
    }

    const supplierCount = await Supplier.countDocuments();
    let suppliers = [];
    if (supplierCount === 0) {
      console.log("🌱 Seeding default Suppliers...");
      suppliers = await Supplier.create([
        {
          name: "Fresh Farm Organic Supplies",
          contactPerson: "Rajesh Kumar",
          phone: "+91 98765 43210",
          email: "supplies@freshfarm.in",
          address: "Sector 14, APMC Market, Bengaluru",
          categoriesSupplied: ["Dairy & Eggs", "Fruits & Vegetables"],
        },
        {
          name: "Royal Grains & Spices Ltd",
          contactPerson: "Anita Sharma",
          phone: "+91 98123 45678",
          email: "orders@royalgrains.com",
          address: "Grains Exchange, APMC Yard, Mumbai",
          categoriesSupplied: ["Atta & Flours", "Rice & Grains", "Spices & Masalas"],
        },
        {
          name: "Aroma Beverages & Snacks",
          contactPerson: "Suresh Menon",
          phone: "+91 99887 76655",
          email: "distributor@aromabev.com",
          address: "Industrial Estate, Chennai",
          categoriesSupplied: ["Beverages", "Snacks & Munchies"],
        },
      ]);
    } else {
      suppliers = await Supplier.find();
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("🌱 Seeding initial Grocery Product catalog...");
      const sup1 = suppliers[0]?._id;
      const sup2 = suppliers[1]?._id;
      const sup3 = suppliers[2]?._id;

      const now = new Date();

      const sampleProducts = [
        {
          name: "Amul Taaza Toned Milk 1L",
          desc: "Pasteurised toned milk with essential nutrients and vitamins.",
          price: 66,
          costPrice: 58,
          productType: "Dairy & Eggs",
          brand: "Amul",
          sku: "MILK-AMUL-01",
          barcode: "8901262010011",
          discount_percent: 5,
          stock: 45,
          minStock: 15,
          maxStock: 100,
          unit: "L",
          supplierId: sup1,
          batchNumber: "B2026-MILK",
          expiryDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "India Gate Sona Masoori Rice 5kg",
          desc: "Aromatic premium quality aged Sona Masoori rice.",
          price: 340,
          costPrice: 280,
          productType: "Rice & Grains",
          brand: "India Gate",
          sku: "RICE-IG-5KG",
          barcode: "8901262020028",
          discount_percent: 10,
          stock: 4,
          minStock: 10,
          maxStock: 50,
          unit: "pack",
          supplierId: sup2,
          batchNumber: "B2026-RICE",
          expiryDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "Organic Fresh Cavendish Bananas 1kg",
          desc: "Fresh, sweet naturally ripened Cavendish bananas.",
          price: 60,
          costPrice: 40,
          productType: "Fruits & Vegetables",
          brand: "FreshFarm",
          sku: "FRUIT-BANANA-1KG",
          barcode: "8901262030035",
          discount_percent: 0,
          stock: 20,
          minStock: 8,
          maxStock: 40,
          unit: "kg",
          supplierId: sup1,
          batchNumber: "B2026-BANANA",
          expiryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "Fortune Sunlite Sunflower Oil 1L",
          desc: "Refined sunflower oil rich in Vitamin E & Omega-6.",
          price: 145,
          costPrice: 120,
          productType: "Oils & Ghee",
          brand: "Fortune",
          sku: "OIL-FORTUNE-1L",
          barcode: "8901262040042",
          discount_percent: 8,
          stock: 3,
          minStock: 12,
          maxStock: 60,
          unit: "L",
          supplierId: sup2,
          batchNumber: "B2026-OIL",
          expiryDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "Tata Salt Vacuum Evaporated 1kg",
          desc: "Iodised salt essential for daily wholesome cooking.",
          price: 28,
          costPrice: 22,
          productType: "Spices & Masalas",
          brand: "Tata",
          sku: "SALT-TATA-1KG",
          barcode: "8901262050059",
          discount_percent: 0,
          stock: 80,
          minStock: 20,
          maxStock: 150,
          unit: "kg",
          supplierId: sup2,
          batchNumber: "B2026-SALT",
          expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1518110165387-952869c4f3ab?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "Britannia Good Day Butter Cookies 200g",
          desc: "Rich buttery crunchy cookies perfect with tea.",
          price: 40,
          costPrice: 30,
          productType: "Snacks & Munchies",
          brand: "Britannia",
          sku: "SNACK-GOODDAY-200G",
          barcode: "8901262060066",
          discount_percent: 12,
          stock: 50,
          minStock: 15,
          maxStock: 100,
          unit: "pack",
          supplierId: sup3,
          batchNumber: "B2026-GDAY",
          expiryDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "Nescafe Classic Instant Coffee 100g",
          desc: "100% pure natural coffee beans roasted for rich aroma.",
          price: 310,
          costPrice: 250,
          productType: "Beverages",
          brand: "Nescafe",
          sku: "BEV-NESCAFE-100G",
          barcode: "8901262070073",
          discount_percent: 15,
          stock: 0,
          minStock: 10,
          maxStock: 40,
          unit: "jar",
          supplierId: sup3,
          batchNumber: "B2026-NES",
          expiryDate: new Date(now.getTime() + 150 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80",
        },
        {
          name: "Aashirvaad Shuddh Chakki Atta 5kg",
          desc: "100% pure whole wheat flour for soft rotis.",
          price: 245,
          costPrice: 210,
          productType: "Atta & Flours",
          brand: "Aashirvaad",
          sku: "ATTA-AASH-5KG",
          barcode: "8901262080080",
          discount_percent: 6,
          stock: 22,
          minStock: 10,
          maxStock: 60,
          unit: "pack",
          supplierId: sup2,
          batchNumber: "B2026-ATTA",
          expiryDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
        },
      ];

      const createdProds = await Product.create(sampleProducts);

      for (const p of createdProds) {
        if (p.stock > 0) {
          await InventoryTransaction.create({
            productId: p._id,
            type: "PURCHASE",
            quantity: p.stock,
            previousStock: 0,
            newStock: p.stock,
            referenceId: "INIT-" + p._id,
            note: "Initial stock load during system seed",
            createdBy: "System",
          });
        }
      }

      console.log("🌱 Seeding demo order transactions...");
      const order1 = new Order({
        orderId: "ORD-100801",
        name: "Rahul Verma",
        phone: "+91 98765 11111",
        email: "rahul@example.com",
        address: "42 MG Road, Indiranagar, Bengaluru",
        items: [
          { productId: createdProds[0]._id, name: createdProds[0].name, quantity: 2, price: 66, discount: 5, total: 125.4 },
          { productId: createdProds[1]._id, name: createdProds[1].name, quantity: 1, price: 340, discount: 10, total: 306 },
        ],
        subtotal: 431.4,
        totalAmount: 431.4,
        paymentStatus: "PAID",
        orderStatus: "DELIVERED",
      });
      await order1.save();

      const order2 = new Order({
        orderId: "ORD-100802",
        name: "Priya Sundaram",
        phone: "+91 98765 22222",
        email: "priya@example.com",
        address: "78 Park Street, Koramangala, Bengaluru",
        items: [
          { productId: createdProds[2]._id, name: createdProds[2].name, quantity: 3, price: 60, discount: 0, total: 180 },
          { productId: createdProds[4]._id, name: createdProds[4].name, quantity: 2, price: 28, discount: 0, total: 56 },
        ],
        subtotal: 236,
        totalAmount: 236,
        paymentStatus: "PAID",
        orderStatus: "OUT_FOR_DELIVERY",
      });
      await order2.save();
    }
  } catch (err) {
    console.error("Error running database seed:", err.message);
  }
};

module.exports = seedData;
