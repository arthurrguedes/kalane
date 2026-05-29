import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiFetch } from '../../services/api';
import { Tag, Check, X, Loader, ChevronLeft, User, MapPin, ShieldCheck } from 'lucide-react';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    endereco: '',
    cep: '',
  });

  const [cupomInput, setCupomInput] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [validandoCupom, setValidandoCupom] = useState(false);
  const [processandoCompra, setProcessandoCompra] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        nome: user.nome || prev.nome,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length === 0 && !processandoCompra) {
      navigate('/produtos');
    }
  }, [cartItems, navigate, processandoCompra]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (e.target.name === 'email' && cupomAplicado) {
      setCupomAplicado(null);
      addToast('Cupom removido porque o e-mail foi alterado.', 'info');
    }
  };

  const handleAplicarCupom = async () => {
    if (!cupomInput.trim()) return;
    
    if (!formData.email.trim()) {
      addToast('Por favor, preencha o seu e-mail antes de aplicar o cupom.', 'warning');
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
      setCupomInput(''); 
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

  const valorDesconto = cupomAplicado ? (cartTotal * (cupomAplicado.percentual / 100)) : 0;
  const valorFinal = cartTotal - valorDesconto;

  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    
    // VALIDAÇÃO RIGOROSA: Verifica se ALGUM campo está vazio
    if (!formData.nome || !formData.email || !formData.whatsapp || !formData.endereco || !formData.cep) {
      addToast('Por favor, preencha todos os campos do formulário para prosseguir.', 'warning');
      return;
    }

    setProcessandoCompra(true);

    try {
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
          cupomId: cupomAplicado?.id || null, 
          totalPago: valorFinal
        }),
      });

      addToast('Pedido realizado com sucesso!', 'success');
      clearCart();
      navigate('/'); 

    } catch (error) {
      addToast(error.message || 'Erro ao processar o pedido.', 'error');
    } finally {
      setProcessandoCompra(false);
    }
  };

  if (cartItems.length === 0 && !processandoCompra) return null;

  return (
    <div className={styles.checkoutContainer}>
      
      <div className={styles.headerArea}>
        <Link to="/produtos" className={styles.backLink}>
          <ChevronLeft size={16} /> Voltar para a loja
        </Link>
        <h1 className={styles.pageTitle}>Finalizar Compra</h1>
      </div>

      <div className={styles.checkoutGrid}>
        
        {/* COLUNA ESQUERDA: DADOS DO CLIENTE */}
        <section className={styles.formSection}>
          
          {!user && (
            <div className={styles.guestNotice}>
              Você está comprando de forma rápida como visitante. <Link to="/login">Faça login</Link> se quiser acompanhar seu histórico depois.
            </div>
          )}

          <form id="checkout-form" onSubmit={handleFinalizarCompra} className={styles.form}>
            
            {/* Bloco 1: Contato */}
            <div className={styles.formBlock}>
              <h2 className={styles.sectionTitle}><User size={20} color="#38B2A6" /> Dados de Contato</h2>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Nome Completo *</label>
                  <input type="text" name="nome" placeholder="Maria da Silva" required value={formData.nome} onChange={handleInputChange} />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>E-mail *</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="maria@email.com"
                      required 
                      value={formData.email} 
                      onChange={handleInputChange}
                      disabled={!!user} 
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>WhatsApp *</label>
                    <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} placeholder="(11) 99999-9999" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Entrega */}
            <div className={styles.formBlock}>
              <h2 className={styles.sectionTitle}><MapPin size={20} color="#38B2A6" /> Endereço de Entrega</h2>
              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>CEP *</label>
                    <input type="text" name="cep" required placeholder="00000-000" value={formData.cep} onChange={handleInputChange} />
                  </div>
                  <div className={styles.inputGroup} style={{ flex: 2 }}>
                    <label>Endereço Completo *</label>
                    <input type="text" name="endereco" required placeholder="Rua das Flores, 123 - Apto 4" value={formData.endereco} onChange={handleInputChange} />
                  </div>
                </div>
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
                <img 
                  src={item.image_url || "https://via.placeholder.com/60"} 
                  alt={item.name} 
                  className={styles.itemImage} 
                />
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>Qtd: {item.quantidade || 1}</span>
                </div>
                <span className={styles.itemPrice}>
                  R$ {(item.price * (item.quantidade || 1)).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>

          {/* SESSÃO DE CUPOM */}
          <div className={styles.couponSection}>
            <label className={styles.couponLabel}><Tag size={16} /> Cupom de Desconto</label>
            
            {!cupomAplicado ? (
              <div className={styles.couponInputWrapper}>
                <input 
                  type="text" 
                  placeholder="Ex: LACHOE10"
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
                <button type="button" onClick={handleRemoverCupom} className={styles.removeBtn} aria-label="Remover cupom">
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
                <span>Desconto ({cupomAplicado.percentual}%)</span>
                <span>- R$ {valorDesconto.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total a Pagar</span>
              <span>R$ {valorFinal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className={styles.secureCheckoutMsg}>
            <ShieldCheck size={16} color="#38B2A6" /> 
            Ambiente Seguro e Criptografado
          </div>

          <button 
            type="submit" 
            form="checkout-form" 
            className={styles.submitBtn}
            disabled={processandoCompra}
          >
            {processandoCompra ? (
              <><Loader size={20} className={styles.spin} /> Processando...</>
            ) : (
              'Confirmar Pedido'
            )}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;