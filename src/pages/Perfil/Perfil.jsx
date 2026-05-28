import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../services/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trash2, Package } from 'lucide-react';
import styles from './Perfil.module.css';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'pedidos');
  
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavs, setIsLoadingFavs] = useState(false);

  // Novos estados para gerir os pedidos
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // 1º useEffect: Atualiza a aba se o utilizador clicar no Header estando já na página de Perfil
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // 2º useEffect: Busca Favoritos ou Pedidos dependendo da aba ativa
  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'favoritos') {
        setIsLoadingFavs(true);
        try {
          const data = await apiFetch('/favoritos');
          const flatFavorites = data.map(item => item.products);
          setFavorites(flatFavorites);
        } catch (error) {
          console.error('Erro ao buscar favoritos:', error);
        } finally {
          setIsLoadingFavs(false);
        }
      } else if (activeTab === 'pedidos') {
        setIsLoadingOrders(true);
        try {
          const data = await apiFetch('/pedidos'); // Rota que criámos no Passo 1
          setOrders(data);
        } catch (error) {
          console.error('Erro ao buscar pedidos:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    if (user) {
      fetchData();
    }
  }, [activeTab, user]);

  const handleRemoveFavorite = async (productId) => {
    try {
      await apiFetch('/favoritos/toggle', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
      setFavorites(prev => prev.filter(prod => prod.id !== productId));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Função auxiliar para formatar a data que vem do banco
  const formatarData = (dataString) => {
    const opcoes = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dataString).toLocaleDateString('pt-BR', opcoes);
  };

  return (
    <div className={styles.perfilContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
          <h2>{user?.email?.split('@')[0] || 'Usuário'}</h2>
          <p>{user?.email}</p>
        </div>
        <nav className={styles.menu}>
          <button 
            className={activeTab === 'pedidos' ? styles.active : ''} 
            onClick={() => setActiveTab('pedidos')}
          >
            Meus Pedidos
          </button>
          <button 
            className={activeTab === 'favoritos' ? styles.active : ''} 
            onClick={() => setActiveTab('favoritos')}
          >
            Meus Favoritos
          </button>
          <button 
            className={activeTab === 'dados' ? styles.active : ''} 
            onClick={() => setActiveTab('dados')}
          >
            Meus Dados
          </button>
          <button 
            className={activeTab === 'enderecos' ? styles.active : ''} 
            onClick={() => setActiveTab('enderecos')}
          >
            Endereços
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Sair da Conta
          </button>
        </nav>
      </aside>

      <main className={styles.content}>
        
        {/* CONTEÚDO: MEUS PEDIDOS */}
        {activeTab === 'pedidos' && (
          <>
            <h1 className={styles.title}>Meus Pedidos</h1>
            
            {isLoadingOrders ? (
              <p style={{ marginTop: '20px' }}>Carregando seus pedidos...</p>
            ) : orders.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Você ainda não possui pedidos.</p>
                <button className={styles.shopBtn} onClick={() => navigate('/produtos')}>
                  Ir para a loja
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '20px' }}>
                {orders.map((pedido) => (
                  <div key={pedido.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: '#fff' }}>
                    
                    {/* Cabeçalho do Pedido */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>Pedido #{pedido.id}</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: '500', color: '#1f2937' }}>{formatarData(pedido.created_at)}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>
                          {pedido.status}
                        </span>
                        <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', fontSize: '1.1rem', color: '#38B2A6' }}>
                          R$ {pedido.total_amount.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>

                    {/* Lista de Itens do Pedido */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>Itens da Encomenda:</p>
                      {pedido.order_items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} color="#9ca3af" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0', fontSize: '0.9rem', color: '#1f2937' }}>{item.products.name}</p>
                            <p style={{ margin: '0', fontSize: '0.8rem', color: '#6b7280' }}>Qtd: {item.quantity} un.</p>
                          </div>
                          <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: '500' }}>
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CONTEÚDO: MEUS FAVORITOS */}
        {activeTab === 'favoritos' && (
          <>
            <h1 className={styles.title}>Meus Favoritos</h1>
            
            {isLoadingFavs ? (
              <p style={{ marginTop: '20px' }}>Carregando seus favoritos...</p>
            ) : favorites.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Você ainda não favoritou nenhum produto.</p>
                <button className={styles.shopBtn} onClick={() => navigate('/produtos')}>
                  Explorar Produtos
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
                {favorites.map((produto) => (
                  <div key={produto.id} style={{ border: '1px solid #e5e7eb', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
                    
                    <div style={{ height: '150px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', borderRadius: '4px' }}>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>{produto.category}</span>
                    </div>

                    <Link to={`/produtos/${produto.id}`} style={{ textDecoration: 'none', color: '#111' }}>
                      <h3 style={{ fontSize: '16px', margin: '0 0 5px 0', fontWeight: '500' }}>{produto.name}</h3>
                      <p style={{ fontWeight: 'bold', margin: '0' }}>R$ {produto.price.toFixed(2).replace('.', ',')}</p>
                    </Link>
                    
                    <button 
                      onClick={() => handleRemoveFavorite(produto.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '15px', display: 'flex', alignItems: 'center', gap: '5px', padding: '0', fontSize: '14px' }}
                    >
                      <Trash2 size={16} /> Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CONTEÚDO: OUTRAS ABAS */}
        {activeTab === 'dados' && (
          <>
            <h1 className={styles.title}>Meus Dados</h1>
            <p style={{ marginTop: '20px' }}>Esta seção será desenvolvida em breve.</p>
          </>
        )}

        {activeTab === 'enderecos' && (
          <>
            <h1 className={styles.title}>Endereços</h1>
            <p style={{ marginTop: '20px' }}>Esta seção será desenvolvida em breve.</p>
          </>
        )}

      </main>
    </div>
  );
};

export default Perfil;