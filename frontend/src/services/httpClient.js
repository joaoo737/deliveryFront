import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';
import { loadFromStorage, removeFromStorage } from '../utils/helpers';

// Criar instância do axios
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requisições - adiciona token de autenticação
httpClient.interceptors.request.use(
  (config) => {
    const token = loadFromStorage(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log da requisição em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas - trata erros globalmente
httpClient.interceptors.response.use(
  (response) => {
    // Log da resposta em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    
    return response;
  },
  (error) => {
    const { response, request, message } = error;
    
    // Log do erro
    console.error('❌ Response Error:', {
      status: response?.status,
      url: error.config?.url,
      message: error.message,
      data: response?.data
    });
    
    // Trata diferentes tipos de erro
    if (response) {
      // Erro de resposta do servidor
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Token inválido ou expirado
          handleUnauthorized();
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.UNAUTHORIZED
          });
          
        case 403:
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.FORBIDDEN
          });
          
        case 404:
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.NOT_FOUND
          });
          
        case 422:
        case 400:
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
            errors: data?.errors || data
          });
          
        case 500:
        case 502:
        case 503:
        case 504:
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.SERVER_ERROR
          });
          
        default:
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.GENERIC_ERROR
          });
      }
    } else if (request) {
      // Erro de rede
      return Promise.reject({
        ...error,
        message: ERROR_MESSAGES.NETWORK_ERROR
      });
    } else {
      // Erro de configuração
      return Promise.reject({
        ...error,
        message: message || ERROR_MESSAGES.GENERIC_ERROR
      });
    }
  }
);

// Função para lidar com não autorizado
const handleUnauthorized = () => {
  // Remove dados de autenticação
  removeFromStorage(STORAGE_KEYS.TOKEN);
  removeFromStorage(STORAGE_KEYS.USER);
  
  // Redireciona para login se não estiver na página de login
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// Métodos HTTP customizados
export const api = {
  // GET
  get: async (url, params = {}, config = {}) => {
    try {
      const response = await httpClient.get(url, {
        params,
        ...config
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // POST
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // PUT
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // PATCH
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // DELETE
  delete: async (url, config = {}) => {
    try {
      const response = await httpClient.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Upload de arquivo
  upload: async (url, file, onProgress = null, config = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await httpClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
        ...config
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Download de arquivo
  download: async (url, filename, config = {}) => {
    try {
      const response = await httpClient.get(url, {
        responseType: 'blob',
        ...config
      });
      
      // Criar link para download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Wrapper para requisições com loading
export const apiWithLoading = {
  get: (url, params, config, setLoading) => withLoading(() => api.get(url, params, config), setLoading),
  post: (url, data, config, setLoading) => withLoading(() => api.post(url, data, config), setLoading),
  put: (url, data, config, setLoading) => withLoading(() => api.put(url, data, config), setLoading),
  patch: (url, data, config, setLoading) => withLoading(() => api.patch(url, data, config), setLoading),
  delete: (url, config, setLoading) => withLoading(() => api.delete(url, config), setLoading),
  upload: (url, file, onProgress, config, setLoading) => withLoading(() => api.upload(url, file, onProgress, config), setLoading),
};

// Função helper para controlar loading
const withLoading = async (apiCall, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const result = await apiCall();
    return result;
  } finally {
    if (setLoading) setLoading(false);
  }
};

// Cancelamento de requisições
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export const isCancel = (error) => {
  return axios.isCancel(error);
};

// Configuração de timeout personalizado
export const setRequestTimeout = (timeout) => {
  httpClient.defaults.timeout = timeout;
};

// Função para definir base URL dinamicamente
export const setBaseURL = (url) => {
  httpClient.defaults.baseURL = url;
};

// Função para adicionar headers customizados
export const setDefaultHeaders = (headers) => {
  Object.assign(httpClient.defaults.headers, headers);
};

// Função para remover header
export const removeDefaultHeader = (headerName) => {
  delete httpClient.defaults.headers[headerName];
};

// Retry automático para requisições falhadas
export const apiWithRetry = {
  get: (url, params, config, retries = 3) => withRetry(() => api.get(url, params, config), retries),
  post: (url, data, config, retries = 3) => withRetry(() => api.post(url, data, config), retries),
  put: (url, data, config, retries = 3) => withRetry(() => api.put(url, data, config), retries),
  patch: (url, data, config, retries = 3) => withRetry(() => api.patch(url, data, config), retries),
  delete: (url, config, retries = 3) => withRetry(() => api.delete(url, config), retries),
};

// Função helper para retry
const withRetry = async (apiCall, retries, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Não fazer retry para erros de cliente (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }
      
      // Aguardar antes do próximo retry
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// Função para verificar se está online
export const checkOnlineStatus = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

// Rate limiting
const requestQueue = [];
const maxConcurrentRequests = 10;
let activeRequests = 0;

const processQueue = () => {
  if (activeRequests >= maxConcurrentRequests || requestQueue.length === 0) {
    return;
  }
  
  const { request, resolve, reject } = requestQueue.shift();
  activeRequests++;
  
  request()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      activeRequests--;
      processQueue();
    });
};

export const queuedRequest = (requestFunction) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      request: requestFunction,
      resolve,
      reject
    });
    processQueue();
  });
};

export default httpClient;