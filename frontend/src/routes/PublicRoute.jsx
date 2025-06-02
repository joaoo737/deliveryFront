import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading/Loading';

const PublicRoute = ({ children, redirectPath = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated && user) {
    const from = location.state?.from;

    let destination = redirectPath;
    
    if (!destination) {
      if (from && from !== '/login' && from !== '/register') {
        destination = from;
      } else {
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

  return children;
};

export const withPublicRoute = (Component, options = {}) => {
  return function PublicComponent(props) {
    return (
      <PublicRoute {...options}>
        <Component {...props} />
      </PublicRoute>
    );
  };
};

export const ConditionalNavigation = ({ 
  isAuthenticated: overrideAuth = null, 
  authenticatedPath = '/', 
  unauthenticatedPath = '/login',
  children 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

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