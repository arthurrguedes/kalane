import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '../../data/produtos';
import styles from './Produtos.module.css';

const tiposDisponiveis = ['Bodysplash', 'Sabonete', 'Loção'];
const aromasDisponiveis = ['Doce', 'Cítrico', 'Floral', 'Frutado', 'Amadeirado'];

const Produtos = () => {
  const [maxPrice, setMaxPrice] = useState(150);
  const [tiposSelecionados, setTiposSelecionadas] = useState([]);
  const [aromasSelecionados, setAromasSelecionados] = useState([]);
  const navigate = useNavigate();

  const handleTipoChange = (tipo) => {
    setTiposSelecionadas((prev) => 
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const handleAromaChange = (aroma) => {
    setAromasSelecionados((prev) => 
      prev.includes(aroma) ? prev.filter((a) => a !== aroma) : [...prev, aroma]
    );
  };

  // Lógica de filtragem cruzada
  const filteredProducts = mockProducts.filter((product) => {
    const atendePreco = product.price <= maxPrice;
    const atendeTipo = tiposSelecionados.length === 0 || tiposSelecionados.includes(product.category);
    const atendeAroma = aromasSelecionados.length === 0 || aromasSelecionados.includes(product.aroma);

    return atendePreco && atendeTipo && atendeAroma;
  });

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Filtros</h2>
        
        {/* FILTRO DE TIPOS (CATEGORIAS) */}
        <div className={styles.filterGroup}>
          <h3>Categorias</h3>
          {tiposDisponiveis.map(tipo => (
            <label key={tipo} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={tiposSelecionados.includes(tipo)}
                onChange={() => handleTipoChange(tipo)}
              /> 
              {tipo}
            </label>
          ))}
        </div>

        {/* FILTRO DE AROMAS */}
        <div className={styles.filterGroup}>
          <h3>Aromas</h3>
          {aromasDisponiveis.map(aroma => (
            <label key={aroma} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={aromasSelecionados.includes(aroma)}
                onChange={() => handleAromaChange(aroma)}
              /> 
              {aroma}
            </label>
          ))}
        </div>

        {/* FILTRO DE PREÇO */}
        <div className={styles.filterGroup}>
          <h3>Preço máximo: R$ {maxPrice}</h3>
          <input 
            type="range" 
            min="0" 
            max="150" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            className={styles.rangeSlider}
          />
        </div>
      </aside>

      <section className={styles.productGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div 
              key={product.id} 
              className={styles.productCard}
              onClick={() => navigate(`/produto/${product.id}`)}
            >
              <div className={styles.placeholderImage}>imagem</div>
              <div className={styles.productInfo}>
                <h4>{product.name}</h4>
                <p>R$ {product.price.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyMessage}>
            Nenhum produto encontrado com estes filtros.
          </p>
        )}
      </section>
    </div>
  );
};

export default Produtos;