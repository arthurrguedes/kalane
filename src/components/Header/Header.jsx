import React, { useState } from 'react';
import styles from './Header.module.css';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import logoMarca from '../../assets/kalane-logo.png';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
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
        <Link to="/">Início</Link>
        <Link to="/marca">A Marca</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/kits">Kits</Link>
        <Link to="/mais-vendidos">Mais Vendidos</Link>
        <Link to="/contato">Contato</Link>
      </nav>

      {/* ÍCONES E BUSCA */}
      <div className={styles.headerActions}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Buscar por produtos..." 
            className={styles.searchInput}
          />
          <Search size={16} className={styles.searchIcon} />
        </div>
        
        <div className={styles.divider}></div>
        
        {/* ÍCONE PERFIL COM DROPDOWN */}
        <div className={styles.profileWrapper}>
          <User size={24} className={styles.actionIcon} onClick={toggleProfileDropdown} />
          
          {isProfileDropdownOpen && (
            <div className={styles.profileDropdown}>
              <a href="/login">Login</a>
              <a href="/cadastro">Cadastre-se</a>
            </div>
          )}
        </div>

        <ShoppingCart size={24} className={styles.actionIcon} />

        {/* MENU HAMBÚRGUER (celular ONLY) */}
        <button className={styles.hamburgerBtn} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <nav className={styles.mobileNav}>
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