import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext'; // Importante para saber o usuário logado
import { apiFetch } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addToast } = useToast();
  const { user } = useAuth();

  // Variáveis calculadas
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Controle Visual do Carrinho
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // 1. Buscar carrinho do banco de dados
  const fetchCart = async () => {
    try {
      const data = await apiFetch('/carrinho');
      const itensFormatados = data.map((item) => ({
        id: item.products.id,
        name: item.products.name,
        price: item.products.price,
        image_url: item.products.image_url,
        quantity: item.quantity,
      }));
      setCartItems(itensFormatados);
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
    }
  };

  // Carrega os itens automaticamente quando o usuário loga
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  // 2. Adicionar produto ao carrinho (salvando no banco)
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      addToast('Faça login para adicionar produtos.', 'error');
      return;
    }

    const itemExistente = cartItems.find((item) => item.id === product.id);
    const novaQuantidade = itemExistente ? itemExistente.quantity + quantity : quantity;

    try {
      // Salva no backend
      await apiFetch('/carrinho', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id, quantity: novaQuantidade }),
      });
      
      // Atualiza a lista na tela e abre a barra lateral
      await fetchCart();
      addToast(`${product.name} adicionado ao carrinho!`, 'success');
      openCart(); 
    } catch (error) {
      console.error(error);
      addToast('Erro ao adicionar produto.', 'error');
    }
  };

  // 3. Remover produto do carrinho
  const removeFromCart = async (productId) => {
    try {
      await apiFetch(`/carrinho/${productId}`, {
        method: 'DELETE',
      });
      // Remove da tela imediatamente
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    } catch (error) {
      addToast('Erro ao remover produto.', 'error');
    }
  };

  // 4. Atualizar quantidade (Botões de + e - dentro do SideCart)
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    // Atualiza a tela primeiro para o usuário não sentir lentidão (Optimistic UI)
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      // Salva a nova quantidade no banco
      await apiFetch('/carrinho', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: newQuantity }),
      });
    } catch (error) {
      // Se a API falhar, busca os dados reais de volta
      fetchCart();
      addToast('Erro ao alterar quantidade.', 'error');
    }
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
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);