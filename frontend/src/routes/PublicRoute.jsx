import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading/Loading';

/**
 * Componente para rotas públicas que redirecionam usuários autenticados
 */
const PublicRoute = ({ children, redirectPath = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <Loading />;
  }

  // Se usuário está autenticado, redirecionar
  if (isAuthenticated && user) {
    // Verificar se há redirecionamento salvo no estado
    const from = location.state?.from;
    
    // Determinar destino do redirecionamento
    let destination = redirectPath;
    
    if (!destination) {
      if (from && from !== '/login' && from !== '/register') {
        destination = from;
      } else {
        // Redirecionamento baseado no tipo de usuário
        switch (user.tipoUsuario) {
          case 'CLIENTE':
            destination = '/catalogo';
            break;
          case 'EMPRESA':
            destination = '/empresa/dashboard';
            break;
          case 'ADMIN':
            destination = '/admin/dashboard';
            break;
          default:
            destination = '/';
        }
      }
    }

    return <Navigate to={destination} replace />;
  }

  // Renderizar rota pública
  return children;
};

/**
 * HOC para rotas públicas
 */
export const withPublicRoute = (Component, options = {}) => {
  return function PublicComponent(props) {
    return (
      <PublicRoute {...options}>
        <Component {...props} />
      </PublicRoute>
    );
  };
};

/**
 * Componente para navegação condicional
 */
export const ConditionalNavigation = ({ 
  isAuthenticated: overrideAuth = null, 
  authenticatedPath = '/', 
  unauthenticatedPath = '/login',
  children 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Usar override se fornecido, senão usar estado de auth
  const authStatus = overrideAuth !== null ? overrideAuth : isAuthenticated;

  if (isLoading) {
    return <Loading />;
  }

  if (authStatus) {
    return <Navigate to={authenticatedPath} replace />;
  } else {
    return <Navigate to={unauthenticatedPath} replace />;
  }
};

export default PublicRoute;