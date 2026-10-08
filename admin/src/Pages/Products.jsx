import React, { useEffect, useState } from "react";
import { adminApiClient } from "../lib/api";
import { Package, Search, Plus, Edit, Trash2, AlertTriangle, Scan, Filter } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "vegetables",
    sku: "",
    barcode: "",
    price: "",
    costPrice: "",
    stock: "",
    minStock: 10,
    maxStock: 100,
    discount: 0,
    expiryDate: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminApiClient.get("/products");
      let data = res.data;
      if (typeof data === "object" && !Array.isArray(data)) {
        // Flat array from grouped object
        data = Object.values(data).flat();
      }
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditingId(prod._id || prod.id);
      setFormData({
        name: prod.name || "",
        category: prod.category || prod.productType || "vegetables",
        sku: prod.sku || "",
        barcode: prod.barcode || "",
        price: prod.price || "",
        costPrice: prod.costPrice || "",
        stock: prod.stock || 0,
        minStock: prod.minStock || 10,
        maxStock: prod.maxStock || 100,
        discount: prod.discount || prod.discount_percent || 0,
        expiryDate: prod.expiryDate ? prod.expiryDate.split("T")[0] : "",
        description: prod.description || "",
        imageUrl: prod.imageUrl || prod.image || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        category: "vegetables",
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        price: "",
        costPrice: "",
        stock: 50,
        minStock: 10,
        maxStock: 100,
        discount: 0,
        expiryDate: "",
        description: "",
        imageUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice || formData.price * 0.7),
        stock: Number(formData.stock),
        minStock: Number(formData.minStock),
        maxStock: Number(formData.maxStock),
        discount: Number(formData.discount),
      };

      if (editingId) {
        await adminApiClient.put(`/products/${editingId}`, payload);
      } else {
        await adminApiClient.post("/products", payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminApiClient.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.includes(search);

    const pCat = p.category || p.productType || "general";
    const matchesCat = categoryFilter === "ALL" || pCat.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-emerald-600" /> Inventory & Products
          </h1>
          <p className="text-slate-500 text-sm">
            Manage product catalog, SKU tracking, prices, and stock reorder levels.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-2 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        >
          <option value="ALL">All Categories</option>
          <option value="vegetables">Vegetables</option>
          <option value="fruits">Fruits</option>
          <option value="dairy">Dairy</option>
          <option value="bakery">Bakery</option>
          <option value="groceries">Groceries</option>
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading catalog...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search criteria or add a new item.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b">
                <tr>
                  <th className="py-3.5 px-4">Product Info</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">SKU / Barcode</th>
                  <th className="py-3.5 px-4">Retail Price</th>
                  <th className="py-3.5 px-4">Stock Level</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => {
                  const id = prod._id || prod.id;
                  const isLowStock = (prod.stock || 0) <= (prod.minStock || 10);

                  return (
                    <tr key={id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={prod.imageUrl || prod.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                        />
                        <div>
                          <h4 className="font-bold text-slate-800">{prod.name}</h4>
                          {prod.discount > 0 && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                              {prod.discount}% Off
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 capitalize font-medium text-slate-600">
                        {prod.category || prod.productType || "Grocery"}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                        <div>{prod.sku || "N/A"}</div>
                        <div className="text-[10px] text-slate-400">{prod.barcode || ""}</div>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                        ₹{(prod.price || 0).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              isLowStock ? "text-rose-600" : "text-slate-800"
                            }`}
                          >
                            {prod.stock || 0}
                          </span>
                          {isLowStock && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                              <AlertTriangle className="w-3 h-3" /> Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(prod)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Product" : "Add New Inventory Product"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dairy">Dairy</option>
                    <option value="bakery">Bakery</option>
                    <option value="groceries">Groceries</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Max Level</label>
                  <input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md"
                >
                  {editingId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
