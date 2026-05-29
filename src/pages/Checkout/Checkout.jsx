import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiFetch } from '../../services/api';
import { Tag, Check, X, Loader } from 'lucide-react';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  // 1. Estados do Formulário (Agora atende Logados e Visitantes)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    endereco: '',
    cep: '',
  });

  // 2. Estados do Cupom
  const [cupomInput, setCupomInput] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [validandoCupom, setValidandoCupom] = useState(false);
  const [processandoCompra, setProcessandoCompra] = useState(false);

  // Se o usuário estiver logado, já preenchemos os dados conhecidos
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        // Se você tiver o nome/telefone no contexto do usuário, coloque aqui:
        // nome: user.nome || '', 
      }));
    }
  }, [user]);

  // Redireciona se o carrinho estiver vazio
  useEffect(() => {
    if (cartItems.length === 0 && !processandoCompra) {
      navigate('/produtos');
    }
  }, [cartItems, navigate, processandoCompra]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Se o cliente mudar o e-mail, removemos o cupom por segurança
    // (para ele não validar com um e-mail e comprar com outro)
    if (e.target.name === 'email' && cupomAplicado) {
      setCupomAplicado(null);
      addToast('Cupom removido porque o e-mail foi alterado.', 'info');
    }
  };

  // 3. Lógica de Validação do Cupom
  const handleAplicarCupom = async () => {
    if (!cupomInput.trim()) return;
    
    if (!formData.email.trim()) {
      addToast('Por favor, preencha seu e-mail antes de aplicar o cupom.', 'warning');
      return;
    }

    setValidandoCupom(true);
    try {
      const response = await apiFetch('/cupons/validar', {
        method: 'POST',
        body: JSON.stringify({ 
          codigo: cupomInput, 
          emailCliente: formData.email 
        }),
      });

      setCupomAplicado({
        id: response.id,
        codigo: response.codigo,
        percentual: response.percentual
      });
      addToast(`Cupom de ${response.percentual}% aplicado!`, 'success');
      setCupomInput(''); // Limpa o input
    } catch (error) {
      addToast(error.message || 'Cupom inválido.', 'error');
      setCupomAplicado(null);
    } finally {
      setValidandoCupom(false);
    }
  };

  const handleRemoverCupom = () => {
    setCupomAplicado(null);
    addToast('Cupom removido.', 'info');
  };

  // 4. Matemática do Carrinho
  const valorDesconto = cupomAplicado 
    ? (cartTotal * (cupomAplicado.percentual / 100)) 
    : 0;
  const valorFinal = cartTotal - valorDesconto;

  // 5. Finalização da Compra
  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.whatsapp) {
      addToast('Preencha os dados de contato obrigatórios.', 'warning');
      return;
    }

    setProcessandoCompra(true);

    try {
      // Como você pode ter vários itens no carrinho, idealmente seu backend 
      // recebe um array de itens. Aqui simulamos o envio.
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          cliente: {
            nome: formData.nome,
            email: formData.email,
            whatsapp: formData.whatsapp,
            endereco: formData.endereco,
            cep: formData.cep
          },
          itens: cartItems.map(item => ({
            produtoId: item.id,
            quantidade: item.quantidade || 1
          })),
          cupomId: cupomAplicado?.id || null, // Manda o ID do cupom se houver
          totalPago: valorFinal
        }),
      });

      addToast('Pedido realizado com sucesso!', 'success');
      clearCart();
      navigate('/sucesso'); // Crie uma página de sucesso depois!

    } catch (error) {
      addToast(error.message || 'Erro ao processar o pedido.', 'error');
    } finally {
      setProcessandoCompra(false);
    }
  };

  if (cartItems.length === 0 && !processandoCompra) return null;

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutGrid}>
        
        {/* COLUNA ESQUERDA: DADOS DO CLIENTE */}
        <section className={styles.formSection}>
          <h2>Finalizar Compra</h2>
          {!user && (
            <div className={styles.guestNotice}>
              Você está comprando como visitante. <a href="/login">Faça login</a> para salvar seu histórico.
            </div>
          )}

          <form id="checkout-form" onSubmit={handleFinalizarCompra} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Nome Completo *</label>
              <input type="text" name="nome" required value={formData.nome} onChange={handleInputChange} />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>E-mail *</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email} 
                  onChange={handleInputChange}
                  disabled={!!user} // Trava o e-mail se já estiver logado
                />
              </div>
              <div className={styles.inputGroup}>
                <label>WhatsApp *</label>
                <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} placeholder="(11) 99999-9999" />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>CEP</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} />
              </div>
              <div className={styles.inputGroup} style={{ flex: 2 }}>
                <label>Endereço Completo</label>
                <input type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} />
              </div>
            </div>
          </form>
        </section>

        {/* COLUNA DIREITA: RESUMO E CUPOM */}
        <aside className={styles.summarySection}>
          <h3>Resumo do Pedido</h3>
          
          <div className={styles.itemsList}>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.summaryItem}>
                <span>{item.quantidade || 1}x {item.name}</span>
                <span>R$ {(item.price * (item.quantidade || 1)).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>

          {/* SESSÃO DE CUPOM */}
          <div className={styles.couponSection}>
            <label><Tag size={16} /> Cupom de Desconto</label>
            
            {!cupomAplicado ? (
              <div className={styles.couponInputWrapper}>
                <input 
                  type="text" 
                  placeholder="Digite seu código"
                  value={cupomInput}
                  onChange={(e) => setCupomInput(e.target.value.toUpperCase())}
                  disabled={validandoCupom}
                />
                <button 
                  type="button" 
                  onClick={handleAplicarCupom}
                  disabled={validandoCupom || !cupomInput}
                  className={styles.applyBtn}
                >
                  {validandoCupom ? <Loader size={16} className={styles.spin} /> : 'Aplicar'}
                </button>
              </div>
            ) : (
              <div className={styles.activeCoupon}>
                <div className={styles.couponTag}>
                  <Check size={16} color="#38B2A6" />
                  <span>{cupomAplicado.codigo} ({cupomAplicado.percentual}% OFF)</span>
                </div>
                <button type="button" onClick={handleRemoverCupom} className={styles.removeBtn}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            
            {cupomAplicado && (
              <div className={`${styles.totalRow} ${styles.discountRow}`}>
                <span>Desconto</span>
                <span>- R$ {valorDesconto.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total a Pagar</span>
              <span>R$ {valorFinal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form" 
            className={styles.submitBtn}
            disabled={processandoCompra}
          >
            {processandoCompra ? 'Processando...' : 'Confirmar Pedido'}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;