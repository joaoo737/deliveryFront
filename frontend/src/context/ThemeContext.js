import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { themeStorage } from '../services/storage';
import { THEMES } from '../utils/constants';

// Ações do tema
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_REDUCED_MOTION: 'SET_REDUCED_MOTION',
  RESET_PREFERENCES: 'RESET_PREFERENCES'
};

// Estado inicial
const initialState = {
  theme: THEMES.DARK,
  fontSize: 'medium',
  reducedMotion: false,
  systemPreference: 'dark'
};

// Reducer do tema
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
      };

    case THEME_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload
      };

    case THEME_ACTIONS.SET_REDUCED_MOTION:
      return {
        ...state,
        reducedMotion: action.payload
      };

    case THEME_ACTIONS.RESET_PREFERENCES:
      return {
        ...initialState,
        systemPreference: state.systemPreference
      };

    default:
      return state;
  }
};

// Criar contexto
const ThemeContext = createContext();

// Provider do contexto de tema
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Detectar preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemPreference = mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
    
    dispatch({
      type: THEME_ACTIONS.SET_THEME,
      payload: themeStorage.getTheme() || systemPreference
    });

    // Escutar mudanças na preferência do sistema
    const handleChange = (e) => {
      const newSystemPreference = e.matches ? THEMES.DARK : THEMES.LIGHT;
      // Se o usuário não definiu uma preferência manual, usar a do sistema
      if (!themeStorage.getTheme()) {
        setTheme(newSystemPreference);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Aplicar tema no DOM
  useEffect(() => {
    applyTheme(state.theme);
  }, [state.theme]);

  // Aplicar configurações de acessibilidade
  useEffect(() => {
    applyAccessibilitySettings();
  }, [state.fontSize, state.reducedMotion]);

  // Aplicar tema no documento
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = `theme-${theme}`;
    
    // Salvar no storage
    themeStorage.setTheme(theme);
  };

  // Aplicar configurações de acessibilidade
  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // Font size
    root.setAttribute('data-font-size', state.fontSize);
    
    // Reduced motion
    if (state.reducedMotion) {
      root.style.setProperty('--animation-duration', '0ms');
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
  };

  // Definir tema
  const setTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      dispatch({
        type: THEME_ACTIONS.SET_THEME,
        payload: theme
      });
    }
  };

  // Alternar tema
  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
  };

  // Definir tamanho da fonte
  const setFontSize = (size) => {
    const validSizes = ['small', 'medium', 'large', 'extra-large'];
    if (validSizes.includes(size)) {
      dispatch({
        type: THEME_ACTIONS.SET_FONT_SIZE,
        payload: size
      });
    }
  };

  // Definir movimento reduzido
  const setReducedMotion = (enabled) => {
    dispatch({
      type: THEME_ACTIONS.SET_REDUCED_MOTION,
      payload: enabled
    });
  };

  // Resetar preferências
  const resetPreferences = () => {
    dispatch({ type: THEME_ACTIONS.RESET_PREFERENCES });
  };

  // Verificar se é tema escuro
  const isDark = () => state.theme === THEMES.DARK;

  // Verificar se é tema claro
  const isLight = () => state.theme === THEMES.LIGHT;

  // Obter variáveis CSS do tema atual
  const getThemeVariables = () => {
    const computedStyle = getComputedStyle(document.documentElement);
    
    return {
      primaryColor: computedStyle.getPropertyValue('--primary-color').trim(),
      backgroundColor: computedStyle.getPropertyValue('--bg-primary').trim(),
      textColor: computedStyle.getPropertyValue('--text-primary').trim(),
      borderColor: computedStyle.getPropertyValue('--border-primary').trim()
    };
  };

  // Aplicar tema personalizado
  const applyCustomTheme = (customVariables) => {
    const root = document.documentElement;
    
    Object.entries(customVariables).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });
  };

  // Obter contraste apropriado
  const getContrastColor = (backgroundColor) => {
    // Converter hex para RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcular luminância
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Retornar cor com bom contraste
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  // Verificar suporte a recursos
  const getCapabilities = () => {
    return {
      colorSchemeSupport: window.matchMedia('(prefers-color-scheme)').matches,
      reducedMotionSupport: window.matchMedia('(prefers-reduced-motion)').matches,
      highContrastSupport: window.matchMedia('(prefers-contrast: high)').matches,
      forcedColorsSupport: window.matchMedia('(forced-colors: active)').matches
    };
  };

  // Aplicar tema baseado na hora
  const applyTimeBasedTheme = () => {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 18;
    
    setTheme(isDayTime ? THEMES.LIGHT : THEMES.DARK);
  };

  // Valor do contexto
  const value = {
    // Estado
    theme: state.theme,
    fontSize: state.fontSize,
    reducedMotion: state.reducedMotion,
    systemPreference: state.systemPreference,

    // Ações
    setTheme,
    toggleTheme,
    setFontSize,
    setReducedMotion,
    resetPreferences,

    // Helpers
    isDark,
    isLight,
    getThemeVariables,
    applyCustomTheme,
    getContrastColor,
    getCapabilities,
    applyTimeBasedTheme,

    // Constantes
    THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar o contexto de tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  
  return context;
};

// HOC para componentes que dependem do tema
export const withTheme = (Component) => {
  return function ThemedComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default ThemeContext;