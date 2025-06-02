import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { authValidations, authHelpers } from '../../../services/api/authApi';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [userType, setUserType] = useState('CLIENTE');
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    cpf: '',
    telefoneCliente: '',
    enderecoCliente: '',
    nomeFantasia: '',
    cnpj: '',
    telefoneEmpresa: '',
    enderecoEmpresa: '',
    categoriaId: '',
    descricao: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (userType === 'EMPRESA') {
      loadCategorias();
    }
  }, [userType]);

  const loadCategorias = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PUBLICO.CATEGORIAS);
      setCategorias(response);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setApiError('Erro ao carregar categorias. Tente novamente.');
    }
  };

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

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate form based on user type
    const validation = userType === 'CLIENTE' 
      ? authValidations.validateClienteRegister(formData)
      : authValidations.validateEmpresaRegister(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Format data based on user type
    const userData = userType === 'CLIENTE'
      ? authHelpers.formatClienteRegister(formData)
      : authHelpers.formatEmpresaRegister(formData);

    setLoading(true);
    try {
      await register(userData);
      navigate('/');
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Cadastro</h2>
        
        {apiError && (
          <div className="error-message">
            {apiError}
          </div>
        )}

        <div className="form-group">
          <label>Tipo de Usuário</label>
          <div className="user-type-toggle">
            <label className={`user-type-option ${userType === 'CLIENTE' ? 'active' : ''}`}>
              <input
                type="radio"
                name="userType"
                value="CLIENTE"
                checked={userType === 'CLIENTE'}
                onChange={handleUserTypeChange}
              />
              Cliente
            </label>
            <label className={`user-type-option ${userType === 'EMPRESA' ? 'active' : ''}`}>
              <input
                type="radio"
                name="userType"
                value="EMPRESA"
                checked={userType === 'EMPRESA'}
                onChange={handleUserTypeChange}
              />
              Empresa
            </label>
          </div>
        </div>

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

        {userType === 'CLIENTE' ? (
          <>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={errors.nome ? 'error' : ''}
                placeholder="Seu nome completo"
                disabled={loading}
              />
              {errors.nome && (
                <span className="error-text">{errors.nome}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={errors.cpf ? 'error' : ''}
                placeholder="Seu CPF"
                disabled={loading}
              />
              {errors.cpf && (
                <span className="error-text">{errors.cpf}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefoneCliente">Telefone</label>
              <input
                type="tel"
                id="telefoneCliente"
                name="telefoneCliente"
                value={formData.telefoneCliente}
                onChange={handleChange}
                className={errors.telefoneCliente ? 'error' : ''}
                placeholder="Seu telefone"
                disabled={loading}
              />
              {errors.telefoneCliente && (
                <span className="error-text">{errors.telefoneCliente}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="enderecoCliente">Endereço</label>
              <input
                type="text"
                id="enderecoCliente"
                name="enderecoCliente"
                value={formData.enderecoCliente}
                onChange={handleChange}
                className={errors.enderecoCliente ? 'error' : ''}
                placeholder="Seu endereço completo"
                disabled={loading}
              />
              {errors.enderecoCliente && (
                <span className="error-text">{errors.enderecoCliente}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="nomeFantasia">Nome Fantasia</label>
              <input
                type="text"
                id="nomeFantasia"
                name="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={handleChange}
                className={errors.nomeFantasia ? 'error' : ''}
                placeholder="Nome da sua empresa"
                disabled={loading}
              />
              {errors.nomeFantasia && (
                <span className="error-text">{errors.nomeFantasia}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className={errors.cnpj ? 'error' : ''}
                placeholder="CNPJ da empresa"
                disabled={loading}
              />
              {errors.cnpj && (
                <span className="error-text">{errors.cnpj}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefoneEmpresa">Telefone</label>
              <input
                type="tel"
                id="telefoneEmpresa"
                name="telefoneEmpresa"
                value={formData.telefoneEmpresa}
                onChange={handleChange}
                className={errors.telefoneEmpresa ? 'error' : ''}
                placeholder="Telefone da empresa"
                disabled={loading}
              />
              {errors.telefoneEmpresa && (
                <span className="error-text">{errors.telefoneEmpresa}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="enderecoEmpresa">Endereço</label>
              <input
                type="text"
                id="enderecoEmpresa"
                name="enderecoEmpresa"
                value={formData.enderecoEmpresa}
                onChange={handleChange}
                className={errors.enderecoEmpresa ? 'error' : ''}
                placeholder="Endereço da empresa"
                disabled={loading}
              />
              {errors.enderecoEmpresa && (
                <span className="error-text">{errors.enderecoEmpresa}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="categoriaId">Categoria</label>
              <select
                id="categoriaId"
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                className={errors.categoriaId ? 'error' : ''}
                disabled={loading}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <span className="error-text">{errors.categoriaId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className={errors.descricao ? 'error' : ''}
                placeholder="Descrição da sua empresa"
                disabled={loading}
              />
              {errors.descricao && (
                <span className="error-text">{errors.descricao}</span>
              )}
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <div className="form-footer">
          <p>
            Já tem uma conta?{' '}
            <a href="/login" className="link">
              Faça login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
