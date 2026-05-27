import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { FullScreenLoading } from '../components/Loading/Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Verifica a sessão inicial ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiFetch('/auth/me');
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. INTERCETOR GLOBA: Escuta o evento 'session-expired'
  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn('A sessão expirou. A terminar a sessão do utilizador por segurança...');
      setUser(null);
      // Como o estado 'user' passa a null, o ProtectedRoute (que criámos anteriormente)
      // vai detetar isto instantaneamente e redirecionar o utilizador para a página de /login.
    };

    // Fica à escuta do evento disparado pelo api.js
    window.addEventListener('session-expired', handleSessionExpired);

    // Limpa o listener quando o componente for desmontado (boa prática)
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(userData); 
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Erro ao terminar sessão', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <FullScreenLoading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);