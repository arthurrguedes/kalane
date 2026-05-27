import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, isStrongPassword, isValidName } from '../../utils/validators';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [aceitaMarketing, setAceitaMarketing] = useState(false);
  
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Limpeza básica (remover espaços em branco das pontas)
    const nomeSanitizado = nome.trim();
    const emailSanitizado = email.trim();

    // Validação de Nome
    if (!isValidName(nomeSanitizado)) {
      setError('Por favor, insira seu nome e sobrenome.');
      return;
    }

    // Validação de E-mail
    if (!isValidEmail(emailSanitizado)) {
      setError('Insira um formato de e-mail válido.');
      return;
    }

    // Validação de Força da Senha
    if (!isStrongPassword(password)) {
      setError('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&).');
      return;
    }

    // Confirmação de Senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Consentimento
    if (!aceitouTermos) {
      setError('Você precisa aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }

    try {
      await register({
        nome: nomeSanitizado,
        email: emailSanitizado,
        password: password,
        aceitouTermos,
        aceitaMarketing
      });
      navigate('/perfil');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
      
    }
  };

  return (
    <div className={styles.cadastroContainer}>
      <div className={styles.cadastroCard}>
        <h1 className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>Junte-se à Lachoe Beauty</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="nome">Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              placeholder="Maria Silva"
            />
          </div>

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

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>

          <div className={styles.consentGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
              />
              <span>
                Li e concordo com os <a href="/termos" target="_blank">Termos de Uso</a> e a <a href="/politica-de-privacidade" target="_blank">Política de Privacidade</a>. *
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={aceitaMarketing}
                onChange={(e) => setAceitaMarketing(e.target.checked)}
              />
              <span>
                Quero receber ofertas exclusivas e novidades.
              </span>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn}>Criar Conta</button>
        </form>

        <div className={styles.loginPrompt}>
          Já tem conta? <Link to="/login">Faça Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;