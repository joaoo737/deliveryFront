import { api } from '../httpClient';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * API de autenticação
 */
export const authApi = {
  /**
   * Realiza login
   */
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Realiza registro de novo usuário
   */
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém dados do usuário atual
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Valida token atual
   */
  validateToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VALIDATE_TOKEN);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza token
   */
  refreshToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Desativa conta do usuário
   */
  deactivateAccount: async () => {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.ME + '/deactivate');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Validações para formulários de autenticação
 */
export const authValidations = {
  /**
   * Valida dados de login
   */
  validateLogin: (data) => {
    const errors = {};

    if (!data.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }

    if (!data.senha) {
      errors.senha = 'Senha é obrigatória';
    } else if (data.senha.length < 6) {
      errors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Valida dados de registro de cliente
   */
  validateClienteRegister: (data) => {
    const errors = {};

    // Email
    if (!data.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }

    // Senha
    if (!data.senha) {
      errors.senha = 'Senha é obrigatória';
    } else if (data.senha.length < 6) {
      errors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Nome
    if (!data.nome || data.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // CPF
    if (!data.cpf) {
      errors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(data.cpf.replace(/\D/g, ''))) {
      errors.cpf = 'CPF deve ter 11 dígitos';
    }

    // Telefone
    if (!data.telefoneCliente) {
      errors.telefoneCliente = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(data.telefoneCliente.replace(/\D/g, ''))) {
      errors.telefoneCliente = 'Telefone deve ter 10 ou 11 dígitos';
    }

    // Endereço
    if (!data.enderecoCliente || data.enderecoCliente.trim().length < 10) {
      errors.enderecoCliente = 'Endereço deve ter pelo menos 10 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Valida dados de registro de empresa
   */
  validateEmpresaRegister: (data) => {
    const errors = {};

    // Email
    if (!data.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }

    // Senha
    if (!data.senha) {
      errors.senha = 'Senha é obrigatória';
    } else if (data.senha.length < 6) {
      errors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Nome fantasia
    if (!data.nomeFantasia || data.nomeFantasia.trim().length < 2) {
      errors.nomeFantasia = 'Nome fantasia deve ter pelo menos 2 caracteres';
    }

    // CNPJ
    if (!data.cnpj) {
      errors.cnpj = 'CNPJ é obrigatório';
    } else if (!/^\d{14}$/.test(data.cnpj.replace(/\D/g, ''))) {
      errors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    // Telefone
    if (!data.telefoneEmpresa) {
      errors.telefoneEmpresa = 'Telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(data.telefoneEmpresa.replace(/\D/g, ''))) {
      errors.telefoneEmpresa = 'Telefone deve ter 10 ou 11 dígitos';
    }

    // Endereço
    if (!data.enderecoEmpresa || data.enderecoEmpresa.trim().length < 10) {
      errors.enderecoEmpresa = 'Endereço deve ter pelo menos 10 caracteres';
    }

    // Categoria
    if (!data.categoriaId) {
      errors.categoriaId = 'Categoria é obrigatória';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

/**
 * Helpers para autenticação
 */
export const authHelpers = {
  /**
   * Formata dados de registro de cliente
   */
  formatClienteRegister: (formData) => {
    return {
      email: formData.email.trim().toLowerCase(),
      senha: formData.senha,
      tipoUsuario: 'CLIENTE',
      nome: formData.nome.trim(),
      cpf: formData.cpf.replace(/\D/g, ''),
      telefoneCliente: formData.telefoneCliente.replace(/\D/g, ''),
      enderecoCliente: formData.enderecoCliente.trim()
    };
  },

  /**
   * Formata dados de registro de empresa
   */
  formatEmpresaRegister: (formData) => {
    return {
      email: formData.email.trim().toLowerCase(),
      senha: formData.senha,
      tipoUsuario: 'EMPRESA',
      nomeFantasia: formData.nomeFantasia.trim(),
      cnpj: formData.cnpj.replace(/\D/g, ''),
      telefoneEmpresa: formData.telefoneEmpresa.replace(/\D/g, ''),
      enderecoEmpresa: formData.enderecoEmpresa.trim(),
      categoriaId: parseInt(formData.categoriaId),
      descricao: formData.descricao ? formData.descricao.trim() : null
    };
  },

  /**
   * Formata dados de login
   */
  formatLogin: (formData) => {
    return {
      email: formData.email.trim().toLowerCase(),
      senha: formData.senha
    };
  },

  /**
   * Verifica se o usuário tem permissão
   */
  hasPermission: (user, requiredRole) => {
    if (!user || !user.tipoUsuario) return false;
    
    const roles = {
      ADMIN: 3,
      EMPRESA: 2,
      CLIENTE: 1
    };

    const userLevel = roles[user.tipoUsuario] || 0;
    const requiredLevel = roles[requiredRole] || 0;

    return userLevel >= requiredLevel;
  },

  /**
   * Verifica se é cliente
   */
  isCliente: (user) => {
    return user && user.tipoUsuario === 'CLIENTE';
  },

  /**
   * Verifica se é empresa
   */
  isEmpresa: (user) => {
    return user && user.tipoUsuario === 'EMPRESA';
  },

  /**
   * Verifica se é admin
   */
  isAdmin: (user) => {
    return user && user.tipoUsuario === 'ADMIN';
  },

  /**
   * Gera avatar padrão baseado no nome
   */
  generateAvatar: (name) => {
    if (!name) return null;
    
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substr(0, 2);
    
    const colors = [
      '#FF4621', '#e63e1a', '#ff6542', '#cc3617',
      '#28a745', '#17a2b8', '#ffc107', '#dc3545'
    ];
    
    const colorIndex = name.length % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return {
      initials,
      backgroundColor,
      textColor: '#ffffff'
    };
  },

  /**
   * Valida força da senha
   */
  validatePasswordStrength: (password) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let strength = 'Muito fraca';
    let color = '#dc3545';
    
    if (score >= 4) {
      strength = 'Forte';
      color = '#28a745';
    } else if (score >= 3) {
      strength = 'Média';
      color = '#ffc107';
    } else if (score >= 2) {
      strength = 'Fraca';
      color = '#FF4621';
    }

    return {
      score,
      strength,
      color,
      checks
    };
  }
};

/**
 * Constantes de autenticação
 */
export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos
  
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Email ou senha incorretos',
    ACCOUNT_LOCKED: 'Conta temporariamente bloqueada. Tente novamente em alguns minutos',
    EMAIL_EXISTS: 'Este email já está cadastrado',
    CPF_EXISTS: 'Este CPF já está cadastrado',
    CNPJ_EXISTS: 'Este CNPJ já está cadastrado',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet',
    SERVER_ERROR: 'Erro interno. Tente novamente mais tarde'
  },

  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    REGISTER_SUCCESS: 'Cadastro realizado com sucesso!',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
    PASSWORD_CHANGED: 'Senha alterada com sucesso!',
    PROFILE_UPDATED: 'Perfil atualizado com sucesso!'
  }
};

export default authApi;