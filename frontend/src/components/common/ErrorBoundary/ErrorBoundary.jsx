import React from 'react';
import './ErrorBoundary.css';

/**
 * Error Boundary para capturar e tratar erros da aplicação
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para mostrar a UI de erro
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Captura detalhes do erro
    this.setState({
      error,
      errorInfo
    });

    // Log do erro
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);

    // Aqui você pode integrar com serviços de monitoramento
    // como Sentry, LogRocket, etc.
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Simular envio para serviço de monitoramento
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      errorId: this.state.errorId
    };

    // Em produção, você enviaria para um serviço real
    if (process.env.NODE_ENV === 'development') {
      console.log('Dados do erro para monitoramento:', errorData);
    }

    // Exemplo de integração com serviço de monitoramento:
    // Sentry.captureException(error, { extra: errorData });
  };

  getUserId = () => {
    // Tentar obter ID do usuário do localStorage
    try {
      const user = JSON.parse(localStorage.getItem('delivery_user') || '{}');
      return user.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    // Preparar dados para relatório
    const reportData = {
      errorId,
      message: error?.message || 'Erro desconhecido',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Copiar para clipboard ou abrir email
    const reportText = `
Relatório de Erro - ID: ${errorId}

Mensagem: ${reportData.message}
Data/Hora: ${reportData.timestamp}
URL: ${reportData.url}
Navegador: ${reportData.userAgent}

Por favor, envie este relatório para suporte@deliveryapp.com
    `.trim();

    // Tentar copiar para clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText).then(() => {
        alert('Relatório de erro copiado para a área de transferência!');
      }).catch(() => {
        this.openEmailReport(reportText);
      });
    } else {
      this.openEmailReport(reportText);
    }
  };

  openEmailReport = (reportText) => {
    const subject = encodeURIComponent(`Relatório de Erro - ID: ${this.state.errorId}`);
    const body = encodeURIComponent(reportText);
    const mailtoUrl = `mailto:suporte@deliveryapp.com?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">
              ⚠️
            </div>
            
            <div className="error-boundary__content">
              <h1 className="error-boundary__title">
                Oops! Algo deu errado
              </h1>
              
              <p className="error-boundary__message">
                Ocorreu um erro inesperado. Nossa equipe foi notificada automaticamente.
              </p>

              {errorId && (
                <p className="error-boundary__error-id">
                  ID do erro: <code>{errorId}</code>
                </p>
              )}

              <div className="error-boundary__actions">
                <button 
                  className="btn btn-primary"
                  onClick={this.handleReload}
                >
                  Recarregar Página
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={this.handleReset}
                >
                  Tentar Novamente
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={this.handleReportError}
                >
                  Reportar Erro
                </button>
              </div>

              {isDevelopment && error && (
                <details className="error-boundary__details">
                  <summary>Detalhes do Erro (Desenvolvimento)</summary>
                  <div className="error-boundary__error-details">
                    <h3>Mensagem:</h3>
                    <pre>{error.message}</pre>
                    
                    <h3>Stack Trace:</h3>
                    <pre>{error.stack}</pre>
                    
                    {this.state.errorInfo && (
                      <>
                        <h3>Component Stack:</h3>
                        <pre>{this.state.errorInfo.componentStack}</pre>
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para capturar erros em componentes funcionais
 */
export const useErrorHandler = () => {
  return React.useCallback((error, errorInfo = {}) => {
    // Log do erro
    console.error('Erro capturado pelo hook:', error);

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: errorInfo });
    }

    // Você pode implementar lógica adicional aqui
    // como mostrar notificações, redirecionar, etc.
  }, []);
};

/**
 * Componente de erro personalizado para casos específicos
 */
export const ErrorDisplay = ({ 
  error, 
  onRetry, 
  onReport,
  showDetails = false 
}) => {
  return (
    <div className="error-display">
      <div className="error-display__icon">⚠️</div>
      <h3 className="error-display__title">Erro</h3>
      <p className="error-display__message">
        {error?.message || 'Ocorreu um erro inesperado'}
      </p>
      
      <div className="error-display__actions">
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            Tentar Novamente
          </button>
        )}
        
        {onReport && (
          <button className="btn btn-secondary" onClick={onReport}>
            Reportar
          </button>
        )}
      </div>

      {showDetails && error?.stack && (
        <details className="error-display__details">
          <summary>Detalhes Técnicos</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  );
};

/**
 * HOC para adicionar error boundary a componentes
 */
export const withErrorBoundary = (Component, errorComponent = null) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={errorComponent}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

export default ErrorBoundary;