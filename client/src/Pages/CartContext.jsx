import { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    try {
      localStorage.setItem('grocery_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);