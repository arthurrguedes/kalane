import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext'; // <- Importando o Toast
import { apiFetch } from '../../services/api'; // <- Importando o apiFetch
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Estados para o endereço de entrega
  const [morada, setMorada] = useState({
    codigoPostal: '',
    rua: '',
    numero: '',
    cidade: '',
  });

  // Estados para o pagamento
  const [pagamento, setPagamento] = useState({
    numeroCartao: '',
    nomeTitular: '',
    validade: '',
    cvv: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Se o carrinho estiver vazio, redireciona para a loja
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <h2>O seu carrinho está vazio</h2>
        <p>Adicione produtos antes de prosseguir para o checkout.</p>
        <button onClick={() => navigate('/produtos')} className={styles.btnPrimary}>
          Voltar à Loja
        </button>
      </div>
    );
  }

  const handleFinalizarEncomenda = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    // Validação básica do formulário
    if (!morada.codigoPostal || !morada.rua || !pagamento.numeroCartao) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Envia os dados para a nossa API no backend criar o pedido
      const response = await apiFetch('/pedidos/checkout', {
        method: 'POST',
        body: JSON.stringify({
          delivery_address: morada,
          payment_method: 'Cartão de Crédito', // Fixo por enquanto, conforme seu layout
        }),
      });
      
      // 2. Avisa que deu tudo certo
      addToast('Pedido finalizado com sucesso!', 'success');
      
      // 3. Limpa o carrinho local da tela
      clearCart();
      
      // 4. Redireciona para o Perfil, abrindo diretamente a aba de Pedidos
      navigate('/perfil', { state: { tab: 'pedidos' } }); 

    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao processar o seu pagamento. Tente novamente.');
      addToast('Erro ao finalizar pedido', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const taxaEntrega = 15.00; // Valor fixo de exemplo
  const totalFinal = cartTotal + taxaEntrega;

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.pageTitle}>Finalizar Encomenda</h1>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleFinalizarEncomenda} className={styles.checkoutGrid}>
        
        {/* COLUNA ESQUERDA: Formulários */}
        <div className={styles.formsSection}>
          
          {/* Seção de Entrega */}
          <section className={styles.formCard}>
            <div className={styles.cardHeader}>
              <Truck size={24} className={styles.icon} />
              <h2>Endereço de Entrega</h2>
            </div>
            
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label>Código Postal</label>
                <input 
                  type="text" 
                  value={morada.codigoPostal}
                  onChange={(e) => setMorada({...morada, codigoPostal: e.target.value})}
                  placeholder="00000-000"
                  required
                />
              </div>
              <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                <label>Rua / Avenida</label>
                <input 
                  type="text" 
                  value={morada.rua}
                  onChange={(e) => setMorada({...morada, rua: e.target.value})}
                  placeholder="Ex: Rua das Flores"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Número</label>
                <input 
                  type="text" 
                  value={morada.numero}
                  onChange={(e) => setMorada({...morada, numero: e.target.value})}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Cidade</label>
                <input 
                  type="text" 
                  value={morada.cidade}
                  onChange={(e) => setMorada({...morada, cidade: e.target.value})}
                  required
                />
              </div>
            </div>
          </section>

          {/* Seção de Pagamento */}
          <section className={styles.formCard}>
            <div className={styles.cardHeader}>
              <CreditCard size={24} className={styles.icon} />
              <h2>Pagamento Seguro</h2>
            </div>
            
            <div className={styles.inputGrid}>
              <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                <label>Número do Cartão</label>
                <input 
                  type="text" 
                  value={pagamento.numeroCartao}
                  onChange={(e) => setPagamento({...pagamento, numeroCartao: e.target.value})}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  required
                />
              </div>
              <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                <label>Nome do Titular</label>
                <input 
                  type="text" 
                  value={pagamento.nomeTitular}
                  onChange={(e) => setPagamento({...pagamento, nomeTitular: e.target.value})}
                  placeholder="Tal como impresso no cartão"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Validade (MM/AA)</label>
                <input 
                  type="text" 
                  value={pagamento.validade}
                  onChange={(e) => setPagamento({...pagamento, validade: e.target.value})}
                  placeholder="MM/AA"
                  maxLength="5"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>CVV</label>
                <input 
                  type="text" 
                  value={pagamento.cvv}
                  onChange={(e) => setPagamento({...pagamento, cvv: e.target.value})}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA: Resumo */}
        <aside className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2>Resumo da Encomenda</h2>
            
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemQtd}>{item.quantity}x</span>
                    <span className={styles.itemName}>{item.name}</span>
                  </div>
                  <span className={styles.itemPrice}>
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.totalsList}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Entrega</span>
                <span>R$ {taxaEntrega.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total a Pagar</span>
                <span>R$ {totalFinal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={isProcessing}
            >
              {isProcessing ? 'A processar pagamento...' : 'Confirmar Pagamento'}
            </button>

            <div className={styles.secureNotice}>
              <ShieldCheck size={16} />
              <span>Ambiente 100% Seguro. Os seus dados estão protegidos.</span>
            </div>
          </div>
        </aside>

      </form>
    </div>
  );
};

export default Checkout;