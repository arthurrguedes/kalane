import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Força o scroll ir para a posição X: 0, Y: 0 (topo e esquerda)
    window.scrollTo(0, 0);
  }, [pathname]); // O useEffect é disparado toda vez que o 'pathname' (a URL) muda

  return null; // Este componente não renderiza nada na tela
};

export default ScrollToTop;