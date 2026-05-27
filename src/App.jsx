import React from 'react';
import Checkout from './pages/Checkout/Checkout';
import { CartProvider } from './contexts/CartContext';
import EsqueciSenha from './pages/EsqueciSenha/EsqueciSenha';
import Cadastro from './pages/Cadastro/Cadastro';
import Perfil from './pages/Perfil/Perfil';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import styles from './App.module.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Produtos from './pages/Produtos/Produtos';
import ProdutoDetalhe from './pages/Produtos/ProdutoDetalhe';
import Marca from './pages/Marca/Marca';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import SideCart from './components/SideCart/SideCart';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import './index.css';

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
    <AuthProvider>
    <CartProvider>
    <BrowserRouter>
    <ScrollToTop />
      <div className={styles.appContainer}>
        <Header />
        <SideCart />
        
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />
            <Route path="/marca" element={<Marca />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/esqueci-minha-senha" element={<EsqueciSenha />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
    </CartProvider>
    </AuthProvider>
    </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;