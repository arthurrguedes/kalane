import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Produtos from './pages/Produtos/Produtos';
import ProdutoDetalhe from './pages/Produtos/ProdutoDetalhe';
import Marca from './pages/Marca/Marca';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <Header />
        
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produto/:id" element={<ProdutoDetalhe />} />
            <Route path="/marca" element={<Marca />} />
          </Routes>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
};

export default App;