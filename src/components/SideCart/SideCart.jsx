import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from './SideCart.module.css';

const SideCart = () => {
  const { isCartOpen, closeCart, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout'); // Rota que criaremos no futuro
  };

  return (
    <>
      {/* Fundo escuro que fecha o carrinho ao clicar fora */}
      <div className={styles.overlay} onClick={closeCart} />
      
      {/* Janela do Carrinho */}
      <div className={`${styles.cartContainer} ${isCartOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>O seu carrinho</h2>
          <button onClick={closeCart} className={styles.closeBtn} aria-label="Fechar carrinho">
            <X size={24} />
          </button>
        </div>

        <div className={styles.itemsList}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyMsg}>
              <p>O seu carrinho está vazio.</p>
              <button onClick={closeCart} className={styles.continueBtn}>Continuar a comprar</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  {/* Substituir pela imagem real do produto */}
                  <span>Img</span>
                </div>
                
                <div className={styles.itemDetails}>
                  <h4>{item.name}</h4>
                  <p className={styles.price}>R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  
                  <div className={styles.quantityControl}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Diminuir">
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Aumentar">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn} aria-label="Remover item">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Subtotal:</span>
              <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <button onClick={handleCheckout} className={styles.checkoutBtn}>
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideCart;