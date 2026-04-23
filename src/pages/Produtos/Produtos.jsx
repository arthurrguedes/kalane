import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Produtos.module.css';

const categoriasDisponiveis = ['Bodysplash', 'Sabonete', 'Loção'];
const aromasDisponiveis = ['Doce', 'Cítrico', 'Floral', 'Frutado', 'Amadeirado'];

// Adicionamos 'category' e 'aroma' para cada produto
const mockProducts = [
  { id: 1, name: 'Bodysplash Vanilla Sky', price: 89.90, category: 'Bodysplash', aroma: 'Doce' },
  { id: 2, name: 'Sabonete Citrus Fresh', price: 25.00, category: 'Sabonete', aroma: 'Cítrico' },
  { id: 3, name: 'Bodysplash Floral Bloom', price: 92.50, category: 'Bodysplash', aroma: 'Floral' },
  { id: 4, name: 'Loção Berry Punch', price: 68.00, category: 'Loção', aroma: 'Frutado' },
  { id: 5, name: 'Bodysplash Amber Wood', price: 110.00, category: 'Bodysplash', aroma: 'Amadeirado' },
  { id: 6, name: 'Sabonete Sweet Candy', price: 22.00, category: 'Sabonete', aroma: 'Doce' },
];

const Produtos = () => {
  const [maxPrice, setMaxPrice] = useState(150);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [aromasSelecionados, setAromasSelecionados] = useState([]);
  const navigate = useNavigate();

  const handleCategoriaChange = (categoria) => {
    setCategoriasSelecionadas((prev) => 
      prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria]
    );
  };

  const handleAromaChange = (aroma) => {
    setAromasSelecionados((prev) => 
      prev.includes(aroma) ? prev.filter((a) => a !== aroma) : [...prev, aroma]
    );
  };

  // Filtragem cruzando Preço, Categoria e Aroma
  const filteredProducts = mockProducts.filter((product) => {
    const atendePreco = product.price <= maxPrice;
    
    const atendeCategoria = categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(product.category);
    
    const atendeAroma = aromasSelecionados.length === 0 || aromasSelecionados.includes(product.aroma);

    return atendePreco && atendeCategoria && atendeAroma;
  });

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Filtros</h2>
        
        <div className={styles.filterGroup}>
          <h3>Categorias</h3>
          {categoriasDisponiveis.map(cat => (
            <label key={cat} className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={categoriasSelecionadas.includes(cat)}
                onChange={() => handleCategoriaChange(cat)}
              /> 
              {cat}
            </label>
          ))}
        </div>

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
              <div className={styles.placeholderImage}>Imagem</div>
              <div className={styles.productInfo}>
                <h4>{product.name}</h4>
                <p>R$ {product.price.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280' }}>
            Nenhum produto encontrado com estes filtros.
          </p>
        )}
      </section>
    </div>
  );
};

export default Produtos;