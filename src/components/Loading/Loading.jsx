import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Loading.module.css';

// Componente 1: Loading da tela inteira
export const FullScreenLoading = () => {
  return (
    <div className={styles.fullScreen}>
      <Loader2 className={styles.spinner} size={48} />
      <p>A carregar...</p>
    </div>
  );
};

// Componente 2: Loading pequeno para usar dentro de botões
export const ButtonSpinner = () => {
  return <Loader2 className={styles.buttonSpinner} size={18} />;
};