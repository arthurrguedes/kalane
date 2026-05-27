import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Se não tiver usuário logado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza a rota 'filha' normalmente
  return children;
};

export default ProtectedRoute;