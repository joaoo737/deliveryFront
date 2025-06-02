import { useState, useEffect, useCallback } from 'react';
import storageService from '../services/storage';

export const useLocalStorage = (key, defaultValue = null, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    validator = null,
    syncAcrossTabs = true
  } = options;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storageService.getItem(key, defaultValue);

      if (validator && !validator(item)) {
        return defaultValue;
      }
      
      return item;
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      if (validator && !validator(valueToStore)) {
        throw new Error('Valor não passou na validação');
      }

      setStoredValue(valueToStore);

      storageService.setItem(key, valueToStore);

      if (syncAcrossTabs) {
        window.dispatchEvent(new CustomEvent('localStorage-change', {
          detail: { key, value: valueToStore }
        }));
      }
      
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  }, [key, storedValue, validator, syncAcrossTabs]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      storageService.removeItem(key);

      if (syncAcrossTabs) {
        window.dispatchEvent(new CustomEvent('localStorage-change', {
          detail: { key, value: null, removed: true }
        }));
      }
      
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage:`, error);
    }
  }, [key, defaultValue, syncAcrossTabs]);

  useEffect(() => {
    if (!syncAcrossTabs) return;

    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? deserialize(e.newValue) : defaultValue;

          if (validator && newValue !== defaultValue && !validator(newValue)) {
            return;
          }
          
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Erro ao sincronizar ${key}:`, error);
        }
      }
    };

    const handleCustomChange = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.removed ? defaultValue : e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    window.addEventListener('localStorage-change', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomChange);
    };
  }, [key, defaultValue, deserialize, validator, syncAcrossTabs]);

  return [storedValue, setValue, removeValue];
};

export const useLocalStorageArray = (key, defaultValue = []) => {
  const [array, setArray, removeArray] = useLocalStorage(key, defaultValue, {
    validator: (value) => Array.isArray(value)
  });

  const addItem = useCallback((item) => {
    setArray(prev => [...prev, item]);
  }, [setArray]);

  const removeItem = useCallback((index) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  }, [setArray]);

  const updateItem = useCallback((index, newItem) => {
    setArray(prev => prev.map((item, i) => i === index ? newItem : item));
  }, [setArray]);

  const findItem = useCallback((predicate) => {
    return array.find(predicate);
  }, [array]);

  const findIndex = useCallback((predicate) => {
    return array.findIndex(predicate);
  }, [array]);

  const clear = useCallback(() => {
    setArray([]);
  }, [setArray]);

  return {
    array,
    setArray,
    addItem,
    removeItem,
    updateItem,
    findItem,
    findIndex,
    clear,
    removeArray,
    length: array.length
  };
};

export const useLocalStorageObject = (key, defaultValue = {}) => {
  const [object, setObject, removeObject] = useLocalStorage(key, defaultValue, {
    validator: (value) => typeof value === 'object' && value !== null
  });

  const setProperty = useCallback((property, value) => {
    setObject(prev => ({ ...prev, [property]: value }));
  }, [setObject]);

  const removeProperty = useCallback((property) => {
    setObject(prev => {
      const newObj = { ...prev };
      delete newObj[property];
      return newObj;
    });
  }, [setObject]);

  const hasProperty = useCallback((property) => {
    return object.hasOwnProperty(property);
  }, [object]);

  const getProperty = useCallback((property, defaultVal = null) => {
    return object[property] || defaultVal;
  }, [object]);

  const clear = useCallback(() => {
    setObject({});
  }, [setObject]);

  return {
    object,
    setObject,
    setProperty,
    removeProperty,
    hasProperty,
    getProperty,
    clear,
    removeObject,
    keys: Object.keys(object),
    values: Object.values(object),
    entries: Object.entries(object)
  };
};

export const useUserSettings = (defaultSettings = {}) => {
  const settingsKey = 'user-settings';
  
  const {
    object: settings,
    setProperty: setSetting,
    removeProperty: removeSetting,
    getProperty: getSetting,
    clear: clearSettings
  } = useLocalStorageObject(settingsKey, defaultSettings);

  const resetToDefaults = useCallback(() => {
    clearSettings();
    setTimeout(() => {
      Object.entries(defaultSettings).forEach(([key, value]) => {
        setSetting(key, value);
      });
    }, 0);
  }, [clearSettings, setSetting, defaultSettings]);

  return {
    settings,
    setSetting,
    removeSetting,
    getSetting,
    clearSettings,
    resetToDefaults
  };
};

export const useTemporaryStorage = (key, ttl = 5 * 60 * 1000) => {
  const cacheKey = `temp_${key}`;
  
  const [cacheData, setCacheData] = useState(null);
  const [isExpired, setIsExpired] = useState(true);

  useEffect(() => {
    const cached = storageService.getItemWithExpiry(cacheKey);
    if (cached) {
      setCacheData(cached);
      setIsExpired(false);
    }
  }, [cacheKey]);

  const setCache = useCallback((data) => {
    storageService.setItemWithExpiry(cacheKey, data, ttl);
    setCacheData(data);
    setIsExpired(false);
  }, [cacheKey, ttl]);

  const clearCache = useCallback(() => {
    storageService.removeItem(cacheKey);
    setCacheData(null);
    setIsExpired(true);
  }, [cacheKey]);

  const refreshCache = useCallback(() => {
    const cached = storageService.getItemWithExpiry(cacheKey);
    if (cached) {
      setCacheData(cached);
      setIsExpired(false);
    } else {
      setCacheData(null);
      setIsExpired(true);
    }
  }, [cacheKey]);

  return {
    data: cacheData,
    isExpired,
    setCache,
    clearCache,
    refreshCache
  };
};

export const useLocalStorageCounter = (key, initialValue = 0) => {
  const [count, setCount] = useLocalStorage(key, initialValue, {
    validator: (value) => typeof value === 'number'
  });

  const increment = useCallback((step = 1) => {
    setCount(prev => prev + step);
  }, [setCount]);

  const decrement = useCallback((step = 1) => {
    setCount(prev => prev - step);
  }, [setCount]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [setCount, initialValue]);

  return {
    count,
    setCount,
    increment,
    decrement,
    reset
  };
};

export const useLocalStorageHistory = (key, maxHistory = 10) => {
  const historyKey = `${key}_history`;
  
  const { 
    array: history, 
    addItem: addToHistory, 
    clear: clearHistory 
  } = useLocalStorageArray(historyKey, []);

  const [currentValue, setCurrentValue] = useLocalStorage(key);

  const setValue = useCallback((newValue) => {
    if (currentValue !== null && currentValue !== newValue) {
      addToHistory({
        value: currentValue,
        timestamp: Date.now()
      });

      if (history.length >= maxHistory) {
        const newHistory = history.slice(-(maxHistory - 1));
        clearHistory();
        newHistory.forEach(item => addToHistory(item));
      }
    }
    
    setCurrentValue(newValue);
  }, [currentValue, setCurrentValue, addToHistory, history, maxHistory, clearHistory]);

  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastValue = history[history.length - 1];
      setCurrentValue(lastValue.value);
      const newHistory = history.slice(0, -1);
      clearHistory();
      newHistory.forEach(item => addToHistory(item));
    }
  }, [history, setCurrentValue, clearHistory, addToHistory]);

  const canUndo = history.length > 0;

  return {
    value: currentValue,
    setValue,
    undo,
    canUndo,
    history,
    clearHistory
  };
};

export default useLocalStorage;