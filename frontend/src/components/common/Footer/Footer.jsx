import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscriptionMessage('Por favor, insira um email válido');
      return;
    }

    try {
      setIsSubscribing(true);
      setSubscriptionMessage('');
      
      // Aqui seria feita a integração com a API de newsletter
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API call
      
      setEmail('');
      setSubscriptionMessage('Obrigado! Você foi inscrito na nossa newsletter.');
    } catch (error) {
      setSubscriptionMessage('Erro ao inscrever. Tente novamente.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__content">
          {/* Seção da Marca */}
          <div className="footer__section">
            <Link to="/" className="footer__brand">
              <span className="footer__brand-icon">🚚</span>
              Delivery
            </Link>
            <p className="footer__description">
              A melhor plataforma de delivery da região. Conectamos você aos seus restaurantes favoritos com rapidez e qualidade.
            </p>
            <div className="footer__social">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Facebook"
              >
                📘
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Instagram"
              >
                📷
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="LinkedIn"
              >
                💼
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="footer__section">
            <h3 className="footer__section-title">Links Rápidos</h3>
            <div className="footer__links">
              <Link to="/catalogo" className="footer__link">
                Explorar Restaurantes
              </Link>
              <Link to="/categorias" className="footer__link">
                Categorias
              </Link>
              <Link to="/como-funciona" className="footer__link">
                Como Funciona
              </Link>
              <Link to="/ofertas" className="footer__link">
                Ofertas Especiais
              </Link>
              <Link to="/blog" className="footer__link">
                Blog
              </Link>
            </div>
          </div>

          {/* Para Empresas */}
          <div className="footer__section">
            <h3 className="footer__section-title">Para Empresas</h3>
            <div className="footer__links">
              <Link to="/cadastro-empresa" className="footer__link">
                Cadastre seu Restaurante
              </Link>
              <Link to="/central-do-parceiro" className="footer__link">
                Central do Parceiro
              </Link>
              <Link to="/entregadores" className="footer__link">
                Seja um Entregador
              </Link>
              <Link to="/programa-afiliados" className="footer__link">
                Programa de Afiliados
              </Link>
              <Link to="/api-developers" className="footer__link">
                API para Desenvolvedores
              </Link>
            </div>
          </div>

          {/* Suporte */}
          <div className="footer__section">
            <h3 className="footer__section-title">Suporte</h3>
            <div className="footer__links">
              <Link to="/ajuda" className="footer__link">
                Central de Ajuda
              </Link>
              <Link to="/faq" className="footer__link">
                Perguntas Frequentes
              </Link>
              <Link to="/contato" className="footer__link">
                Entre em Contato
              </Link>
              <Link to="/termos" className="footer__link">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="footer__link">
                Política de Privacidade
              </Link>
            </div>
          </div>

          {/* Contato */}
          <div className="footer__section">
            <h3 className="footer__section-title">Contato</h3>
            <div className="footer__contact-item">
              <span className="footer__contact-icon">📞</span>
              <a href="tel:+5511999999999" className="footer__contact-link">
                (11) 99999-9999
              </a>
            </div>
            <div className="footer__contact-item">
              <span className="footer__contact-icon">📧</span>
              <a href="mailto:contato@delivery.com" className="footer__contact-link">
                contato@delivery.com
              </a>
            </div>
            <div className="footer__contact-item">
              <span className="footer__contact-icon">📍</span>
              <span>São Paulo, SP - Brasil</span>
            </div>
            <div className="footer__contact-item">
              <span className="footer__contact-icon">🕒</span>
              <span>Atendimento 24h</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer__section">
            <div className="footer__newsletter">
              <h3 className="footer__newsletter-title">
                Newsletter
              </h3>
              <p className="footer__newsletter-description">
                Receba ofertas exclusivas e novidades em primeira mão!
              </p>
              <form onSubmit={handleNewsletterSubmit} className="footer__newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor email"
                  className="footer__newsletter-input"
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  className="footer__newsletter-button"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? 'Inscrevendo...' : 'Inscrever'}
                </button>
              </form>
              {subscriptionMessage && (
                <p style={{ 
                  fontSize: 'var(--font-size-xs)', 
                  marginTop: 'var(--spacing-sm)',
                  color: subscriptionMessage.includes('Erro') ? 'var(--error-color)' : 'var(--success-color)'
                }}>
                  {subscriptionMessage}
                </p>
              )}
            </div>
          </div>

          {/* Download Apps */}
          <div className="footer__section">
            <div className="footer__download">
              <h3 className="footer__download-title">Baixe nosso App</h3>
              <div className="footer__app-buttons">
                <a 
                  href="https://apps.apple.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__app-button"
                >
                  <span className="footer__app-icon">🍎</span>
                  <div className="footer__app-text">
                    <span className="footer__app-label">Download na</span>
                    <span className="footer__app-name">App Store</span>
                  </div>
                </a>
                <a 
                  href="https://play.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__app-button"
                >
                  <span className="footer__app-icon">📱</span>
                  <div className="footer__app-text">
                    <span className="footer__app-label">Baixar no</span>
                    <span className="footer__app-name">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Pagamentos */}
          <div className="footer__section">
            <div className="footer__payments">
              <h3 className="footer__payments-title">Formas de Pagamento</h3>
              <div className="footer__payment-methods">
                <div className="footer__payment-method" title="Cartão de Crédito">💳</div>
                <div className="footer__payment-method" title="Cartão de Débito">💰</div>
                <div className="footer__payment-method" title="PIX">🔗</div>
                <div className="footer__payment-method" title="Dinheiro">💵</div>
                <div className="footer__payment-method" title="Vale Refeição">🎫</div>
              </div>
              <div className="footer__security">
                <span className="footer__security-icon">🔒</span>
                <span className="footer__security-text">
                  Pagamentos seguros e protegidos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer__bottom">
        <div className="footer__main">
          <div className="footer__bottom-content">
            <div className="footer__copyright">
              © {currentYear} Delivery. Todos os direitos reservados.
            </div>
            <div className="footer__bottom-links">
              <Link to="/termos" className="footer__bottom-link">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="footer__bottom-link">
                Privacidade
              </Link>
              <Link to="/cookies" className="footer__bottom-link">
                Cookies
              </Link>
              <Link to="/acessibilidade" className="footer__bottom-link">
                Acessibilidade
              </Link>
              <Link to="/sitemap" className="footer__bottom-link">
                Mapa do Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;