import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi, AUTH_CONSTANTS } from '../services/api/authApi';
import { STORAGE_KEYS } from '../utils/constants';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../utils/helpers';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = loadFromStorage(STORAGE_KEYS.TOKEN);
        const storedUser = loadFromStorage(STORAGE_KEYS.USER);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          await validateToken();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const validateToken = async () => {
    try {
      await authApi.validateToken();
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
        } catch (refreshError) {
          handleLogout();
          throw refreshError;
        }
      } else {
        throw error;
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authApi.refreshToken();
      const newToken = response.token;
      
      setToken(newToken);
      saveToStorage(STORAGE_KEYS.TOKEN, newToken);
      
      return newToken;
    } catch (error) {
      handleLogout();
      throw error;
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authApi.login(credentials);
      const { token, user } = response;

      setToken(token);
      setUser(user);
      saveToStorage(STORAGE_KEYS.TOKEN, token);
      saveToStorage(STORAGE_KEYS.USER, user);

      return { token, user };
    } catch (error) {
      setError(error.message || AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authApi.register(userData);
      const { token, user } = response;

      setToken(token);
      setUser(user);

      saveToStorage(STORAGE_KEYS.TOKEN, token);
      saveToStorage(STORAGE_KEYS.USER, user);

      return response;
    } catch (error) {
      setError(error.message || AUTH_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    
    removeFromStorage(STORAGE_KEYS.TOKEN);
    removeFromStorage(STORAGE_KEYS.USER);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...userData };
      saveToStorage(STORAGE_KEYS.USER, updatedUser);
      return updatedUser;
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser,
    refreshToken,
    validateToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;