import React, { useEffect, useState } from 'react';
import { CartContext } from './CartContext';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 🛒 Add to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // 🗑️ Remove
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // 🔢 Set exact quantity (base function)
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  // ============================================================
  // 👇 NAYE COMMON FUNCTIONS — har component me use kar sakte ho
  // ============================================================

  // ➕ Increase by 1 (stock limit check ke saath)
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;
        // stock limit
        if (item.quantity >= item.stock) return item;
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  // ➖ Decrease by 1 (agar 1 pe hai toh remove)
  const decreaseQty = (id) => {
    setCart((prev) => {
      const item = prev.find((i) => i._id === id);
      if (!item) return prev;
      // 1 pe − karo → poora hata do
      if (item.quantity <= 1) {
        return prev.filter((i) => i._id !== id);
      }
      return prev.map((i) =>
        i._id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  // 🔍 Kya cart me hai? (helper)
  const isInCart = (id) => cart.some((item) => item._id === id);

  // 🔢 Kisi product ki quantity
  const getQty = (id) => cart.find((item) => item._id === id)?.quantity || 0;

  // 🧹 Clear cart
  const clearCart = () => setCart([]);

  // 💰 Totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQty,       
        decreaseQty,      
        isInCart,          
        getQty,            
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}