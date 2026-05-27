import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail } from '../../utils/validators';
import { ButtonSpinner } from '../../components/Loading/Loading';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const emailSanitizado = email.trim();

    // Verifica campos vazios
    if (!emailSanitizado || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    // Valida formato do e-mail
    if (!isValidEmail(emailSanitizado)) {
      setError('Por favor, insira um formato de e-mail válido.');
      setIsLoading(false);
      return;
    }

    try {
      await login(emailSanitizado, password);
      navigate('/perfil');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Acesse sua conta</h1>
        <p className={styles.subtitle}>Bem-vindo de volta à Lachoe Beauty</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input type="checkbox" /> Lembrar-me
            </label>
            <Link to="/esqueci-minha-senha" className={styles.forgotPassword}>
              Esqueceu a senha?
            </Link>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading} // Desativa o botão se estiver carregando
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            {isLoading ? (
              <>
                <ButtonSpinner /> Entrar...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className={styles.registerPrompt}>
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;