import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateCPF, 
  validateCNPJ, 
  validatePhone 
} from '../../../utils/validators';
import { formatCPF, formatCNPJ, formatPhone } from '../../../utils/formatters';
import { ButtonLoading } from '../../common/Loading/Loading';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Tipo de usuário, 2: Dados básicos, 3: Dados específicos
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    confirmarSenha: '',
    
    // Cliente
    nome: '',
    cpf: '',
    telefoneCliente: '',
    enderecoCliente: '',
    
    // Empresa
    nomeFantasia: '',
    cnpj: '',
    telefoneEmpresa: '',
    enderecoEmpresa: '',
    categoriaId: '',
    descricao: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Carregar categorias quando selecionar empresa
  useEffect(() => {
    if (tipoUsuario === 'EMPRESA') {
      carregarCategorias();
    }
  }, [tipoUsuario]);

  const carregarCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const response = await api.get(API_ENDPOINTS.PUBLICO.CATEGORIAS);
      setCategorias(response);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const handleTipoUsuarioSelect = (tipo) => {
    setTipoUsuario(tipo);
    setStep(2);
    clearError();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Aplicar formatação em tempo real
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'telefoneCliente' || name === 'telefoneEmpresa') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Limpar erro específico
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

  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber === 2) {
      // Validar dados básicos
      const emailError = validateEmail(formData.email);
      if (emailError) errors.email = emailError;
      
      const senhaError = validatePassword(formData.senha);
      if (senhaError) errors.senha = senhaError;
      
      if (!formData.confirmarSenha) {
        errors.confirmarSenha = 'Confirmação de senha é obrigatória';
      } else if (formData.senha !== formData.confirmarSenha) {
        errors.confirmarSenha = 'Senhas não coincidem';
      }
    }
    
    if (stepNumber === 3) {
      if (tipoUsuario === 'CLIENTE') {
        const nomeError = validateName(formData.nome);
        if (nomeError) errors.nome = nomeError;
        
        const cpfError = validateCPF(formData.cpf);
        if (cpfError) errors.cpf = cpfError;
        
        const telefoneError = validatePhone(formData.telefoneCliente);
        if (telefoneError) errors.telefoneCliente = telefoneError;
        
        if (!formData.enderecoCliente || formData.enderecoCliente.trim().length < 10) {
          errors.enderecoCliente = 'Endereço deve ter pelo menos 10 caracteres';
        }
      } else if (tipoUsuario === 'EMPRESA') {
        const nomeFantasiaError = validateName(formData.nomeFantasia);
        if (nomeFantasiaError) errors.nomeFantasia = nomeFantasiaError;
        
        const cnpjError = validateCNPJ(formData.cnpj);
        if (cnpjError) errors.cnpj = cnpjError;
        
        const telefoneError = validatePhone(formData.telefoneEmpresa);
        if (telefoneError) errors.telefoneEmpresa = telefoneError;
        
        if (!formData.enderecoEmpresa || formData.enderecoEmpresa.trim().length < 10) {
          errors.enderecoEmpresa = 'Endereço deve ter pelo menos 10 caracteres';
        }
        
        if (!formData.categoriaId) {
          errors.categoriaId = 'Categoria é obrigatória';
        }
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    try {
      const registerData = {
        email: formData.email,
        senha: formData.senha,
        tipoUsuario,
        ...formData
      };
      
      await register(registerData);
      navigate('/');
    } catch (err) {
      console.error('Erro no cadastro:', err);
    }
  };

  const renderStepIndicator = () => (
    <div className="register-form__steps">
      <div className={`register-form__step ${step >= 1 ? 'register-form__step--active' : ''}`}>
        <span className="register-form__step-number">1</span>
        <span className="register-form__step-label">Tipo</span>
      </div>
      <div className={`register-form__step ${step >= 2 ? 'register-form__step--active' : ''}`}>
        <span className="register-form__step-number">2</span>
        <span className="register-form__step-label">Dados</span>
      </div>
      <div className={`register-form__step ${step >= 3 ? 'register-form__step--active' : ''}`}>
        <span className="register-form__step-number">3</span>
        <span className="register-form__step-label">Perfil</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="register-form__step-content">
      <h3 className="register-form__step-title">Escolha o tipo de conta</h3>
      <p className="register-form__step-description">
        Selecione se você é um cliente ou uma empresa
      </p>
      
      <div className="register-form__user-types">
        <button
          type="button"
          className="register-form__user-type"
          onClick={() => handleTipoUsuarioSelect('CLIENTE')}
        >
          <div className="register-form__user-type-icon">👤</div>
          <h4 className="register-form__user-type-title">Cliente</h4>
          <p className="register-form__user-type-description">
            Faça pedidos e acompanhe suas entregas
          </p>
        </button>
        
        <button
          type="button"
          className="register-form__user-type"
          onClick={() => handleTipoUsuarioSelect('EMPRESA')}
        >
          <div className="register-form__user-type-icon">🏢</div>
          <h4 className="register-form__user-type-title">Empresa</h4>
          <p className="register-form__user-type-description">
            Cadastre produtos e gerencie pedidos
          </p>
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="register-form__step-content">
      <h3 className="register-form__step-title">Dados de acesso</h3>
      <p className="register-form__step-description">
        Crie suas credenciais de login
      </p>
      
      {error && (
        <div className="register-form__error">
          <span className="register-form__error-icon">⚠️</span>
          <span className="register-form__error-text">{error}</span>
        </div>
      )}
      
      <div className="register-form__fields">
        <div className="register-form__field">
          <label htmlFor="email" className="register-form__label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`register-form__input ${validationErrors.email ? 'register-form__input--error' : ''}`}
            placeholder="seu@email.com"
          />
          {validationErrors.email && (
            <span className="register-form__field-error">{validationErrors.email}</span>
          )}
        </div>
        
        <div className="register-form__field">
          <label htmlFor="senha" className="register-form__label">Senha</label>
          <div className="register-form__password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={`register-form__input ${validationErrors.senha ? 'register-form__input--error' : ''}`}
              placeholder="Sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="register-form__password-toggle"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {validationErrors.senha && (
            <span className="register-form__field-error">{validationErrors.senha}</span>
          )}
        </div>
        
        <div className="register-form__field">
          <label htmlFor="confirmarSenha" className="register-form__label">Confirmar Senha</label>
          <div className="register-form__password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className={`register-form__input ${validationErrors.confirmarSenha ? 'register-form__input--error' : ''}`}
              placeholder="Confirme sua senha"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="register-form__password-toggle"
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {validationErrors.confirmarSenha && (
            <span className="register-form__field-error">{validationErrors.confirmarSenha}</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="register-form__step-content">
      <h3 className="register-form__step-title">
        {tipoUsuario === 'CLIENTE' ? 'Dados pessoais' : 'Dados da empresa'}
      </h3>
      <p className="register-form__step-description">
        Complete seu perfil para finalizar o cadastro
      </p>
      
      <div className="register-form__fields">
        {tipoUsuario === 'CLIENTE' ? (
          <>
            <div className="register-form__field">
              <label htmlFor="nome" className="register-form__label">Nome completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`register-form__input ${validationErrors.nome ? 'register-form__input--error' : ''}`}
                placeholder="Seu nome completo"
              />
              {validationErrors.nome && (
                <span className="register-form__field-error">{validationErrors.nome}</span>
              )}
            </div>
            
            <div className="register-form__field">
              <label htmlFor="cpf" className="register-form__label">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={`register-form__input ${validationErrors.cpf ? 'register-form__input--error' : ''}`}
                placeholder="000.000.000-00"
                maxLength="14"
              />
              {validationErrors.cpf && (
                <span className="register-form__field-error">{validationErrors.cpf}</span>
              )}
            </div>
            
            <div className="register-form__field">
              <label htmlFor="telefoneCliente" className="register-form__label">Telefone</label>
              <input
                type="text"
                id="telefoneCliente"
                name="telefoneCliente"
                value={formData.telefoneCliente}
                onChange={handleChange}
                className={`register-form__input ${validationErrors.telefoneCliente ? 'register-form__input--error' : ''}`}
                placeholder="(00) 00000-0000"
                maxLength="15"
              />
              {validationErrors.telefoneCliente && (
                <span className="register-form__field-error">{validationErrors.telefoneCliente}</span>
              )}
            </div>
            
            <div className="register-form__field">
              <label htmlFor="enderecoCliente" className="register-form__label">Endereço</label>
              <textarea
                id="enderecoCliente"
                name="enderecoCliente"
                value={formData.enderecoCliente}
                onChange={handleChange}
                className={`register-form__textarea ${validationErrors.enderecoCliente ? 'register-form__input--error' : ''}`}
                placeholder="Rua, número, bairro, cidade"
                rows="3"
              />
              {validationErrors.enderecoCliente && (
                <span className="register-form__field-error">{validationErrors.enderecoCliente}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="register-form__field">
              <label htmlFor="nomeFantasia" className="register-form__label">Nome da empresa</label>
              <input
                type="text"
                id="nomeFantasia"
                name="nomeFantasia"
                value={formData.nomeFantasia}
                onChange={handleChange}
                className={`register-form__input ${validationErrors.nomeFantasia ? 'register-form__input--error' : ''}`}
                placeholder="Nome fantasia da empresa"
              />
              {validationErrors.nomeFantasia && (
                <span className="register-form__field-error">{validationErrors.nomeFantasia}</span>
              )}
            </div>
            
            <div className="register-form__field">
              <label htmlFor="cnpj" className="register-form__label">CNPJ</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                className={`register-form__input ${validationErrors.cnpj ? 'register-form__input--error' : ''}`}
                placeholder="00.000.000/0000-00"
                maxLength="18"
              />
              {validationErrors.cnpj && (
                <span className="register-form__field-error">{validationErrors.cnpj}</span>
              )}
            </div>
            
            <div className="register-form__field">
              <label htmlFor="telefoneEmpresa" className="register-form__label">Telefone</label>
              <input
                type="text"
                id="telefoneEmpresa"
                name="telefoneEmpresa"
                value={formData.telefoneEmpresa}
                onChange={handleChange}
                className={`register-form__input ${validationErrors.telefoneEmpresa ? 'register-form__input--error' : ''}`}
                placeholder="(00) 00000-0000"
                maxLength="15"
              />
              {validationErrors.telefoneEmpresa && (
                <span className="register-form__field-error">{validationErrors.telefoneEmpresa}</span>
              )}
            </div>
            
            <div className="register-form__field">
              <label htmlFor="categoriaId" className="register-form__label">Categoria</label>
              <select
                id="categoriaId"
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                className={`register-form__select ${validationErrors.categoriaId ? 'register-form__input--error' : ''}`}
                disabled={loadingCategorias}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.icone} {categoria.nome}
                  </option>
                ))}
              </select>
              {validationErrors.categoriaId && (
                <span className="register-form__field-error">{validationErrors.categoriaId}</span>
              )}
            </div>
            
            <div className="register-form__field">
              <label htmlFor="enderecoEmpresa" className="register-form__label">Endereço</label>
              <textarea
                id="enderecoEmpresa"
                name="enderecoEmpresa"
                value={formData.enderecoEmpresa}
                onChange={handleChange}
                className={`register-form__textarea ${validationErrors.enderecoEmpresa ? 'register-form__input--error' : ''}`}
                placeholder="Rua, número, bairro, cidade"
                rows="3"
              />
              {validationErrors.enderecoEmpresa && (
                <span className="register-form__field-error">{validationErrors.enderecoEmpresa}</span>
              )}
            </div>
            
            <div className="register-form__field">
              <label htmlFor="descricao" className="register-form__label">Descrição (opcional)</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className="register-form__textarea"
                placeholder="Descreva sua empresa..."
                rows="3"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="register-form">
      <div className="register-form__header">
        <h2 className="register-form__title">Criar conta</h2>
        <p className="register-form__subtitle">
          Junte-se à nossa plataforma de delivery
        </p>
        {renderStepIndicator()}
      </div>

      <form onSubmit={handleSubmit} className="register-form__form">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        {step > 1 && (
          <div className="register-form__actions">
            <button
              type="button"
              onClick={handleBack}
              className="register-form__back-btn"
              disabled={isLoading}
            >
              Voltar
            </button>
            
            {step === 3 ? (
              <button
                type="submit"
                className="register-form__submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <ButtonLoading size="medium" />
                ) : (
                  'Criar conta'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="register-form__next-btn"
              >
                Continuar
              </button>
            )}
          </div>
        )}
      </form>

      <div className="register-form__footer">
        <p className="register-form__footer-text">
          Já tem uma conta?{' '}
          <Link to="/login" className="register-form__footer-link">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;