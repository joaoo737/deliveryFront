import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/variables.css';
import './styles/themes.css';

if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Delivery App iniciando em modo de desenvolvimento');

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registrado com sucesso: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW falhou no registro: ', registrationError);
        });
    });
  }
}

if (process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

window.addEventListener('error', (event) => {
  console.error('Erro global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason);
  event.preventDefault();
});

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
document.documentElement.setAttribute('data-theme', prefersDark.matches ? 'dark' : 'light');

prefersDark.addEventListener('change', (e) => {

  const savedTheme = localStorage.getItem('delivery_theme');
  if (!savedTheme) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

const savedTheme = localStorage.getItem('delivery_theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

const applyAccessibilitySettings = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0ms');
    document.documentElement.style.setProperty('--transition-duration', '0ms');
  }

  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
  if (prefersHighContrast.matches) {
    document.documentElement.setAttribute('data-high-contrast', 'true');
  }

  const forcedColors = window.matchMedia('(forced-colors: active)');
  if (forcedColors.matches) {
    document.documentElement.setAttribute('data-forced-colors', 'true');
  }
};

applyAccessibilitySettings();

const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setViewportHeight();

window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.documentElement.setAttribute('data-touch', 'true');
}

const detectCapabilities = () => {
  const capabilities = {
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    hover: window.matchMedia('(hover: hover)').matches,
    pointer: window.matchMedia('(pointer: fine)').matches ? 'fine' : 'coarse',
    connection: navigator.connection?.effectiveType || 'unknown',
    memory: navigator.deviceMemory || 'unknown',
    cores: navigator.hardwareConcurrency || 'unknown'
  };

  window.deviceCapabilities = capabilities;

  Object.entries(capabilities).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      document.documentElement.setAttribute(`data-${key}`, value);
    } else {
      document.documentElement.setAttribute(`data-${key}`, value);
    }
  });
};

detectCapabilities();

if ('navigator' in window && 'onLine' in navigator) {
  const updateOnlineStatus = () => {
    document.documentElement.setAttribute('data-online', navigator.onLine);
    
    if (!navigator.onLine) {
      console.warn('📱 Aplicação está offline');
    } else {
      console.log('📱 Aplicação está online');
    }
  };

  updateOnlineStatus();

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

const preventZoomOnInputs = () => {
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    );
  }
};

preventZoomOnInputs();

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado:', registration);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nova versão disponível!');
            }
          });
        });
      })
      .catch((error) => {
        console.error('Erro ao registrar Service Worker:', error);
      });
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  if (Notification.permission === 'default') {
    console.log('Permissão de notificação não solicitada ainda');
  }
}

if ('PerformanceObserver' in window) {
  try {

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('LCP:', entry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          console.log('CLS:', entry.value);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });

  } catch (error) {
    console.warn('Performance Observer não suportado:', error);
  }
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>
    );
  });
}