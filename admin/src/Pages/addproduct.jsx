import React, { useState } from 'react';
import apiClient from '../lib/api';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    desc: '',
    price: '',
    image: '',
    type: '',
    discount_percent: '',
    stock: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/products/add-product', {
        name: form.name,
        desc: form.desc,
        price: parseFloat(form.price),
        image: form.image,
        type: form.type,
        discount_percent: form.discount_percent ? parseFloat(form.discount_percent) : 0,
        stock: form.stock ? parseInt(form.stock) : 0,
      });
      setMessage('✅ Product added successfully!');
      setForm({
        name: '',
        desc: '',
        price: '',
        image: '',
        type: '',
        discount_percent: '',
        stock: '',
      });
    } catch (error) {
      setMessage('❌ Failed to add product');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Product</h2>
        {message && (
          <div className="mb-4 text-sm font-medium text-green-600">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Discount (%)</label>
            <input
              type="number"
              name="discount_percent"
              value={form.discount_percent}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700">Stock Available</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
