import React from 'react';
import './Loading.css';

const Loading = ({ 
  size = 'medium', 
  variant = 'spinner',
  text = 'Carregando...',
  showText = true,
  color = 'primary',
  overlay = false,
  fullScreen = false,
  className = ''
}) => {

  const sizeClasses = {
    small: 'loading-small',
    medium: 'loading-medium',
    large: 'loading-large'
  };

  const colorClasses = {
    primary: 'loading-primary',
    secondary: 'loading-secondary',
    white: 'loading-white'
  };

  const baseClasses = `loading-container ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  const renderSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );

  const renderDots = () => (
    <div className="loading-dots">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );

  const renderPulse = () => (
    <div className="loading-pulse">
      <div className="pulse-circle"></div>
    </div>
  );

  const renderBars = () => (
    <div className="loading-bars">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );

  const renderLoading = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  const loadingContent = (
    <div className={baseClasses}>
      {renderLoading()}
      {showText && (
        <div className="loading-text">{text}</div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {loadingContent}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading-overlay">
        {loadingContent}
      </div>
    );
  }

  return loadingContent;
};

export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton-card ${className}`}>
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  </div>
);

export const SkeletonList = ({ items = 3, className = '' }) => (
  <div className={`skeleton-list ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="skeleton-list-item">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`skeleton-text-container ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index} 
        className={`skeleton-text-line ${index === lines - 1 ? 'short' : ''}`}
      ></div>
    ))}
  </div>
);

export const ButtonLoading = ({ 
  size = 'medium',
  variant = 'spinner',
  className = ''
}) => {
  const sizeClasses = {
    small: 'btn-loading-small',
    medium: 'btn-loading-medium',
    large: 'btn-loading-large'
  };

  return (
    <div className={`btn-loading ${sizeClasses[size]} ${className}`}>
      {variant === 'spinner' ? (
        <div className="btn-spinner">
          <div className="spinner-small">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div className="btn-dots">
          <div className="dot-small"></div>
          <div className="dot-small"></div>
          <div className="dot-small"></div>
        </div>
      )}
    </div>
  );
};

export const withLoading = (Component, LoadingComponent = Loading) => {
  return function LoadingWrapper({ isLoading, loadingProps, ...props }) {
    if (isLoading) {
      return <LoadingComponent {...loadingProps} />;
    }
    return <Component {...props} />;
  };
};

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const toggleLoading = React.useCallback(() => {
    setIsLoading(prev => !prev);
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading
  };
};

export default Loading;