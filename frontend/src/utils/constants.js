
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/user/me',
    VALIDATE_TOKEN: '/auth/user/validate-token',
    REFRESH: '/auth/user/refresh'
  },

  CLIENTE: {
    PERFIL: '/cliente/perfil',
    PEDIDOS: '/cliente/pedidos',
    FEEDBACKS: '/cliente/feedbacks'
  },

  EMPRESA: {
    PERFIL: '/empresa/perfil',
    PRODUTOS: '/empresa/produtos',
    PEDIDOS: '/empresa/pedidos',
    FEEDBACKS: '/empresa/feedbacks',
    RELATORIOS: '/empresa/relatorios'
  },

  PUBLICO: {
    BUSCA: '/publico/busca',
    CATEGORIAS: '/publico/categorias'
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    EMPRESAS: '/admin/empresas',
    CATEGORIAS: '/admin/categorias'
  }
};

export const STATUS_PEDIDO = {
  PENDENTE: 'PENDENTE',
  CONFIRMADO: 'CONFIRMADO',
  PREPARANDO: 'PREPARANDO',
  PRONTO: 'PRONTO',
  ENTREGUE: 'ENTREGUE',
  CANCELADO: 'CANCELADO'
};

export const STATUS_PEDIDO_LABELS = {
  [STATUS_PEDIDO.PENDENTE]: 'Pendente',
  [STATUS_PEDIDO.CONFIRMADO]: 'Confirmado',
  [STATUS_PEDIDO.PREPARANDO]: 'Preparando',
  [STATUS_PEDIDO.PRONTO]: 'Pronto',
  [STATUS_PEDIDO.ENTREGUE]: 'Entregue',
  [STATUS_PEDIDO.CANCELADO]: 'Cancelado'
};

export const STATUS_PEDIDO_COLORS = {
  [STATUS_PEDIDO.PENDENTE]: '#ffc107',
  [STATUS_PEDIDO.CONFIRMADO]: '#17a2b8',
  [STATUS_PEDIDO.PREPARANDO]: '#FF4621',
  [STATUS_PEDIDO.PRONTO]: '#28a745',
  [STATUS_PEDIDO.ENTREGUE]: '#6f42c1',
  [STATUS_PEDIDO.CANCELADO]: '#dc3545'
};

export const STATUS_PAGAMENTO = {
  PENDENTE: 'PENDENTE',
  PAGO: 'PAGO',
  CANCELADO: 'CANCELADO'
};

export const STATUS_PAGAMENTO_LABELS = {
  [STATUS_PAGAMENTO.PENDENTE]: 'Pendente',
  [STATUS_PAGAMENTO.PAGO]: 'Pago',
  [STATUS_PAGAMENTO.CANCELADO]: 'Cancelado'
};

export const FORMA_PAGAMENTO = {
  DINHEIRO: 'DINHEIRO',
  CARTAO_CREDITO: 'CARTAO_CREDITO',
  CARTAO_DEBITO: 'CARTAO_DEBITO',
  PIX: 'PIX'
};

export const FORMA_PAGAMENTO_LABELS = {
  [FORMA_PAGAMENTO.DINHEIRO]: 'Dinheiro',
  [FORMA_PAGAMENTO.CARTAO_CREDITO]: 'Cartão de Crédito',
  [FORMA_PAGAMENTO.CARTAO_DEBITO]: 'Cartão de Débito',
  [FORMA_PAGAMENTO.PIX]: 'PIX'
};

export const TIPO_USUARIO = {
  CLIENTE: 'CLIENTE',
  EMPRESA: 'EMPRESA',
  ADMIN: 'ADMIN'
};

export const TIPO_USUARIO_LABELS = {
  [TIPO_USUARIO.CLIENTE]: 'Cliente',
  [TIPO_USUARIO.EMPRESA]: 'Empresa',
  [TIPO_USUARIO.ADMIN]: 'Administrador'
};

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  MAX_SIZE: 100,
  SIZES: [10, 20, 50, 100]
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Acesso não autorizado. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  GENERIC_ERROR: 'Ocorreu um erro inesperado.'
};

export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Salvo com sucesso!',
  UPDATE_SUCCESS: 'Atualizado com sucesso!',
  DELETE_SUCCESS: 'Removido com sucesso!',
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  REGISTER_SUCCESS: 'Cadastro realizado com sucesso!'
};

export const VALIDATION = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  CPF_REGEX: /^\d{11}$/,
  CNPJ_REGEX: /^\d{14}$/,
  TELEFONE_REGEX: /^\d{10,11}$/,
  CEP_REGEX: /^\d{8}$/,
  
  MIN_PASSWORD_LENGTH: 6,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_COMMENT_LENGTH: 500,
  
  MIN_PRICE: 0.01,
  MAX_PRICE: 999999.99,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999,
  MIN_STOCK: 0,
  MAX_STOCK: 9999,
  
  MIN_RATING: 1,
  MAX_RATING: 5
};

export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

export const LOCATION = {
  DEFAULT_LATITUDE: -28.4818,
  DEFAULT_LONGITUDE: -49.0047,
  DEFAULT_RADIUS: 10,
  MAX_RADIUS: 50
};

export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
};

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const NOTIFICATION = {
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000
  },
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
};

export const DATE_FORMATS = {
  DATE: 'dd/MM/yyyy',
  DATETIME: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm',
  ISO_DATE: 'yyyy-MM-dd',
  ISO_DATETIME: 'yyyy-MM-dd HH:mm:ss'
};

export const STORAGE_KEYS = {
  TOKEN: 'delivery_token',
  USER: 'delivery_user',
  THEME: 'delivery_theme',
  LANGUAGE: 'delivery_language',
  CART: 'delivery_cart',
  LOCATION: 'delivery_location'
};

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 14,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
};