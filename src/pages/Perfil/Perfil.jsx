import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiFetch } from '../../services/api';
import { User, Package, Heart, LogOut, MapPin, Phone, Lock, Mail, Camera, X, Shield } from 'lucide-react';
import styles from './Perfil.module.css';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(location.state?.tab || 'dados');
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados de carregamento separados para cada formulário
  const [isSavingDados, setIsSavingDados] = useState(false);
  const [isSavingSeguranca, setIsSavingSeguranca] = useState(false);
  
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);

  // 1. Estado isolado para Dados Cadastrais e Endereço
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cep: '',
    endereco: '',
  });

  // 2. Estado isolado para Segurança (E-mail e Senha)
  const [securityData, setSecurityData] = useState({
    email: '',
    senha: '', 
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const carregarPerfil = async () => {
      try {
        const data = await apiFetch('/perfil'); 

        const nomeDoEmail = user?.email?.split('@')[0] || '';
        
        setFormData({
          nome: data.nome || '',
          telefone: data.telefone || '',
          cep: data.cep || '',
          endereco: data.endereco || '',
        });

        setSecurityData({
          email: data.email || '',
          senha: '', 
        });

        if (!data.telefone || !data.endereco) {
          setShowCompleteProfileModal(true);
        }
      } catch (error) {
        addToast('Erro ao carregar dados do perfil.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerfil();
  }, [user, navigate]);

  // Handlers independentes
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSecurityChange = (e) => setSecurityData({ ...securityData, [e.target.name]: e.target.value });

  // Salvar apenas Dados
  const handleSalvarDados = async (e) => {
    if (e) e.preventDefault();
    setIsSavingDados(true);

    try {
      await apiFetch('/perfil', {
        method: 'PUT',
        body: JSON.stringify(formData), // Envia apenas os dados de endereço/contato
      });

      addToast('Dados cadastrais atualizados com sucesso!', 'success');
      setShowCompleteProfileModal(false); 
    } catch (error) {
      addToast(error.message || 'Erro ao atualizar o perfil.', 'error');
    } finally {
      setIsSavingDados(false);
    }
  };

  // Salvar apenas Segurança
  const handleSalvarSeguranca = async (e) => {
    e.preventDefault();
    setIsSavingSeguranca(true);

    try {
      const payload = { email: securityData.email };
      if (securityData.senha) {
        payload.senha = securityData.senha;
      }

      await apiFetch('/perfil', {
        method: 'PUT',
        body: JSON.stringify(payload), // Envia apenas e-mail e senha
      });

      addToast('Dados de acesso atualizados com sucesso!', 'success');
      setSecurityData(prev => ({ ...prev, senha: '' })); // Limpa o campo de senha após sucesso
    } catch (error) {
      addToast(error.message || 'Erro ao atualizar segurança.', 'error');
    } finally {
      setIsSavingSeguranca(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) return <div className={styles.loading}>Carregando perfil...</div>;

  return (
    <div className={styles.perfilContainer}>
      
      {/* MODAL DE COMPLETAR PERFIL */}
      {showCompleteProfileModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModalBtn} onClick={() => setShowCompleteProfileModal(false)}>
              <X size={24} />
            </button>
            <div className={styles.modalHeader}>
              <h2>Complete o seu Perfil</h2>
              <p>Faltam alguns detalhes! Preencha os dados abaixo para agilizar suas futuras compras na Lachoe Beauty.</p>
            </div>
            <form onSubmit={handleSalvarDados} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label><Phone size={16} /> WhatsApp / Telefone</label>
                <input type="tel" name="telefone" required value={formData.telefone} onChange={handleInputChange} placeholder="(11) 99999-9999" />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label><MapPin size={16} /> CEP</label>
                  <input type="text" name="cep" required value={formData.cep} onChange={handleInputChange} placeholder="00000-000" />
                </div>
                <div className={styles.inputGroup} style={{ flex: 2 }}>
                  <label>Endereço Completo</label>
                  <input type="text" name="endereco" required value={formData.endereco} onChange={handleInputChange} placeholder="Rua, Número, Bairro" />
                </div>
              </div>
              <button type="submit" className={styles.btnPrimary} disabled={isSavingDados}>
                {isSavingDados ? 'Salvando...' : 'Salvar e Continuar'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={styles.pageHeader}>
        <h1>Minha Conta</h1>
      </div>

      <div className={styles.perfilGrid}>
        
        {/* MENU LATERAL */}
        <aside className={styles.sidebar}>
          <div className={styles.userInfo}>
          <div className={styles.avatarPlaceholder}>
            <Camera size={24} color="#aaa" />
          </div>
          {/* Mostra o nome do banco. Se não tiver por algum erro, mostra o email cortado */}
          <h3>{formData.nome || securityData.email.split('@')[0]}</h3>
          <p>{securityData.email}</p>
        </div>

          <nav className={styles.sideNav}>
            <button className={activeTab === 'dados' ? styles.active : ''} onClick={() => setActiveTab('dados')}>
              <User size={18} /> Meus Dados
            </button>
            <button className={activeTab === 'seguranca' ? styles.active : ''} onClick={() => setActiveTab('seguranca')}>
              <Shield size={18} /> Segurança
            </button>
            <button className={activeTab === 'pedidos' ? styles.active : ''} onClick={() => setActiveTab('pedidos')}>
              <Package size={18} /> Meus Pedidos
            </button>
            <button className={activeTab === 'favoritos' ? styles.active : ''} onClick={() => setActiveTab('favoritos')}>
              <Heart size={18} /> Meus Favoritos
            </button>
            <div className={styles.divider}></div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={18} /> Sair da conta
            </button>
          </nav>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className={styles.mainContent}>
          
          {/* ABA: MEUS DADOS */}
          {activeTab === 'dados' && (
            <section className={styles.tabSection}>
              <h2>Informações Pessoais</h2>
              <p className={styles.sectionDesc}>Atualize seus dados básicos e endereço de entrega.</p>

              <form onSubmit={handleSalvarDados} className={styles.dadosForm}>
                <div className={styles.formSection}>
                  <h3>Dados Cadastrais</h3>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label>Telefone / WhatsApp</label>
                      <input type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3>Endereço de Entrega Padrão</h3>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label>CEP</label>
                      <input type="text" name="cep" value={formData.cep} onChange={handleInputChange} />
                    </div>
                    <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                      <label>Endereço Completo</label>
                      <input type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.btnPrimary} disabled={isSavingDados}>
                    {isSavingDados ? 'Salvando...' : 'Salvar Informações'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ABA: SEGURANÇA */}
          {activeTab === 'seguranca' && (
            <section className={styles.tabSection}>
              <h2>Segurança e Acesso</h2>
              <p className={styles.sectionDesc}>Gerencie o e-mail que você usa para acessar a plataforma e atualize sua senha.</p>

              <form onSubmit={handleSalvarSeguranca} className={styles.dadosForm}>
                <div className={styles.formSection}>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                      <label><Mail size={14} /> E-mail de Acesso</label>
                      <input type="email" name="email" value={securityData.email} onChange={handleSecurityChange} required />
                    </div>
                    <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                      <label><Lock size={14} /> Nova Senha</label>
                      <input 
                        type="password" 
                        name="senha" 
                        value={securityData.senha} 
                        onChange={handleSecurityChange} 
                        placeholder="Deixe em branco para manter a atual" 
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.btnPrimary} disabled={isSavingSeguranca}>
                    {isSavingSeguranca ? 'Salvando...' : 'Atualizar Acesso'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ABA: MEUS PEDIDOS */}
          {activeTab === 'pedidos' && (
            <section className={styles.tabSection}>
              <h2>Meus Pedidos</h2>
              <div className={styles.emptyState}>
                <Package size={48} color="#ccc" />
                <p>Você ainda não fez nenhum pedido.</p>
                <button onClick={() => navigate('/produtos')} className={styles.btnSecondary}>Explorar Produtos</button>
              </div>
            </section>
          )}

          {/* ABA: MEUS FAVORITOS */}
          {activeTab === 'favoritos' && (
            <section className={styles.tabSection}>
              <h2>Meus Favoritos</h2>
              <div className={styles.emptyState}>
                <Heart size={48} color="#ccc" />
                <p>Você ainda não tem produtos favoritos.</p>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default Perfil;