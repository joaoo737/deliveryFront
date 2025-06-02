import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../../components/auth/LoginForm/LoginForm';
import Header from '../../../components/common/Header/Header';
import Footer from '../../../components/common/Footer/Footer';
import './Login.css';

const Login = () => {
  return (
    <div className="login-page">
      <Header />
      
      <main className="login-page__main">
        <div className="login-page__container">
          <div className="login-page__content">
            <div className="login-page__hero">
              <div className="login-page__hero-content">
                <h1 className="login-page__title">
                  Bem-vindo de volta! 👋
                </h1>
                <p className="login-page__subtitle">
                  Entre na sua conta para continuar aproveitando nossos serviços
                </p>
              </div>
            </div>
            
            <div className="login-page__form-section">
              <LoginForm />
              
              <div className="login-page__divider">
                <span className="login-page__divider-text">ou</span>
              </div>
              
              <div className="login-page__register-link">
                <p className="login-page__register-text">
                  Ainda não tem uma conta?
                </p>
                <Link to="/register" className="login-page__register-btn">
                  Criar conta gratuita
                </Link>
              </div>
            </div>
          </div>
          
          <div className="login-page__features">
            <div className="login-page__feature">
              <div className="login-page__feature-icon">🍕</div>
              <h3 className="login-page__feature-title">Variedade</h3>
              <p className="login-page__feature-description">
                Milhares de opções de restaurantes e produtos
              </p>
            </div>
            
            <div className="login-page__feature">
              <div className="login-page__feature-icon">🚚</div>
              <h3 className="login-page__feature-title">Entrega Rápida</h3>
              <p className="login-page__feature-description">
                Receba seus pedidos no conforto da sua casa
              </p>
            </div>
            
            <div className="login-page__feature">
              <div className="login-page__feature-icon">💳</div>
              <h3 className="login-page__feature-title">Pagamento Fácil</h3>
              <p className="login-page__feature-description">
                Pague com cartão, PIX ou dinheiro
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;