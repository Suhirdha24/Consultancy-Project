import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { apiClient } from "../lib/api";
import { Search, ShoppingBag, Plus, Minus, Tag } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const { cartItems, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/products");
      let data = res.data;
      if (typeof data === "object" && !Array.isArray(data)) {
        data = Object.values(data).flat();
      }
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["ALL", ...new Set(products.map((p) => p.category || p.productType || "General"))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const cat = p.category || p.productType || "General";
    const matchesCat = selectedCategory === "ALL" || cat.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const getCartQty = (id) => {
    const item = cartItems.find((ci) => (ci.product._id || ci.product.id) === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Search */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Vishal Super Market</span>
            <h1 className="text-2xl font-extrabold text-slate-900">Grocery & Staples Catalog</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Select items to add to your grocery basket.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Atta, Rice, Milk, Dal, Oil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 text-slate-900 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition capitalize shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-16 text-center text-emerald-600 font-bold text-xs">Loading grocery items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No products match your search</h3>
            <p className="text-xs text-slate-400">Try searching for another grocery item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const id = product._id || product.id;
              const cartQty = getCartQty(id);
              const outOfStock = (product.stock || 0) === 0;
              const discountedPrice = product.discount
                ? product.price * (1 - product.discount / 100)
                : product.price;

              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden h-44 bg-slate-50">
                      <img
                        src={
                          product.imageUrl ||
                          product.image ||
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        {product.category || product.productType || "Grocery"}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h3>
                      {product.sku && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{discountedPrice.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs line-through text-slate-400 ml-1.5">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {outOfStock ? (
                          <span className="text-rose-600 font-bold">Out of Stock</span>
                        ) : (
                          `Stock: ${product.stock}`
                        )}
                      </span>
                    </div>

                    {/* Add to Cart Actions */}
                    <div>
                      {outOfStock ? (
                        <button
                          disabled
                          className="w-full py-2 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      ) : cartQty === 0 ? (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add to Basket
                        </button>
                      ) : (
                        <div className="flex items-center justify-between border border-emerald-500 rounded-xl overflow-hidden bg-emerald-50 p-1">
                          <button
                            onClick={() => updateQuantity(id, -1)}
                            className="p-1 text-emerald-700 hover:bg-emerald-200 rounded-lg transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-extrabold text-xs text-emerald-800">
                            {cartQty} in Basket
                          </span>
                          <button
                            onClick={() => updateQuantity(id, 1)}
                            className="p-1 text-emerald-700 hover:bg-emerald-200 rounded-lg transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
