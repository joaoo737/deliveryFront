import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../services/api/authApi';
import { authStorage, userStorage } from '../services/storage';

// Estados do contexto de autenticação
const AUTH_ACTIONS = {
  LOADING: 'LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Reducer para gerenciar estado de autenticação
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };

    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Criar contexto
const AuthContext = createContext();

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticação ao carregar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Verificar status de autenticação
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING });

      const token = authStorage.getToken();
      const user = userStorage.getUser();

      if (token && user) {
        // Validar token com o servidor
        try {
          const response = await authApi.validateToken();
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: response.user || user,
              token
            }
          });
        } catch (error) {
          // Token inválido, limpar dados
          await logout();
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Fazer login
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING });

      const response = await authApi.login(credentials);
      
      // Salvar dados no storage
      authStorage.setToken(response.token);
      userStorage.setUser({
        id: response.userId,
        email: response.email,
        tipoUsuario: response.tipoUsuario
      });

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: {
            id: response.userId,
            email: response.email,
            tipoUsuario: response.tipoUsuario
          },
          token: response.token
        }
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: {
          error: error.message || 'Erro ao fazer login'
        }
      });
      throw error;
    }
  };

  // Fazer registro
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOADING });

      const response = await authApi.register(userData);
      
      // Salvar dados no storage
      authStorage.setToken(response.token);
      userStorage.setUser({
        id: response.userId,
        email: response.email,
        tipoUsuario: response.tipoUsuario
      });

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user: {
            id: response.userId,
            email: response.email,
            tipoUsuario: response.tipoUsuario
          },
          token: response.token
        }
      });

      return response;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: {
          error: error.message || 'Erro ao fazer cadastro'
        }
      });
      throw error;
    }
  };

  // Fazer logout
  const logout = async () => {
    try {
      // Limpar storage
      authStorage.removeToken();
      userStorage.removeUser();

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar estado local
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Atualizar dados do usuário
  const updateUser = async (updates) => {
    try {
      // Atualizar no storage
      userStorage.updateUser(updates);

      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updates
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  // Obter dados atuais do usuário
  const refreshUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      
      const userData = {
        id: response.id,
        email: response.email,
        tipoUsuario: response.tipoUsuario,
        ativo: response.ativo,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt
      };

      userStorage.setUser(userData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: userData
      });

      return userData;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  };

  // Limpar erro
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Verificar se usuário tem permissão
  const hasPermission = (requiredRole) => {
    if (!state.user) return false;
    
    const roles = {
      ADMIN: 3,
      EMPRESA: 2,
      CLIENTE: 1
    };

    const userLevel = roles[state.user.tipoUsuario] || 0;
    const requiredLevel = roles[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  // Verificar tipo de usuário
  const isCliente = () => state.user?.tipoUsuario === 'CLIENTE';
  const isEmpresa = () => state.user?.tipoUsuario === 'EMPRESA';
  const isAdmin = () => state.user?.tipoUsuario === 'ADMIN';

  // Valor do contexto
  const value = {
    // Estado
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Ações
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    clearError,
    checkAuthStatus,

    // Helpers
    hasPermission,
    isCliente,
    isEmpresa,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

// HOC para proteger rotas
export const withAuth = (Component, requiredRole = null) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading, hasPermission } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner">Carregando...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirecionar para login
      window.location.href = '/login';
      return null;
    }

    if (requiredRole && !hasPermission(requiredRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="heading-2 text-error-color mb-2">Acesso Negado</h2>
            <p className="text-text-secondary">Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default AuthContext;