import React, { useState } from 'react';
import styles from './Header.module.css';
import { Search, ShoppingCart, Flower2, Menu, X } from 'lucide-react';
import logoMarca from '../../assets/kalane-logo.png';

const Header = () => {
  // Controle de menu mobile se está aberto (true) ou fechado (false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Função para alternar o estado do menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      {/* LOGO */}
      <div className={styles.logoArea}>
        <a href="/" className={styles.logoArea}>
        <img 
          src={logoMarca} 
          alt="Logo Kalanê Beauty" 
          className={styles.logoImage} 
        />
      </a>
      </div>

      {/* MENU DESKTOP */}
      <nav className={styles.desktopNav}>
        <a href="/">Início</a>
        <a href="/marca">A Marca</a>
        <a href="/produtos">Produtos</a>
        <a href="/kits">Kits</a>
        <a href="/mais-vendidos">Mais Vendidos</a>
        <a href="/contato">Contato</a>
      </nav>

      {/* ÍCONES E BUSCA */}
      <div className={styles.headerActions}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Buscar..." 
            className={styles.searchInput}
          />
          <Search size={16} className={styles.searchIcon} />
        </div>
        
        <div className={styles.divider}></div>
        <ShoppingCart size={24} className={styles.cartIcon} />

        {/* MENU HAMBÚRGUER (celular ONLY) */}
        <button className={styles.hamburgerBtn} onClick={toggleMobileMenu}>
          {/* Se o menu estiver aberto, mostra o X. Se fechado, mostra o menu sanduíche */}
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE (Aparece condicionalmente) */}
      {isMobileMenuOpen && (
        <nav className={styles.mobileNav}>
          {/* Inclui o onClick para fechar o menu automaticamente ao clicar no link */}
          <a href="/" onClick={toggleMobileMenu}>Início</a>
          <a href="/marca" onClick={toggleMobileMenu}>A Marca</a>
          <a href="/produtos" onClick={toggleMobileMenu}>Produtos</a>
          <a href="/kits" onClick={toggleMobileMenu}>Kits</a>
          <a href="/mais-vendidos" onClick={toggleMobileMenu}>Mais Vendidos</a>
          <a href="/contato" onClick={toggleMobileMenu}>Contato</a>
        </nav>
      )}
    </header>
  );
};

export default Header;