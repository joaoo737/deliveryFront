import React from 'react';
import './Loading.css';

const Loading = ({ fullScreen, size = 'medium', text = 'Carregando...' }) => {
  const sizeClass = {
    small: 'loading-spinner-sm',
    medium: 'loading-spinner-md',
    large: 'loading-spinner-lg'
  }[size];

  const containerClass = `loading-container ${fullScreen ? 'fullscreen' : ''}`;

  return (
    <div className={containerClass}>
      <div className="loading-content">
        <div className={`loading-spinner ${sizeClass}`}>
          <svg viewBox="0 0 50 50" className="spinner">
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            />
          </svg>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

export const LoadingButton = ({ 
  loading, 
  children, 
  disabled, 
  className = '', 
  spinnerSize = 'small',
  ...props 
}) => {
  const spinnerClass = {
    small: 'loading-spinner-sm',
    medium: 'loading-spinner-md',
    large: 'loading-spinner-lg'
  }[spinnerSize];

  return (
    <button 
      className={`loading-button ${className} ${loading ? 'loading' : ''}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className={`loading-spinner ${spinnerClass}`}>
          <svg viewBox="0 0 50 50" className="spinner">
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            />
          </svg>
        </div>
      ) : children}
    </button>
  );
};

export const LoadingOverlay = ({ show, text }) => {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner loading-spinner-md">
          <svg viewBox="0 0 50 50" className="spinner">
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            />
          </svg>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
