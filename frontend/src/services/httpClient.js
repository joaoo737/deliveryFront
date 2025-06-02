import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';
import { loadFromStorage, removeFromStorage } from '../utils/helpers';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = loadFromStorage(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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

httpClient.interceptors.response.use(
  (response) => {
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

    console.error('❌ Response Error:', {
      status: response?.status,
      url: error.config?.url,
      message: error.message,
      data: response?.data
    });

    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
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
      return Promise.reject({
        ...error,
        message: ERROR_MESSAGES.NETWORK_ERROR
      });
    } else {
      return Promise.reject({
        ...error,
        message: message || ERROR_MESSAGES.GENERIC_ERROR
      });
    }
  }
);

const handleUnauthorized = () => {
  removeFromStorage(STORAGE_KEYS.TOKEN);
  removeFromStorage(STORAGE_KEYS.USER);

  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

export const api = {
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

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await httpClient.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await httpClient.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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

  download: async (url, filename, config = {}) => {
    try {
      const response = await httpClient.get(url, {
        responseType: 'blob',
        ...config
      });

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

export const apiWithLoading = {
  get: (url, params, config, setLoading) => withLoading(() => api.get(url, params, config), setLoading),
  post: (url, data, config, setLoading) => withLoading(() => api.post(url, data, config), setLoading),
  put: (url, data, config, setLoading) => withLoading(() => api.put(url, data, config), setLoading),
  patch: (url, data, config, setLoading) => withLoading(() => api.patch(url, data, config), setLoading),
  delete: (url, config, setLoading) => withLoading(() => api.delete(url, config), setLoading),
  upload: (url, file, onProgress, config, setLoading) => withLoading(() => api.upload(url, file, onProgress, config), setLoading),
};

const withLoading = async (apiCall, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const result = await apiCall();
    return result;
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const createCancelToken = () => {
  return axios.CancelToken.source();
};

export const isCancel = (error) => {
  return axios.isCancel(error);
};

export const setRequestTimeout = (timeout) => {
  httpClient.defaults.timeout = timeout;
};

export const setBaseURL = (url) => {
  httpClient.defaults.baseURL = url;
};

export const setDefaultHeaders = (headers) => {
  Object.assign(httpClient.defaults.headers, headers);
};

export const removeDefaultHeader = (headerName) => {
  delete httpClient.defaults.headers[headerName];
};

export const apiWithRetry = {
  get: (url, params, config, retries = 3) => withRetry(() => api.get(url, params, config), retries),
  post: (url, data, config, retries = 3) => withRetry(() => api.post(url, data, config), retries),
  put: (url, data, config, retries = 3) => withRetry(() => api.put(url, data, config), retries),
  patch: (url, data, config, retries = 3) => withRetry(() => api.patch(url, data, config), retries),
  delete: (url, config, retries = 3) => withRetry(() => api.delete(url, config), retries),
};

const withRetry = async (apiCall, retries, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

export const checkOnlineStatus = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

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