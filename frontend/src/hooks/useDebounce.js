import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook para debounce de valores
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para debounce de funções
 */
export const useDebouncedCallback = (callback, delay = 300, deps = []) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Atualizar callback ref sempre que deps mudarem
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Função para cancelar o debounce
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Função para executar imediatamente
  const flush = useCallback((...args) => {
    cancel();
    callbackRef.current(...args);
  }, [cancel]);

  return {
    callback: debouncedCallback,
    cancel,
    flush
  };
};

/**
 * Hook para debounce de busca
 */
export const useSearchDebounce = (searchTerm, delay = 500, options = {}) => {
  const {
    minLength = 2,
    trimWhitespace = true,
    caseSensitive = false
  } = options;

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);

    const handler = setTimeout(() => {
      let processedTerm = searchTerm;

      // Processar termo de busca
      if (trimWhitespace) {
        processedTerm = processedTerm.trim();
      }

      if (!caseSensitive) {
        processedTerm = processedTerm.toLowerCase();
      }

      // Verificar comprimento mínimo
      if (processedTerm.length >= minLength) {
        setDebouncedSearchTerm(processedTerm);
      } else {
        setDebouncedSearchTerm('');
      }

      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay, minLength, trimWhitespace, caseSensitive]);

  return {
    searchTerm: debouncedSearchTerm,
    isSearching,
    hasMinLength: searchTerm.length >= minLength
  };
};

/**
 * Hook para debounce com estado de loading
 */
export const useLoadingDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsLoading(false);
    }, delay);

    return () => {
      clearTimeout(handler);
      setIsLoading(false);
    };
  }, [value, delay]);

  return {
    value: debouncedValue,
    isLoading
  };
};

/**
 * Hook para debounce de múltiplos valores
 */
export const useMultipleDebounce = (values, delay = 300) => {
  const [debouncedValues, setDebouncedValues] = useState(values);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValues(values);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [JSON.stringify(values), delay]);

  return debouncedValues;
};

/**
 * Hook para debounce com cache
 */
export const useDebounceWithCache = (value, delay = 300, cacheTime = 5000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const cacheRef = useRef(new Map());
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Verificar se valor está no cache
    if (cacheRef.current.has(value)) {
      const cachedData = cacheRef.current.get(value);
      if (Date.now() - cachedData.timestamp < cacheTime) {
        setDebouncedValue(value);
        return;
      }
    }

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configurar novo timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      
      // Adicionar ao cache
      cacheRef.current.set(value, {
        timestamp: Date.now()
      });

      // Limpar cache antigo
      const now = Date.now();
      for (const [key, data] of cacheRef.current.entries()) {
        if (now - data.timestamp > cacheTime) {
          cacheRef.current.delete(key);
        }
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, cacheTime]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    value: debouncedValue,
    clearCache,
    cacheSize: cacheRef.current.size
  };
};

/**
 * Hook para throttle (limitar frequência de execução)
 */
export const useThrottle = (value, limit = 300) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= limit) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, limit - timeSinceLastExecution);

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
};

/**
 * Hook para throttle de funções
 */
export const useThrottledCallback = (callback, limit = 300, deps = []) => {
  const lastExecuted = useRef(Date.now());
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  const throttledCallback = useCallback((...args) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= limit) {
      callbackRef.current(...args);
      lastExecuted.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        lastExecuted.current = Date.now();
      }, limit - timeSinceLastExecution);
    }
  }, [limit]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

/**
 * Hook para debounce condicional
 */
export const useConditionalDebounce = (value, delay = 300, condition = true) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (!condition) {
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, condition]);

  return debouncedValue;
};

export default useDebounce;