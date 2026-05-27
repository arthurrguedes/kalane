import React from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI alternativa.
    return { hasError: true, errorMessage: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    // Aqui você pode registrar o erro em um serviço de monitoramento (ex: Sentry)
    console.error('Erro capturado pelo Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback (alternativa)
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <h1 className={styles.title}>Ops! Algo deu errado.</h1>
            <p className={styles.subtitle}>
              Pedimos desculpas pelo inconveniente. Ocorreu um erro inesperado ao carregar esta parte da página.
            </p>
            <button 
              className={styles.reloadBtn}
              onClick={() => window.location.href = '/'}
            >
              Voltar para o Início
            </button>
          </div>
        </div>
      );
    }

    // Se não houver erro, renderiza os componentes filhos normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;