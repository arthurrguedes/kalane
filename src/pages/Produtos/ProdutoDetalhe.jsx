import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { FullScreenLoading } from '../../components/Loading/Loading';
import styles from './ProdutoDetalhe.module.css';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [quantidade, setQuantidade] = useState(1);
  const [produto, setProduto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [isFavorited, setIsFavorited] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [bgPosition, setBgPosition] = useState('50% 50%');
  const [isZoomed, setIsZoomed] = useState(false);

  // Busca o produto e verifica se está nos favoritos do usuário logado
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const produtoData = await apiFetch(`/produtos/${id}`);
        setProduto(produtoData);

        if (user) {
          const favoritosData = await apiFetch('/favoritos');
          const jaFavoritado = favoritosData.some(fav => fav.products.id === Number(id));
          setIsFavorited(jaFavoritado);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [id, user]);

  // Função para favoritar no banco de dados
  const handleToggleFavorite = async () => {
    if (!user) {
      addToast('Faça login para favoritar produtos.', 'error');
      return;
    }

    setIsFavorited(!isFavorited); // Atualiza a tela imediatamente (Optimistic UI)

    try {
      const response = await apiFetch('/favoritos/toggle', {
        method: 'POST',
        body: JSON.stringify({ product_id: produto.id }),
      });
      addToast(response.message, 'success');
    } catch (error) {
      setIsFavorited(!isFavorited); // Reverte se der erro
      addToast('Erro ao atualizar favoritos.', 'error');
    }
  };

  // Função para adicionar ao carrinho (usada no botão e no ícone)
  const handleAddToCart = () => {
    addToCart(produto, quantidade);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000); // Feedback visual temporário no ícone
  };

  if (isLoading) return <FullScreenLoading />;
  if (!produto) return <div className={styles.container}>Produto não encontrado.</div>;

  // --- LÓGICA DE ESTOQUE IMPLEMENTADA AQUI ---
  const semEstoque = produto.estoque <= 0;

  const handleIncrement = () => {
    if (quantidade < produto.estoque) {
      setQuantidade(q => q + 1);
    } else {
      addToast(`Temos apenas ${produto.estoque} unidades disponíveis.`, 'error');
    }
  };
  
  const handleDecrement = () => setQuantidade(q => (q > 1 ? q - 1 : 1));
  // ---------------------------------------------

  const valorTotal = produto.price * quantidade;
  const numParcelas = Math.max(Math.min(quantidade, 3), 1); // Evita divisão por zero
  const valorParcela = valorTotal / numParcelas;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBgPosition(`${x}% ${y}%`);
  };

  const imageUrl = produto.image_url || "https://via.placeholder.com/800x600/D9D9D9/6b7280?text=Sua+Imagem+Aqui";

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link to="/">Início</Link> / <Link to="/produtos">Produtos</Link>
      </nav>

      <main className={styles.productLayout}>
        <div className={styles.imageSection}>
          <div 
            className={styles.imageZoomContainer}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: bgPosition,
              backgroundSize: isZoomed ? '250%' : 'cover'
            }}
          />
        </div>

        <div className={styles.detailsSection}>
          <h1 className={styles.title}>{produto.name}</h1>
          
          <div className={styles.actionIcons}>
            {/* Botão Favoritar */}
            <button 
              onClick={handleToggleFavorite} 
              className={styles.iconBtn}
              aria-label="Favoritar"
            >
              <Heart 
                size={28} 
                strokeWidth={1.5} 
                color="#38B2A6"
                fill={isFavorited ? "#38B2A6" : "none"}
                className={styles.animatedIcon}
              />
            </button>

            {/* Botão Carrinho - Desabilitado se não houver estoque */}
            <button 
              onClick={handleAddToCart} 
              className={styles.iconBtn}
              aria-label="Adicionar ao carrinho"
              disabled={semEstoque}
              style={{ cursor: semEstoque ? 'not-allowed' : 'pointer', opacity: semEstoque ? 0.5 : 1 }}
            >
              <ShoppingCart 
                size={28} 
                strokeWidth={1.5} 
                color={semEstoque ? "#999" : "#38B2A6"}
                fill={isAddedToCart ? "#38B2A6" : "none"}
                className={styles.animatedIcon}
              />
            </button>
          </div>

          <p className={styles.price}>
            R$ {produto.price.toFixed(2).replace('.', ',')}
          </p>

          <p className={styles.description}>{produto.description}</p>

          {/* Controle de Quantidade - Só permite mexer se tiver estoque */}
          <div className={styles.quantityWrapper} style={{ opacity: semEstoque ? 0.5 : 1 }}>
            <span className={styles.quantityLabel}>Quantidade</span>
            <div className={styles.quantityControl}>
              <button onClick={handleDecrement} disabled={semEstoque}><Minus size={16} /></button>
              <span>{semEstoque ? 0 : quantidade}</span>
              <button onClick={handleIncrement} disabled={semEstoque}><Plus size={16} /></button>
            </div>
          </div>

          <div className={styles.purchaseSection}>
            <div className={styles.totalInfo}>
              <p className={styles.totalPrice}>
                Total: <span>R$ {(semEstoque ? 0 : valorTotal).toFixed(2).replace('.', ',')}</span>
              </p>
              <p className={styles.installments}>
                Em até {numParcelas}x de R$ {(semEstoque ? 0 : valorParcela).toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            {/* Botão Comprar - Modificado visualmente quando esgotado */}
            <button 
              className={styles.buyButton} 
              onClick={handleAddToCart}
              disabled={semEstoque}
              style={{ 
                backgroundColor: semEstoque ? '#ccc' : '',
                cursor: semEstoque ? 'not-allowed' : 'pointer'
              }}
            >
              {semEstoque ? 'Produto Esgotado' : 'Comprar'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProdutoDetalhe;