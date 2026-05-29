import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const carregarBanco = async () => {
        try {
          const data = await apiFetch('/cart'); // ou '/carrinho' dependendo do seu backend
          setCartItems(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error(error);
        }
      };
      carregarBanco();
    } else {
      const carrinhoSalvo = localStorage.getItem('@Kalane:cart');
      if (carrinhoSalvo) setCartItems(JSON.parse(carrinhoSalvo));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('@Kalane:cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (produto, quantidade) => {
    // 1ª TRAVA: Verifica se a soma do que já tem no carrinho + o que está sendo adicionado passa do estoque
    const itemExistente = cartItems.find((item) => item.id === produto.id);
    const qtdAtual = itemExistente ? (itemExistente.quantidade || itemExistente.quantity || 0) : 0;

    if (produto.estoque !== undefined && (qtdAtual + quantidade > produto.estoque)) {
      addToast(`Estoque insuficiente! Você já tem ${qtdAtual} no carrinho e o limite é ${produto.estoque}.`, 'warning');
      return; // Interrompe a função aqui, não deixa adicionar
    }

    try {
      if (user) {
        await apiFetch('/cart', {
          method: 'POST',
          body: JSON.stringify({ product_id: produto.id, quantity: qtdAtual + quantidade }),
        });
        const data = await apiFetch('/cart');
        setCartItems(Array.isArray(data) ? data : []);
      } else {
        setCartItems((prev) => {
          if (itemExistente) {
            return prev.map((item) =>
              item.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item
            );
          }
          // Salvamos todo o objeto do produto (incluindo o estoque) no carrinho local
          return [...prev, { ...produto, quantidade }];
        });
      }
      addToast(`${produto.name} adicionado ao carrinho!`, 'success');
      setIsCartOpen(true);
    } catch (error) {
      addToast('Erro ao adicionar produto.', 'error');
    }
  };

  const removeFromCart = async (produtoId) => {
    try {
      if (user) {
        await apiFetch(`/cart/${produtoId}`, { method: 'DELETE' });
      }
      setCartItems((prev) => prev.filter((item) => item.id !== produtoId));
      addToast('Produto removido.', 'info');
    } catch (error) {
      addToast('Erro ao remover produto.', 'error');
    }
  };

  const updateQuantity = async (produtoId, quantidade) => {
    if (quantidade <= 0) return removeFromCart(produtoId);

    // 2ª TRAVA: Bloqueia alterações feitas pelos botões de + e -
    const item = cartItems.find((i) => i.id === produtoId);
    if (item && item.estoque !== undefined && quantidade > item.estoque) {
      addToast(`Limite atingido! Temos apenas ${item.estoque} unidades disponíveis.`, 'warning');
      return;
    }

    try {
      if (user) {
        await apiFetch(`/cart/${produtoId}`, {
          method: 'PATCH',
          body: JSON.stringify({ quantity: quantidade }),
        });
      }
      
      setCartItems((prev) =>
        prev.map((i) => (i.id === produtoId ? { ...i, quantidade } : i))
      );
    } catch (error) {
      addToast('Erro ao atualizar quantidade.', 'error');
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await apiFetch('/cart/clear', { method: 'DELETE' });
      } catch (error) {
        console.error(error);
      }
    } else {
      localStorage.removeItem('@Kalane:cart');
    }
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantidade || item.quantity || 1), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantidade || item.quantity || 1), 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{ cartItems, isCartOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, toggleCart: () => setIsCartOpen(!isCartOpen) }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);