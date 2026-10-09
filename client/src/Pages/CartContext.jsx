import { createContext, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('grocery_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', item: null });

  useEffect(() => {
    try {
      localStorage.setItem('grocery_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const triggerToast = (product) => {
    setToast({
      show: true,
      message: `Added "${product.name}" to your basket!`,
      item: product,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => (item.product._id || item.product.id) === (product._id || product.id));
      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity;
        const newQty = Math.min(product.stock || 999, currentQty + qty);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(product.stock || 999, qty) }];
      }
    });
    triggerToast(product);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => (item.product._id || item.product.id) !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          const id = item.product._id || item.product.id;
          if (id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: Math.min(item.product.stock || 999, newQty) };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setQuantities({});
    localStorage.removeItem('grocery_cart');
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const p = item.product;
    const effectivePrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return acc + effectivePrice * item.quantity;
  }, 0);

  // Backward compatibility method
  const handleQuantityChange = (id, price, discount, value, stock) => {
    let quantity = parseInt(value) || 0;
    if (quantity > stock) quantity = stock;
    const discountedPrice = price * (1 - (discount || 0) / 100);
    setQuantities((prev) => ({
      ...prev,
      [id]: { quantity, price: discountedPrice },
    }));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        quantities,
        handleQuantityChange,
        setQuantities,
        triggerToast,
      }}
    >
      {children}

      {/* Floating Global Toast Alert Notification */}
      {toast.show && toast.item && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short transition-all duration-300">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3.5 max-w-sm sm:max-w-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Item Added To Basket</p>
              <h4 className="text-sm font-semibold text-white truncate">{toast.item.name}</h4>
              <p className="text-[11px] text-slate-400">Total Basket Items: <strong className="text-white">{totalItems}</strong></p>
            </div>

            <Link
              to="/cart"
              onClick={() => setToast({ show: false, message: '', item: null })}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Basket
            </Link>

            <button
              onClick={() => setToast({ show: false, message: '', item: null })}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);