import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../../components/auth/RegisterForm/RegisterForm';
import Header from '../../../components/common/Header/Header';
import Footer from '../../../components/common/Footer/Footer';
import './Register.css';

const Register = () => {
  return (
    <div className="register-page">
      <Header />
      
      <main className="register-page__main">
        <div className="register-page__container">
          <div className="register-page__hero">
            <div className="register-page__hero-content">
              <h1 className="register-page__title">
                Junte-se a nós! 🚀
              </h1>
              <p className="register-page__subtitle">
                Crie sua conta e descubra uma nova forma de pedir comida
              </p>
              
              <div className="register-page__benefits">
                <div className="register-page__benefit">
                  <span className="register-page__benefit-icon">✅</span>
                  <span className="register-page__benefit-text">Cadastro rápido e gratuito</span>
                </div>
                <div className="register-page__benefit">
                  <span className="register-page__benefit-icon">🎯</span>
                  <span className="register-page__benefit-text">Recomendações personalizadas</span>
                </div>
                <div className="register-page__benefit">
                  <span className="register-page__benefit-icon">🏆</span>
                  <span className="register-page__benefit-text">Ofertas exclusivas</span>
                </div>
                <div className="register-page__benefit">
                  <span className="register-page__benefit-icon">📱</span>
                  <span className="register-page__benefit-text">Acompanhe seus pedidos em tempo real</span>
                </div>
              </div>
            </div>
            
            <div className="register-page__stats">
              <div className="register-page__stat">
                <div className="register-page__stat-number">1000+</div>
                <div className="register-page__stat-label">Restaurantes</div>
              </div>
              <div className="register-page__stat">
                <div className="register-page__stat-number">50k+</div>
                <div className="register-page__stat-label">Clientes</div>
              </div>
              <div className="register-page__stat">
                <div className="register-page__stat-number">4.8⭐</div>
                <div className="register-page__stat-label">Avaliação</div>
              </div>
            </div>
          </div>
          
          <div className="register-page__form-section">
            <div className="register-page__form-header">
              <h2 className="register-page__form-title">
                Criar Conta
              </h2>
              <p className="register-page__form-subtitle">
                Preencha os dados abaixo para começar
              </p>
            </div>
            
            <RegisterForm />
            
            <div className="register-page__login-link">
              <p className="register-page__login-text">
                Já tem uma conta?
              </p>
              <Link to="/login" className="register-page__login-btn">
                Fazer login
              </Link>
            </div>
          </div>
        </div>
        
        <div className="register-page__testimonials">
          <div className="register-page__testimonials-container">
            <h3 className="register-page__testimonials-title">
              O que nossos usuários dizem
            </h3>
            
            <div className="register-page__testimonials-grid">
              <div className="register-page__testimonial">
                <div className="register-page__testimonial-content">
                  <p className="register-page__testimonial-text">
                    "Melhor app de delivery que já usei! Entrega sempre no prazo e comida deliciosa."
                  </p>
                  <div className="register-page__testimonial-author">
                    <div className="register-page__testimonial-avatar">M</div>
                    <div className="register-page__testimonial-info">
                      <div className="register-page__testimonial-name">Maria Silva</div>
                      <div className="register-page__testimonial-rating">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="register-page__testimonial">
                <div className="register-page__testimonial-content">
                  <p className="register-page__testimonial-text">
                    "Interface muito intuitiva e variedade incrível de restaurantes. Recomendo!"
                  </p>
                  <div className="register-page__testimonial-author">
                    <div className="register-page__testimonial-avatar">J</div>
                    <div className="register-page__testimonial-info">
                      <div className="register-page__testimonial-name">João Santos</div>
                      <div className="register-page__testimonial-rating">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="register-page__testimonial">
                <div className="register-page__testimonial-content">
                  <p className="register-page__testimonial-text">
                    "Atendimento excelente e preços justos. Virou meu app favorito!"
                  </p>
                  <div className="register-page__testimonial-author">
                    <div className="register-page__testimonial-avatar">A</div>
                    <div className="register-page__testimonial-info">
                      <div className="register-page__testimonial-name">Ana Costa</div>
                      <div className="register-page__testimonial-rating">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;