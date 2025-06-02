import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading/Loading';

const ProtectedRoute = ({ children, requiredRole = null, fallbackPath = '/login' }) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  if (user && user.ativo === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center p-8">
          <h2 className="heading-2 text-warning-color mb-4">
            Conta Inativa
          </h2>
          <p className="text-text-secondary mb-6">
            Sua conta foi desativada. Entre em contato com o suporte para mais informações.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn btn-primary"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export const withProtectedRoute = (Component, options = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

export const useRouteAccess = (requiredRole = null) => {
  const { isAuthenticated, user, hasPermission } = useAuth();

  const canAccess = React.useMemo(() => {
    if (!isAuthenticated) return false;
    if (!user || user.ativo === false) return false;
    if (requiredRole && !hasPermission(requiredRole)) return false;
    return true;
  }, [isAuthenticated, user, requiredRole, hasPermission]);

  const accessLevel = React.useMemo(() => {
    if (!isAuthenticated) return 'guest';
    if (!user || user.ativo === false) return 'inactive';
    return user.tipoUsuario?.toLowerCase() || 'unknown';
  }, [isAuthenticated, user]);

  return {
    canAccess,
    accessLevel,
    isAuthenticated,
    user
  };
};

export const ConditionalRender = ({ 
  requiredRole = null, 
  fallback = null, 
  children 
}) => {
  const { canAccess } = useRouteAccess(requiredRole);

  if (!canAccess) {
    return fallback;
  }

  return children;
};

export default ProtectedRoute;