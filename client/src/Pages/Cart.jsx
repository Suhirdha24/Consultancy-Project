import React, { useState } from "react";
import axios from "axios";

const Cart = ({ cart, setCart }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Handle input change for user details
  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Increase or decrease item quantity
  const updateQuantity = (id, amount) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    );
    setCart(updatedCart);
  };

  // Place order
  const handleBookNow = async () => {
    if (!userDetails.name || !userDetails.phone || !userDetails.address) {
      alert("Please fill in all details!");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders/place-order", {
        ...userDetails,
        items: cart,
      });
      setOrderPlaced(true);
      setCart([]); // Clear cart after order placement
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="border p-2">
              {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="bg-blue-500 text-white px-2 ml-2"
              >
                +
              </button>
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="bg-red-500 text-white px-2 ml-2"
              >
                -
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* User details input */}
      <div className="mt-5">
        <h3 className="text-xl font-bold">Enter Your Details</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 block w-full mt-2"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="border p-2 block w-full mt-2"
          onChange={handleInputChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          className="border p-2 block w-full mt-2"
          onChange={handleInputChange}
        />
      </div>

      {/* Book Now Button */}
      <button
        onClick={handleBookNow}
        className="mt-5 bg-green-500 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>

      {/* Success message */}
      {orderPlaced && <p className="text-green-500 mt-3">Order Placed Successfully!</p>}
    </div>
  );
};

export default Cart;
