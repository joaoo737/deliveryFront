import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/variables.css';
import './styles/themes.css';

// Configurações de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  // Log de inicialização
  console.log('🚀 Delivery App iniciando em modo de desenvolvimento');
  
  // Service Worker para desenvolvimento
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

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}

// Error reporting global
window.addEventListener('error', (event) => {
  console.error('Erro global capturado:', event.error);
  // Aqui você pode integrar com serviços de monitoring como Sentry
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason);
  // Prevenir que o erro apareça no console
  event.preventDefault();
});

// Detectar modo escuro do sistema
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
document.documentElement.setAttribute('data-theme', prefersDark.matches ? 'dark' : 'light');

// Escutar mudanças no tema do sistema
prefersDark.addEventListener('change', (e) => {
  // Só aplicar se o usuário não tiver definido uma preferência manual
  const savedTheme = localStorage.getItem('delivery_theme');
  if (!savedTheme) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});

// Aplicar tema salvo
const savedTheme = localStorage.getItem('delivery_theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// Configurações de acessibilidade
const applyAccessibilitySettings = () => {
  // Detectar preferência por movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0ms');
    document.documentElement.style.setProperty('--transition-duration', '0ms');
  }

  // Detectar preferência por alto contraste
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
  if (prefersHighContrast.matches) {
    document.documentElement.setAttribute('data-high-contrast', 'true');
  }

  // Detectar cores forçadas (Windows High Contrast)
  const forcedColors = window.matchMedia('(forced-colors: active)');
  if (forcedColors.matches) {
    document.documentElement.setAttribute('data-forced-colors', 'true');
  }
};

// Aplicar configurações ao carregar
applyAccessibilitySettings();

// Configurações de viewport para dispositivos móveis
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Definir altura inicial
setViewportHeight();

// Atualizar altura quando a orientação mudar
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Detectar dispositivo touch
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.documentElement.setAttribute('data-touch', 'true');
}

// Detectar capacidades do dispositivo
const detectCapabilities = () => {
  const capabilities = {
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    hover: window.matchMedia('(hover: hover)').matches,
    pointer: window.matchMedia('(pointer: fine)').matches ? 'fine' : 'coarse',
    connection: navigator.connection?.effectiveType || 'unknown',
    memory: navigator.deviceMemory || 'unknown',
    cores: navigator.hardwareConcurrency || 'unknown'
  };

  // Armazenar informações do dispositivo
  window.deviceCapabilities = capabilities;
  
  // Aplicar classes CSS baseadas nas capacidades
  Object.entries(capabilities).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      document.documentElement.setAttribute(`data-${key}`, value);
    } else {
      document.documentElement.setAttribute(`data-${key}`, value);
    }
  });
};

detectCapabilities();

// Configurar interceptador de rede para modo offline
if ('navigator' in window && 'onLine' in navigator) {
  const updateOnlineStatus = () => {
    document.documentElement.setAttribute('data-online', navigator.onLine);
    
    if (!navigator.onLine) {
      console.warn('📱 Aplicação está offline');
      // Aqui você pode mostrar uma notificação ou banner de offline
    } else {
      console.log('📱 Aplicação está online');
    }
  };

  // Status inicial
  updateOnlineStatus();

  // Escutar mudanças no status de conexão
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

// Prevenir zoom em inputs no iOS
const preventZoomOnInputs = () => {
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    );
  }
};

preventZoomOnInputs();

// Configurações de PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado:', registration);
        
        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nova versão disponível
              console.log('Nova versão disponível!');
              // Aqui você pode mostrar uma notificação de atualização
            }
          });
        });
      })
      .catch((error) => {
        console.error('Erro ao registrar Service Worker:', error);
      });
  });
}

// Configurar notificações push (se suportado)
if ('Notification' in window && 'serviceWorker' in navigator) {
  // Verificar permissão de notificação
  if (Notification.permission === 'default') {
    // Pode solicitar permissão mais tarde, quando necessário
    console.log('Permissão de notificação não solicitada ainda');
  }
}

// Performance observer para Core Web Vitals
if ('PerformanceObserver' in window) {
  try {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('LCP:', entry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
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

// Renderizar aplicação
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot Module Replacement para desenvolvimento
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