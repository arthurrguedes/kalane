import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FullScreenLoading } from './Loading/Loading';

export const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenLoading />;
  }

  // Se não estiver logado, ou se estiver logado mas NÃO FOR ADMIN
  if (!user || !user.isAdmin) {
    // Expulsa o usuário de volta para a Home
    return <Navigate to="/" replace />;
  }

  return children;
};