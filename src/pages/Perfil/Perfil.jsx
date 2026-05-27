import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Perfil.module.css';

const Perfil = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.perfilContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
          <h2>{user?.email?.split('@')[0] || 'Usuário'}</h2>
          <p>{user?.email}</p>
        </div>
        <nav className={styles.menu}>
          <button className={styles.active}>Meus Pedidos</button>
          <button>Meus Dados</button>
          <button>Endereços</button>
          <button onClick={logout} className={styles.logoutBtn}>Sair da Conta</button>
        </nav>
      </aside>

      <main className={styles.content}>
        <h1 className={styles.title}>Meus Pedidos</h1>
        <div className={styles.emptyState}>
          <p>Você ainda não possui pedidos.</p>
          <button className={styles.shopBtn}>Ir para a loja</button>
        </div>
      </main>
    </div>
  );
};

export default Perfil;