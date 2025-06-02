import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">QFome</h3>
          <p className="footer-description">
            Sua plataforma de delivery favorita para encontrar e pedir as melhores comidas da região.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Links Rápidos</h4>
          <nav className="footer-nav">
            <Link to="/" className="footer-link">Início</Link>
            <Link to="/categorias" className="footer-link">Categorias</Link>
            <Link to="/empresas" className="footer-link">Restaurantes</Link>
            <Link to="/sobre" className="footer-link">Sobre Nós</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Para Empresas</h4>
          <nav className="footer-nav">
            <Link to="/register" className="footer-link">Cadastre seu Restaurante</Link>
            <Link to="/empresa/login" className="footer-link">Área do Parceiro</Link>
            <Link to="/empresa/ajuda" className="footer-link">Central de Ajuda</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Contato</h4>
          <div className="footer-contact">
            <p className="contact-item">
              <span className="material-icons">email</span>
              contato@qfome.com.br
            </p>
            <p className="contact-item">
              <span className="material-icons">phone</span>
              (48) 3333-3333
            </p>
            <p className="contact-item">
              <span className="material-icons">location_on</span>
              Criciúma, SC
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {currentYear} QFome. Todos os direitos reservados.
          </p>
          <div className="footer-links">
            <Link to="/privacidade" className="footer-bottom-link">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="footer-bottom-link">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
