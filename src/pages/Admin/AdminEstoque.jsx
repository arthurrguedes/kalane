import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Save, RefreshCw } from 'lucide-react';
import styles from './AdminEstoque.module.css';

const AdminEstoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [valoresEstoque, setValoresEstoque] = useState({});
  const { addToast } = useToast();

  const carregarProdutos = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/produtos');
      setProdutos(data);
      
      const estoqueInicial = {};
      data.forEach(prod => {
        estoqueInicial[prod.id] = prod.estoque || 0;
      });
      setValoresEstoque(estoqueInicial);
    } catch (error) {
      addToast('Erro ao carregar catálogo de produtos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleInputChange = (id, valor) => {
    setValoresEstoque(prev => ({
      ...prev,
      [id]: valor
    }));
  };

  const handleSalvarEstoque = async (id) => {
    const novaQuantidade = valoresEstoque[id];
    
    if (novaQuantidade < 0 || isNaN(novaQuantidade)) {
      addToast('Por favor, insira um valor válido de estoque.', 'error');
      return;
    }

    try {
      await apiFetch(`/produtos/${id}/estoque`, {
        method: 'PATCH',
        body: JSON.stringify({ quantidade: novaQuantidade }),
      });
      addToast('Estoque atualizado com sucesso!', 'success');
    } catch (error) {
      addToast('Não foi possível salvar o estoque.', 'error');
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Carregando painel de controle...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div>
          <h1>Painel de Estoque</h1>
          <p>Gerencie as quantidades disponíveis de cada produto</p>
        </div>
        <button onClick={carregarProdutos} className={styles.refreshBtn}>
          <RefreshCw size={20} />
        </button>
      </header>

      {/* O container abaixo muda o formato baseado no CSS (Tabela vs Cards) */}
      <div className={styles.tableWrapper}>
        <div className={styles.adminTableContainer}>
          {produtos.map((item) => (
            <div key={item.id} className={styles.cardItem}>
              {/* Informações do Produto */}
              <div className={styles.colProduto}>
                <img src={item.image_url || "https://via.placeholder.com/50"} alt={item.name} />
                <div className={styles.productText}>
                  <span className={styles.productName}>{item.name}</span>
                  <span className={styles.productId}>ID: {item.id}</span>
                </div>
              </div>

              {/* Preço (Visível apenas em desktop) */}
              <div className={styles.colPreco}>
                R$ {item.price.toFixed(2).replace('.', ',')}
              </div>

              {/* Controle de Estoque */}
              <div className={styles.colEstoque}>
                <label className={styles.mobileLabel}>Estoque:</label>
                <input
                  type="number"
                  min="0"
                  value={valoresEstoque[item.id] ?? 0}
                  onChange={(e) => handleInputChange(item.id, parseInt(e.target.value, 10) || 0)}
                  className={styles.estoqueInput}
                />
              </div>

              {/* Ações */}
              <div className={styles.colAcoes}>
                <button onClick={() => handleSalvarEstoque(item.id)} className={styles.saveBtn}>
                  <Save size={16} />
                  <span>Salvar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEstoque;