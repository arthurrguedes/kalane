import React from 'react';
import { useParams } from 'react-router-dom';

const ProdutoDetalhe = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Detalhes do Produto {id}</h1>
      <p>Página em desenvolvimento para o Bodysplash selecionado.</p>
    </div>
  );
};

export default ProdutoDetalhe;