import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isValidEmail } from '../../utils/validators'; // <-- Importando o validador
import styles from './EsqueciSenha.module.css';

const EsqueciSenha = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    const emailSanitizado = email.trim();

    // Validar formato do e-mail
    if (!isValidEmail(emailSanitizado)) {
      setError('Por favor, informe um e-mail válido para recuperação.');
      setIsLoading(false);
      return;
    }

    try {
      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage('Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.');
      setEmail('');
    } catch (err) {
      setError('Ocorreu um erro ao tentar enviar o e-mail. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Recuperar senha</h1>
        <p className={styles.subtitle}>
          Informe o e-mail associado à sua conta e enviaremos as instruções para redefinir sua senha.
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {message && <div className={styles.successMessage}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <div className={styles.backToLogin}>
          Lembrou a senha? <Link to="/login">Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
};

export default EsqueciSenha;