import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface Order {
  id?: string; // Die ID der Bestellung aus der Datenbank
  cartItems: CartItem[];
  roomNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  note:string;
}

interface CartContextData {
  cartItems: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, quantityChange: number) => void;
  calculateTotal: () => number;
  resetCart: () => void;
}

const CartContext = createContext<CartContextData>({
  cartItems: [],
  resetCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItem: () => {},
  calculateTotal: () => 0,

});

interface CartProviderProps {
  children: ReactNode; // Dies definiert den Typ für children
}

// Erstellen Sie einen Provider, um den Zustand und die Updater-Funktionen bereitzustellen
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);


  const addToCart = (newItem: CartItem) => {
    setCartItems(currentItems => {
      const itemIndex = currentItems.findIndex(item => item.id === newItem.id);
      if (itemIndex > -1) {
        // Artikel existiert bereits im Warenkorb, erhöhen Sie die Menge
        const updatedItems = [...currentItems];
        updatedItems[itemIndex].quantity += newItem.quantity || 1; // Fallback zu 1, wenn keine quantity definiert ist
        return updatedItems;
      } else {
        // Stellen Sie sicher, dass newItem.quantity einen gültigen Wert hat
        const newItemWithQuantity = { ...newItem, quantity: newItem.quantity || 1 };
        // Artikel ist neu im Warenkorb
        return [...currentItems, newItemWithQuantity];
      }
    });
  };
  

  const removeFromCart = (id: string) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateCartItem = (id: string, quantityChange: number) => {
    setCartItems(currentItems => {
      return currentItems.map(item => {
        if (item.id === id) {
          // Stellen Sie sicher, dass die quantity nicht negativ wird
          const newQuantity = Math.max(item.quantity + quantityChange, 0);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // Entferne Artikel mit Menge 0
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const resetCart = () => {
    setCartItems([]); // Leert den Warenkorb
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem, calculateTotal, resetCart  }}>
      {children}
    </CartContext.Provider>
  );
};

// Verwenden Sie einen benutzerdefinierten Hook, um auf den Warenkorbkontext zuzugreifen
export const useCart = () => useContext(CartContext);
