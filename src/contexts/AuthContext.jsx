import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { FullScreenLoading } from '../components/Loading/Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificação da sessão inicial ao carregar a página
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

  // Intereceptor Global: Escuta o evento 'session-expired'
  useEffect(() => {
    const handleSessionExpired = () => {
      console.warn('A sessão expirou. A terminar a sessão do utilizador por segurança...');
      setUser(null);
      // Como o estado user passa a null, o ProtectedRoute...
      // vai detectar isso na mesma hora e redirecionar o utilizador para a página de login.
    };

    // Fica na escuta do evento disparado pelo api.js
    window.addEventListener('session-expired', handleSessionExpired);

    // Limpa o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const register = async (userData) => {
    try {
      // Cria a conta
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      // Após criar a conta com sucesso, faz o login automático
      await login(userData.email, userData.password);
    } catch (error) {
      throw error;
    }
  };

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
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {loading ? <FullScreenLoading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);