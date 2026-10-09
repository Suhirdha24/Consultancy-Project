import React, { useEffect, useState } from "react";
import apiClient from "../lib/api";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", quantity: "" });

  // Fetch orders
  useEffect(() => {
    apiClient.get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));

    apiClient.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Handle product input change
  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Add new product
  const addProduct = () => {
    apiClient.post("/products/add-product", newProduct)
      .then((res) => {
        setProducts([...products, res.data]);
        setNewProduct({ name: "", price: "", quantity: "" });
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  // Remove product
  const removeProduct = (id) => {
    apiClient.delete(`/products/${id}`)
      .then(() => setProducts(products.filter((product) => product._id !== id)))
      .catch((err) => console.error("Error deleting product:", err));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>

      {/* Orders Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Orders</h3>
        {orders.length === 0 ? <p>No orders yet.</p> : (
          <ul className="border p-4 rounded-lg">
            {orders.map((order) => (
              <li key={order._id} className="border-b py-2">
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Items:</strong> {order.items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Product Management Section */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Manage Products</h3>
        <ul className="border p-4 rounded-lg">
          {products.map((product) => (
            <li key={product._id} className="border-b py-2 flex justify-between items-center">
              <p>{product.name} - ₹{product.price} (Qty: {product.quantity})</p>
              <button onClick={() => removeProduct(product._id)} className="text-red-500">Remove</button>
            </li>
          ))}
        </ul>

        {/* Add New Product */}
        <div className="mt-4 border p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Add Product</h4>
          <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleInputChange} className="border p-2 w-full mb-2" />
          <input type="text" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} className="border p-2 w-full mb-2" />
          <input type="text" name="quantity" placeholder="Quantity" value={newProduct.quantity} onChange={handleInputChange} className="border p-2 w-full mb-2" />
          <button onClick={addProduct} className="bg-green-500 text-white px-4 py-2">Add Product</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
