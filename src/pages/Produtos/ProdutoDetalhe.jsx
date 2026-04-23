import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { mockProducts } from '../../data/produtos';
import styles from './ProdutoDetalhe.module.css';

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [quantidade, setQuantidade] = useState(1);
  const [produto, setProduto] = useState(null);

  // Estados para o preenchimento dos ícones
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Estados para o Zoom da imagem
  const [bgPosition, setBgPosition] = useState('50% 50%');
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const produtoEncontrado = mockProducts.find(p => p.id === Number(id));
    if (produtoEncontrado) {
      setProduto(produtoEncontrado);
    }
  }, [id]);

  if (!produto) {
    return <div className={styles.container}>Produto não encontrado.</div>;
  }

  const handleIncrement = () => setQuantidade(q => q + 1);
  const handleDecrement = () => setQuantidade(q => (q > 1 ? q - 1 : 1));

  const valorTotal = produto.price * quantidade;
  const numParcelas = Math.min(quantidade, 3);
  const valorParcela = valorTotal / numParcelas;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBgPosition(`${x}% ${y}%`);
  };

  const imageUrl = "https://via.placeholder.com/800x600/D9D9D9/6b7280?text=Sua+Imagem+Aqui";

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
              onClick={() => setIsFavorited(!isFavorited)} 
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

            {/* Botão Carrinho */}
            <button 
              onClick={() => setIsAddedToCart(!isAddedToCart)} 
              className={styles.iconBtn}
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart 
                size={28} 
                strokeWidth={1.5} 
                color="#38B2A6"
                fill={isAddedToCart ? "#38B2A6" : "none"}
                className={styles.animatedIcon}
              />
            </button>
          </div>

          <p className={styles.price}>
            R$ {produto.price.toFixed(2).replace('.', ',')}
          </p>

          <p className={styles.description}>{produto.description}</p>

          <div className={styles.quantityWrapper}>
            <span className={styles.quantityLabel}>Quantidade</span>
            <div className={styles.quantityControl}>
              <button onClick={handleDecrement}><Minus size={16} /></button>
              <span>{quantidade}</span>
              <button onClick={handleIncrement}><Plus size={16} /></button>
            </div>
          </div>

          <div className={styles.purchaseSection}>
            <div className={styles.totalInfo}>
              <p className={styles.totalPrice}>
                Total: <span>R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
              </p>
              <p className={styles.installments}>
                Em até {numParcelas}x de R$ {valorParcela.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <button className={styles.buyButton}>Comprar</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProdutoDetalhe;