import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getNavigationLinks = () => {
    if (!isAuthenticated) {
      return [
        { path: '/', label: 'Início', icon: '🏠' },
        { path: '/catalogo', label: 'Catálogo', icon: '🍽️' },
        { path: '/login', label: 'Entrar', icon: '👤' }
      ];
    }

    switch (user?.tipoUsuario) {
      case 'CLIENTE':
        return [
          { path: '/catalogo', label: 'Catálogo', icon: '🍽️' },
          { path: '/meus-pedidos', label: 'Meus Pedidos', icon: '📋' }
        ];
      
      case 'EMPRESA':
        return [
          { path: '/empresa/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/empresa/produtos', label: 'Produtos', icon: '🍕' },
          { path: '/empresa/pedidos', label: 'Pedidos', icon: '📋' },
          { path: '/empresa/relatorios', label: 'Relatórios', icon: '📈' }
        ];
      
      default:
        return [];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo" onClick={closeMobileMenu}>
          <span className="header__logo-icon">🚚</span>
          <span className="header__logo-text">Delivery</span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="header__nav desktop-nav">
          <ul className="header__nav-list">
            {navigationLinks.map((link) => (
              <li key={link.path} className="header__nav-item">
                <Link
                  to={link.path}
                  className={`header__nav-link ${isActivePath(link.path) ? 'active' : ''}`}
                >
                  <span className="header__nav-icon">{link.icon}</span>
                  <span className="header__nav-text">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {/* Cart Button (apenas para clientes) */}
          {isAuthenticated && user?.tipoUsuario === 'CLIENTE' && (
            <Link to="/checkout" className="header__cart-btn">
              <span className="header__cart-icon">🛒</span>
              {itemCount > 0 && (
                <span className="header__cart-badge">{itemCount}</span>
              )}
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="header__theme-btn"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="header__user-menu">
              <button
                onClick={toggleUserMenu}
                className="header__user-btn"
                aria-label="Menu do usuário"
              >
                <span className="header__user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || '👤'}
                </span>
                <span className="header__user-name hide-mobile">
                  {user?.email?.split('@')[0] || 'Usuário'}
                </span>
                <span className="header__user-arrow">▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="header__user-dropdown">
                  <div className="header__user-info">
                    <span className="header__user-email">{user?.email}</span>
                    <span className="header__user-type">
                      {user?.tipoUsuario === 'CLIENTE' ? 'Cliente' : 
                       user?.tipoUsuario === 'EMPRESA' ? 'Empresa' : 'Usuário'}
                    </span>
                  </div>
                  
                  <div className="header__user-actions">
                    {user?.tipoUsuario === 'CLIENTE' && (
                      <Link 
                        to="/cliente/perfil" 
                        className="header__user-link"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        👤 Meu Perfil
                      </Link>
                    )}
                    
                    {user?.tipoUsuario === 'EMPRESA' && (
                      <Link 
                        to="/empresa/perfil" 
                        className="header__user-link"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        🏢 Perfil da Empresa
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="header__user-link header__logout-btn"
                    >
                      🚪 Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="header__auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm hide-mobile">
                Entrar
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Cadastrar
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="header__mobile-btn mobile-nav"
            aria-label="Menu"
          >
            <span className={`header__hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`header__mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <nav className="header__mobile-nav-content">
          <ul className="header__mobile-nav-list">
            {navigationLinks.map((link) => (
              <li key={link.path} className="header__mobile-nav-item">
                <Link
                  to={link.path}
                  className={`header__mobile-nav-link ${isActivePath(link.path) ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span className="header__mobile-nav-icon">{link.icon}</span>
                  <span className="header__mobile-nav-text">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Auth Section */}
          {!isAuthenticated && (
            <div className="header__mobile-auth">
              <Link 
                to="/login" 
                className="btn btn-secondary btn-block"
                onClick={closeMobileMenu}
              >
                Entrar
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-block"
                onClick={closeMobileMenu}
              >
                Cadastrar
              </Link>
            </div>
          )}

          {/* Mobile User Section */}
          {isAuthenticated && (
            <div className="header__mobile-user">
              <div className="header__mobile-user-info">
                <div className="header__mobile-user-avatar">
                  {user?.email?.charAt(0).toUpperCase() || '👤'}
                </div>
                <div className="header__mobile-user-details">
                  <span className="header__mobile-user-name">
                    {user?.email?.split('@')[0] || 'Usuário'}
                  </span>
                  <span className="header__mobile-user-type">
                    {user?.tipoUsuario === 'CLIENTE' ? 'Cliente' : 
                     user?.tipoUsuario === 'EMPRESA' ? 'Empresa' : 'Usuário'}
                  </span>
                </div>
              </div>

              <div className="header__mobile-user-actions">
                {user?.tipoUsuario === 'CLIENTE' && (
                  <Link 
                    to="/cliente/perfil" 
                    className="header__mobile-user-link"
                    onClick={closeMobileMenu}
                  >
                    👤 Meu Perfil
                  </Link>
                )}
                
                {user?.tipoUsuario === 'EMPRESA' && (
                  <Link 
                    to="/empresa/perfil" 
                    className="header__mobile-user-link"
                    onClick={closeMobileMenu}
                  >
                    🏢 Perfil da Empresa
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="header__mobile-user-link header__mobile-logout-btn"
                >
                  🚪 Sair
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {(isMenuOpen || isUserMenuOpen) && (
        <div 
          className="header__overlay"
          onClick={() => {
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export const useHeader = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isScrolled };
};

export default Header;