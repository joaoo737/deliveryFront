import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../../utils/validators';
import { ButtonLoading } from '../../common/Loading/Loading';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const senhaError = validatePassword(formData.senha);
    if (senhaError) errors.senha = senhaError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <div className="login-form__header">
        <h2 className="login-form__title">Entrar</h2>
        <p className="login-form__subtitle">
          Acesse sua conta para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="login-form__form">
        {error && (
          <div className="login-form__error">
            <span className="login-form__error-icon">⚠️</span>
            <span className="login-form__error-text">{error}</span>
          </div>
        )}

        <div className="login-form__field">
          <label htmlFor="email" className="login-form__label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`login-form__input ${validationErrors.email ? 'login-form__input--error' : ''}`}
            placeholder="seu@email.com"
            disabled={isLoading}
          />
          {validationErrors.email && (
            <span className="login-form__field-error">
              {validationErrors.email}
            </span>
          )}
        </div>

        <div className="login-form__field">
          <label htmlFor="senha" className="login-form__label">
            Senha
          </label>
          <div className="login-form__password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={`login-form__input ${validationErrors.senha ? 'login-form__input--error' : ''}`}
              placeholder="Sua senha"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="login-form__password-toggle"
              disabled={isLoading}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {validationErrors.senha && (
            <span className="login-form__field-error">
              {validationErrors.senha}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="login-form__submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <ButtonLoading size="medium" />
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="login-form__footer">
        <p className="login-form__footer-text">
          Ainda não tem uma conta?{' '}
          <Link to="/register" className="login-form__footer-link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;