import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateItemBonus } from '../services/WhatsAppService';

const CartContext = createContext();

const LOCAL_STORAGE_CART_KEY = 'heyba_pharma_cart_v1';
const LOCAL_STORAGE_CUSTOMER_KEY = 'heyba_pharma_customer_v1';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customerInfo, setCustomerInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOMER_KEY);
      return saved ? JSON.parse(saved) : {
        fullName: '',
        phone: '',
        pharmacyName: '',
        city: 'صنعاء',
        district: '',
        address: '',
        notes: ''
      };
    } catch {
      return {
        fullName: '',
        phone: '',
        pharmacyName: '',
        city: 'صنعاء',
        district: '',
        address: '',
        notes: ''
      };
    }
  });

  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'credit'
  const [creditDetails, setCreditDetails] = useState({
    accountOwner: '',
    creditNotes: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to persist cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOMER_KEY, JSON.stringify(customerInfo));
    } catch (e) {
      console.warn("Failed to persist customer info to localStorage", e);
    }
  }, [customerInfo]);

  const addToCart = (product, quantityToAdd = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd
        };
        return updated;
      } else {
        return [...prevCart, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalBonusUnits = cart.reduce((sum, item) => sum + calculateItemBonus(item), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        grandTotal,
        totalBonusUnits,
        customerInfo,
        setCustomerInfo,
        paymentMethod,
        setPaymentMethod,
        creditDetails,
        setCreditDetails
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
