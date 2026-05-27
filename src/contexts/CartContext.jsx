import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToast } = useToast();

  // Calcula o valor total do carrinho sempre que os itens mudam
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Adicionar produto ao carrinho
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      
      if (itemExists) {
        // Se já existe, atualiza a quantidade
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Se não existe, adiciona novo
      return [...prevItems, { ...product, quantity }];
    });
    addToast(`${product.name} adicionado ao carrinho!`, 'success');
    openCart(); // Abre o carrinho automaticamente ao adicionar
  };

  // Remover produto do carrinho
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Atualizar quantidade de um produto específico
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartTotal, 
      cartCount,
      isCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      toggleCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);