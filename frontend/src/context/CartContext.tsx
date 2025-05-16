import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.productId === item.productId);
      if (existing) {
        return prev.map(ci =>
          ci.productId === item.productId
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(ci => ci.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prev =>
      prev.map(ci =>
        ci.productId === productId ? { ...ci, quantity } : ci
      ).filter(ci => ci.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getCartSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount, getCartSubtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
