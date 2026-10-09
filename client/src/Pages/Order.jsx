import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCart } from "./CartContext"; // Import the cart context
import apiClient from "../lib/api";

const Order = ({ selectedItems = [], totalAmount = 0, closePopup }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { setQuantities } = useCart(); // Get cart context methods

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error("Razorpay SDK failed to load");
    document.body.appendChild(script);
  }, []);

  const generateInvoice = () => {
    const doc = new jsPDF();
    doc.text("Invoice - Vishal Super Market", 14, 15);
  
    autoTable(doc, {
      head: [["Product", "Quantity", "Price", "Total"]],
      body: selectedItems.map((item) => [
        item.name,
        item.quantity,
        `₹${item.price.toFixed(2)}`,
        `₹${item.total.toFixed(2)}`,
      ]),
      startY: 25, // Ensure the table starts a bit lower than the header
    });
  
    const y = doc.lastAutoTable.finalY + 10 || 40; // Add buffer after table
  
    const spacing = 20;
    doc.text(`Total Amount: Rs.${totalAmount.toFixed(2)}`, 14, y);
    doc.text(`Customer Name: ${name}`, 14, y + spacing);
    doc.text(`Phone no : ${mobile}`, 14, y + spacing * 2);
    doc.text(`Email: ${email}`, 14, y + spacing * 3);
    doc.text(`Address: ${address}`, 14, y + spacing * 4);
  
    doc.save("invoice.pdf");
  };

  const updateStockInDatabase = async () => {
    try {
      await apiClient.put("/products/update-stock", {
        items: selectedItems.map(item => ({
          productId: item.id || item._id,
          quantity: item.quantity
        }))
      });
    } catch (error) {
      console.error("Stock update failed:", error);
      throw new Error("Failed to update product stock");
    }
  };

  const clearCart = () => {
    setQuantities({}); // Clear cart quantities
    setName("");
    setMobile("");
    setAddress("");
    setEmail("");
  };

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert("Payment system is not ready yet. Please try again in a moment.");
      return;
    }

    if (!name || !mobile || !address || !email || selectedItems.length === 0) {
      alert("Please fill all details and select items.");
      return;
    }

    const roundedTotal = parseFloat(totalAmount.toFixed(2));
    const amountInPaise = Math.round(roundedTotal * 100);

    const options = {
      key: "rzp_test_4rdgre6savrrmw",
      amount: amountInPaise,
      currency: "INR",
      name: "Vishal Super Market",
      description: "Order Payment",
      handler: async function (response) {
        try {
          // 1. Save payment details
          await apiClient.post("/payments/save-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: amountInPaise,
            customer_name: name,
            customer_email: email,
          });

          // 2. Place order
          await apiClient.post("/orders/place-order", {
            name,
            phone: mobile,
            address,
            items: selectedItems,
          });

          // 3. Update product stock
          await updateStockInDatabase();

          // 4. Generate invoice and clear cart
          generateInvoice();
          clearCart();
          
          alert("Order placed successfully!");
          if (typeof closePopup === "function") closePopup();
          
        } catch (error) {
          console.error("Order processing error:", error);
          alert(`Error: ${error.response?.data?.message || error.message}`);
        }
      },
      prefill: { name, email, contact: mobile },
      theme: { color: "#10b981" },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization failed:", error);
      alert("Failed to initialize payment gateway");
    }
  };

  return (
    <div className="p-2 max-w-3xl mx-auto bg-white rounded-lg mt-3">
      <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <textarea
        placeholder="Shipping Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      ></textarea>

      <h4 className="text-lg font-semibold mb-2">Selected Items:</h4>
      <ul className="mb-4">
        {selectedItems.map((item, index) => (
          <li key={index} className="text-gray-700">
            ✅ {item.name} — {item.quantity} × ₹{item.price} = ₹{item.total.toFixed(2)}
          </li>
        ))}
      </ul>

      <div className="text-xl font-bold mb-4">💰 Total: ₹{totalAmount.toFixed(2)}</div>

      <button
        onClick={handlePayment}
        disabled={!razorpayLoaded}
        className={`${
          razorpayLoaded
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
        } text-white px-5 py-3 rounded-lg w-full`}
      >
        {razorpayLoaded
          ? `Make Payment ₹${totalAmount.toFixed(2)}`
          : "Loading Payment Gateway..."}
      </button>
    </div>
  );
};

export default Order;
