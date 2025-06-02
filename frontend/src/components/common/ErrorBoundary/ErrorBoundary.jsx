import React from 'react';
import './ErrorBoundary.css';

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
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    console.error('ErrorBoundary capturou um erro:', error, errorInfo);

    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
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

    if (process.env.NODE_ENV === 'development') {
      console.log('Dados do erro para monitoramento:', errorData);
    }

  };

  getUserId = () => {
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

    const reportData = {
      errorId,
      message: error?.message || 'Erro desconhecido',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const reportText = `
Relatório de Erro - ID: ${errorId}

Mensagem: ${reportData.message}
Data/Hora: ${reportData.timestamp}
URL: ${reportData.url}
Navegador: ${reportData.userAgent}

Por favor, envie este relatório para suporte@deliveryapp.com
    `.trim();

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

export const useErrorHandler = () => {
  return React.useCallback((error, errorInfo = {}) => {
    console.error('Erro capturado pelo hook:', error);

    if (process.env.NODE_ENV === 'production') {
    }

  }, []);
};

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