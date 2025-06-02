import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import { TIPO_USUARIO } from '../../../utils/constants';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount, clearCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="auth-buttons">
          <button className="profile-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="avatar">
              {user.nome?.charAt(0) || user.nomeFantasia?.charAt(0) || 'U'}
            </div>
            <span className="user-name">
              {user.nome || user.nomeFantasia || 'Usuário'}
            </span>
          </button>
          {isMenuOpen && (
            <div className="dropdown-menu">
              {user.tipoUsuario === TIPO_USUARIO.CLIENTE && (
                <>
                  <Link to="/perfil" className="dropdown-item">Meu Perfil</Link>
                  <Link to="/pedidos" className="dropdown-item">Meus Pedidos</Link>
                </>
              )}
              {user.tipoUsuario === TIPO_USUARIO.EMPRESA && (
                <>
                  <Link to="/empresa/perfil" className="dropdown-item">Perfil da Empresa</Link>
                  <Link to="/empresa/pedidos" className="dropdown-item">Pedidos</Link>
                  <Link to="/empresa/produtos" className="dropdown-item">Produtos</Link>
                  <Link to="/empresa/relatorios" className="dropdown-item">Relatórios</Link>
                </>
              )}
              <button onClick={handleLogout} className="dropdown-item logout-button">
                Sair
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="auth-buttons">
        <Link to="/login" className="login-button">Entrar</Link>
        <Link to="/register" className="register-button">Cadastrar</Link>
      </div>
    );
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          QFome
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-item">Início</Link>
          {user?.tipoUsuario === TIPO_USUARIO.CLIENTE && (
            <>
              <Link to="/categorias" className="nav-item">Categorias</Link>
              <Link to="/empresas" className="nav-item">Restaurantes</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {user?.tipoUsuario === TIPO_USUARIO.CLIENTE && (
            <Link to="/carrinho" className="cart-button">
              <span className="material-icons">shopping_cart</span>
              {itemCount > 0 && (
                <span className="cart-count">{itemCount}</span>
              )}
            </Link>
          )}
          {renderAuthButtons()}
        </div>
      </div>
    </header>
  );
};

export default Header;
