import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Loading from '../components/common/Loading/Loading';

// Importação lazy dos componentes para code splitting
const Home = React.lazy(() => import('../pages/Home/Home'));

// Auth pages
const Login = React.lazy(() => import('../pages/auth/Login/Login'));
const Register = React.lazy(() => import('../pages/auth/Register/Register'));

// Cliente pages
const CatalogPage = React.lazy(() => import('../pages/cliente/CatalogPage/CatalogPage'));
const CategoryPage = React.lazy(() => import('../pages/cliente/CategoryPage/CategoryPage'));
const EmpresaPage = React.lazy(() => import('../pages/cliente/EmpresaPage/EmpresaPage'));
const CheckoutPage = React.lazy(() => import('../pages/cliente/CheckoutPage/CheckoutPage'));
const OrderHistory = React.lazy(() => import('../pages/cliente/OrderHistory/OrderHistory'));

// Empresa pages
const DashboardPage = React.lazy(() => import('../pages/empresa/DashboardPage/DashboardPage'));
const ProductsPage = React.lazy(() => import('../pages/empresa/ProductsPage/ProductsPage'));
const OrdersPage = React.lazy(() => import('../pages/empresa/OrdersPage/OrdersPage'));
const ReportsPage = React.lazy(() => import('../pages/empresa/ReportsPage/ReportsPage'));
const FeedbackPage = React.lazy(() => import('../pages/empresa/FeedbackPage/FeedbackPage'));

// Layout wrapper component
const Layout = ({ children }) => (
  <div className="min-h-screen bg-bg-primary text-text-primary">
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  </div>
);

// Componente de rota não encontrada
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-primary">
    <div className="text-center">
      <h1 className="heading-1 text-primary-color mb-4">404</h1>
      <h2 className="heading-2 mb-4">Página não encontrada</h2>
      <p className="text-text-secondary mb-6">
        A página que você está procurando não existe.
      </p>
      <a 
        href="/" 
        className="btn btn-primary"
      >
        Voltar ao início
      </a>
    </div>
  </div>
);

// Componente de acesso negado
const AccessDenied = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-primary">
    <div className="text-center">
      <h1 className="heading-1 text-error-color mb-4">403</h1>
      <h2 className="heading-2 mb-4">Acesso Negado</h2>
      <p className="text-text-secondary mb-6">
        Você não tem permissão para acessar esta página.
      </p>
      <a 
        href="/" 
        className="btn btn-primary"
      >
        Voltar ao início
      </a>
    </div>
  </div>
);

// Componente principal de rotas
const AppRoutes = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <Loading />;
  }

  // Função para redirecionamento baseado no tipo de usuário
  const getDefaultRedirect = () => {
    if (!isAuthenticated || !user) return '/';
    
    switch (user.tipoUsuario) {
      case 'CLIENTE':
        return '/catalogo';
      case 'EMPRESA':
        return '/empresa/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Rota raiz - redireciona baseado na autenticação */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to={getDefaultRedirect()} replace /> : 
                <Home />
            } 
          />

          {/* Rotas públicas */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Rotas do catálogo público */}
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/categoria/:categoriaSlug" element={<CategoryPage />} />
          <Route path="/empresa/:empresaId" element={<EmpresaPage />} />

          {/* Rotas protegidas do cliente */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/meus-pedidos" 
            element={
              <ProtectedRoute requiredRole="CLIENTE">
                <OrderHistory />
              </ProtectedRoute>
            } 
          />

          {/* Rotas protegidas da empresa */}
          <Route 
            path="/empresa/dashboard" 
            element={
              <ProtectedRoute requiredRole="EMPRESA">
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/empresa/produtos" 
            element={
              <ProtectedRoute requiredRole="EMPRESA">
                <ProductsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/empresa/pedidos" 
            element={
              <ProtectedRoute requiredRole="EMPRESA">
                <OrdersPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/empresa/relatorios" 
            element={
              <ProtectedRoute requiredRole="EMPRESA">
                <ReportsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/empresa/feedbacks" 
            element={
              <ProtectedRoute requiredRole="EMPRESA">
                <FeedbackPage />
              </ProtectedRoute>
            } 
          />

          {/* Rotas de redirecionamento para tipos de usuário */}
          <Route 
            path="/cliente/*" 
            element={
              isAuthenticated && user?.tipoUsuario === 'CLIENTE' ? 
                <Navigate to="/catalogo" replace /> :
                <AccessDenied />
            } 
          />

          <Route 
            path="/empresa/*" 
            element={
              isAuthenticated && user?.tipoUsuario === 'EMPRESA' ? 
                <Navigate to="/empresa/dashboard" replace /> :
                <AccessDenied />
            } 
          />

          {/* Rota para páginas não encontradas */}
          <Route path="/404" element={<NotFound />} />
          <Route path="/acesso-negado" element={<AccessDenied />} />
          
          {/* Captura todas as rotas não definidas */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;