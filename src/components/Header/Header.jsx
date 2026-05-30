import React, { useState } from 'react';
import styles from './Header.module.css';
// Adicionados: Package, Heart, LogOut
import { Search, ShoppingCart, User, Menu, X, Package, Heart, LogOut } from 'lucide-react';
import logoMarca from '../../assets/lachoe-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { toggleCart, cartCount } = useCart();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  console.log("Usuário no Header:", user);

  const primeiroNome = user?.nome ? user.nome.split(' ')[0] : user?.email?.split('@')[0];

  return (
        <>
    <header className={styles.header}>
      {/* LOGO */}
      <div className={styles.logoArea}>
        <Link to="/" className={styles.logoArea}>
          <img src={logoMarca} alt="Logo Lachoe Beauty" className={styles.logoImage} />
        </Link>
      </div>

      {/* MENU DESKTOP */}
      <nav className={styles.desktopNav}>
        <Link to="/">Início</Link>
        <Link to="/marca">A Marca</Link>
        <Link to="/produtos">Produtos</Link>
        {user && user.isAdmin && (
          <Link to="/admin/estoque" className={styles.adminLink}>
            Estoque
          </Link>
        )}
        <Link to="/kits">Kits</Link>
        <Link to="/mais-vendidos">Mais Vendidos</Link>
        <Link to="/contato">Contato</Link>
      </nav>

      {/* ÍCONES E BUSCA */}
      <div className={styles.headerActions}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Buscar por produtos..." className={styles.searchInput} />
          <Search size={16} className={styles.searchIcon} />
        </div>
        
        <div className={styles.divider}></div>
        
        {/* ÍCONE PERFIL COM DROPDOWN */}
        <div className={styles.profileWrapper}>
          <User size={24} className={styles.actionIcon} onClick={toggleProfileDropdown} />
          
          {isProfileDropdownOpen && (
            <div className={styles.profileDropdown}>
              {user ? (
                <>
                  <div className={styles.userInfoDropdown}>
                  <span className={styles.greeting}>Olá,</span>
                  <span className={styles.userName}>{primeiroNome}</span>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  
                  {/* Links com o state indicando a aba */}
                  <Link to="/perfil" state={{ tab: 'dados' }} onClick={() => setIsProfileDropdownOpen(false)}>
                    <User size={16} /> Meu Perfil
                  </Link>
                  <Link to="/perfil" state={{ tab: 'pedidos' }} onClick={() => setIsProfileDropdownOpen(false)}>
                    <Package size={16} /> Meus Pedidos
                  </Link>
                  <Link to="/perfil" state={{ tab: 'favoritos' }} onClick={() => setIsProfileDropdownOpen(false)}>
                    <Heart size={16} /> Meus Favoritos
                  </Link>
                  
                  <div className={styles.dropdownDivider}></div>
                  <button onClick={handleLogout} className={styles.logoutBtnDropdown}>
                    <LogOut size={16} /> Sair da conta
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsProfileDropdownOpen(false)}>Login</Link>
                  <Link to="/cadastro" onClick={() => setIsProfileDropdownOpen(false)}>Cadastre-se</Link>
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.cartWrapper} onClick={toggleCart} style={{ position: 'relative', cursor: 'pointer' }}>
          <ShoppingCart size={24} className={styles.actionIcon} />
          {cartCount > 0 && (
            <span style={{ 
              position: 'absolute', top: '-8px', right: '-8px', 
              backgroundColor: '#ef4444', color: 'white', 
              fontSize: '0.7rem', width: '18px', height: '18px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              borderRadius: '50%', fontWeight: 'bold' 
            }}>
              {cartCount}
            </span>
          )}
        </div>

        <button className={styles.hamburgerBtn} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <nav className={styles.mobileNav}>
          <Link to="/" onClick={toggleMobileMenu}>Início</Link>
          <Link to="/marca" onClick={toggleMobileMenu}>A Marca</Link>
          <Link to="/produtos" onClick={toggleMobileMenu}>Produtos</Link>
          {user && user.isAdmin && (
          <Link to="/admin/estoque" className={styles.adminLink}>Estoque</Link>
          )}
          <Link to="/kits" onClick={toggleMobileMenu}>Kits</Link>
          <Link to="/mais-vendidos" onClick={toggleMobileMenu}>Mais Vendidos</Link>
          <Link to="/contato" onClick={toggleMobileMenu}>Contato</Link>
        </nav>
      )}
    </header>

    <div className={styles.promoBar}>
        <span>USE O CUPOM <b>BEMVINDO10</b> PARA GANHAR 10% NA PRIMEIRA COMPRA</span>
      </div>
      </>
  );
};

export default Header;