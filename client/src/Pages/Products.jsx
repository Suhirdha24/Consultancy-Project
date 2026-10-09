import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { apiClient } from "../lib/api";
import { Search, ShoppingBag, Plus, Minus, Check, Tag } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-emerald-600" /> Explore Grocery Store
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Farm fresh produce, dairy, bakery, and essential groceries delivered in minutes.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search produce, milk, rice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-emerald-600">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No products match your search</h3>
            <p className="text-xs text-gray-500">Try searching for a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative">
                    <img
                      src={
                        product.imageUrl ||
                        product.image ||
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover bg-gray-50 dark:bg-slate-700"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {product.category || product.productType || "Grocery"}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-1">
                        {product.name}
                      </h3>
                      {product.sku && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {product.sku}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t dark:border-slate-700">
                      <div>
                        <span className="text-lg font-extrabold text-emerald-600">
                          ₹{discountedPrice.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs line-through text-gray-400 ml-1.5 font-normal">
                            ₹{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {outOfStock ? (
                          <strong className="text-rose-600">Out of Stock</strong>
                        ) : (
                          `${product.stock} left`
                        )}
                      </span>
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="pt-1">
                      {outOfStock ? (
                        <button
                          disabled
                          className="w-full py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-400 font-bold rounded-xl text-xs cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      ) : cartQty === 0 ? (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add to Cart
                        </button>
                      ) : (
                        <div className="flex items-center justify-between border border-emerald-500 rounded-xl overflow-hidden bg-emerald-50 dark:bg-emerald-950/40 p-1">
                          <button
                            onClick={() => updateQuantity(id, -1)}
                            className="p-1.5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200/50 rounded-lg transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-extrabold text-sm text-emerald-800 dark:text-emerald-300">
                            {cartQty} in Cart
                          </span>
                          <button
                            onClick={() => updateQuantity(id, 1)}
                            className="p-1.5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200/50 rounded-lg transition"
                          >
                            <Plus className="w-4 h-4" />
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
