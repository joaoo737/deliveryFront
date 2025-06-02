import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">
              <span className="material-icons">error_outline</span>
            </div>
            
            <h1 className="error-title">Ops! Algo deu errado</h1>
            
            <p className="error-message">
              Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando na solução.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="error-details">
                <h3>Detalhes do Erro:</h3>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </div>
            )}

            <div className="error-actions">
              <button 
                className="retry-button"
                onClick={this.handleRetry}
              >
                Tentar Novamente
              </button>
              
              <button 
                className="home-button"
                onClick={this.handleGoHome}
              >
                Voltar para o Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
