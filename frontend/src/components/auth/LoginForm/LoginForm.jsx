import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { authValidations } from '../../../services/api/authApi';
import { TIPO_USUARIO } from '../../../utils/constants';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    tipoUsuario: TIPO_USUARIO.CLIENTE
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate form
    const validation = authValidations.validateLogin(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData);
      // Redirect based on user type
      if (response.user.tipoUsuario === TIPO_USUARIO.CLIENTE) {
        navigate('/');
      } else if (response.user.tipoUsuario === TIPO_USUARIO.EMPRESA) {
        navigate('/empresa/dashborad');
      } else {
        navigate('/');
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        {apiError && (
          <div className="error-message">
            {apiError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Seu email"
            disabled={loading}
          />
          {errors.email && (
            <span className="error-text">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            className={errors.senha ? 'error' : ''}
            placeholder="Sua senha"
            disabled={loading}
          />
          {errors.senha && (
            <span className="error-text">{errors.senha}</span>
          )}
        </div>

        <div className="form-group">
          <label>Tipo de Usuário</label>
          <div className="user-type-toggle">
            <label className={`user-type-option ${formData.tipoUsuario === TIPO_USUARIO.CLIENTE ? 'active' : ''}`}>
              <input
                type="radio"
                name="tipoUsuario"
                value={TIPO_USUARIO.CLIENTE}
                checked={formData.tipoUsuario === TIPO_USUARIO.CLIENTE}
                onChange={handleChange}
                disabled={loading}
              />
              Cliente
            </label>
            <label className={`user-type-option ${formData.tipoUsuario === TIPO_USUARIO.EMPRESA ? 'active' : ''}`}>
              <input
                type="radio"
                name="tipoUsuario"
                value={TIPO_USUARIO.EMPRESA}
                checked={formData.tipoUsuario === TIPO_USUARIO.EMPRESA}
                onChange={handleChange}
                disabled={loading}
              />
              Empresa
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="form-footer">
          <p>
            Não tem uma conta?{' '}
            <a href="/register" className="link">
              Cadastre-se
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
