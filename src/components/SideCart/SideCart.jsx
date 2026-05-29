import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext'; // Importando o Toast
import { useNavigate } from 'react-router-dom';
import styles from './SideCart.module.css';

const SideCart = () => {
  const { isCartOpen, closeCart, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout'); 
  };

  const handleIncrease = (item) => {
    const currentQty = item.quantidade || item.quantity || 1;
    
    // Feedback visual direto se o limite de estoque foi alcançado
    if (item.estoque !== undefined && currentQty >= item.estoque) {
      addToast(`Limite atingido! Só temos ${item.estoque} unidades disponíveis.`, 'warning');
      return;
    }
    
    updateQuantity(item.id, currentQty + 1);
  };

  return (
    <>
      <div className={styles.overlay} onClick={closeCart} />
      
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
            cartItems.map((item) => {
              const qtdAtual = item.quantidade || item.quantity || 1;
              const isMaxStock = item.estoque !== undefined && qtdAtual >= item.estoque;

              return (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img 
                      src={item.image_url || "https://via.placeholder.com/60"} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <p className={styles.price}>R$ {(item.price || 0).toFixed(2).replace('.', ',')}</p>
                    
                    <div className={styles.quantityControl}>
                      <button 
                        onClick={() => updateQuantity(item.id, qtdAtual - 1)} 
                        aria-label="Diminuir"
                      >
                        <Minus size={14} />
                      </button>
                      
                      <span>{qtdAtual}</span>
                      
                      <button 
                        onClick={() => handleIncrease(item)} 
                        aria-label="Aumentar"
                        disabled={isMaxStock}
                        style={{ cursor: isMaxStock ? 'not-allowed' : 'pointer', opacity: isMaxStock ? 0.3 : 1 }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn} aria-label="Remover item">
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })
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