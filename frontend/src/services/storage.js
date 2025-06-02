import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage não está disponível:', e);
      return false;
    }
  }

  setItem(key, value) {
    if (!this.isAvailable) {
      console.warn('localStorage não disponível');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  }

  clear() {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }

  hasItem(key) {
    if (!this.isAvailable) {
      return false;
    }

    return localStorage.getItem(key) !== null;
  }

  getAllKeys() {
    if (!this.isAvailable) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Erro ao obter chaves do localStorage:', error);
      return [];
    }
  }

  getSize() {
    if (!this.isAvailable) {
      return 0;
    }

    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Erro ao calcular tamanho do localStorage:', error);
      return 0;
    }
  }

  setItemWithExpiry(key, value, ttl) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Erro ao salvar com expiração:', error);
      return false;
    }
  }

  getItemWithExpiry(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return defaultValue;
      }

      const item = JSON.parse(itemStr);
      const now = new Date();

      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return defaultValue;
      }

      return item.value;
    } catch (error) {
      console.error('Erro ao recuperar item com expiração:', error);
      return defaultValue;
    }
  }
}

const storageService = new StorageService();

export const authStorage = {
  setToken: (token) => {
    return storageService.setItem(STORAGE_KEYS.TOKEN, token);
  },

  getToken: () => {
    return storageService.getItem(STORAGE_KEYS.TOKEN);
  },

  removeToken: () => {
    return storageService.removeItem(STORAGE_KEYS.TOKEN);
  },

  hasToken: () => {
    return storageService.hasItem(STORAGE_KEYS.TOKEN);
  }
};

export const userStorage = {
  setUser: (user) => {
    return storageService.setItem(STORAGE_KEYS.USER, user);
  },

  getUser: () => {
    return storageService.getItem(STORAGE_KEYS.USER);
  },

  removeUser: () => {
    return storageService.removeItem(STORAGE_KEYS.USER);
  },

  hasUser: () => {
    return storageService.hasItem(STORAGE_KEYS.USER);
  },

  updateUser: (updates) => {
    const currentUser = userStorage.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      return userStorage.setUser(updatedUser);
    }
    return false;
  }
};

export const cartStorage = {
  setCart: (cart) => {
    return storageService.setItem(STORAGE_KEYS.CART, cart);
  },

  getCart: () => {
    return storageService.getItem(STORAGE_KEYS.CART, []);
  },

  addItem: (item) => {
    const cart = cartStorage.getCart();
    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.produtoId === item.produtoId
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantidade += item.quantidade;
    } else {
      cart.push(item);
    }

    return cartStorage.setCart(cart);
  },

  updateItem: (produtoId, updates) => {
    const cart = cartStorage.getCart();
    const itemIndex = cart.findIndex(item => item.produtoId === produtoId);

    if (itemIndex >= 0) {
      cart[itemIndex] = { ...cart[itemIndex], ...updates };
      return cartStorage.setCart(cart);
    }

    return false;
  },

  removeItem: (produtoId) => {
    const cart = cartStorage.getCart();
    const filteredCart = cart.filter(item => item.produtoId !== produtoId);
    return cartStorage.setCart(filteredCart);
  },

  clearCart: () => {
    return storageService.removeItem(STORAGE_KEYS.CART);
  },

  getItemCount: () => {
    const cart = cartStorage.getCart();
    return cart.reduce((total, item) => total + item.quantidade, 0);
  },

  getTotal: () => {
    const cart = cartStorage.getCart();
    return cart.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
  }
};

export const themeStorage = {
  setTheme: (theme) => {
    return storageService.setItem(STORAGE_KEYS.THEME, theme);
  },

  getTheme: () => {
    return storageService.getItem(STORAGE_KEYS.THEME, 'dark');
  },

  toggleTheme: () => {
    const currentTheme = themeStorage.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    themeStorage.setTheme(newTheme);
    return newTheme;
  }
};

export const locationStorage = {
  setLocation: (location) => {
    return storageService.setItemWithExpiry(STORAGE_KEYS.LOCATION, location, 5 * 60 * 1000); // 5 minutos
  },

  getLocation: () => {
    return storageService.getItemWithExpiry(STORAGE_KEYS.LOCATION);
  },

  removeLocation: () => {
    return storageService.removeItem(STORAGE_KEYS.LOCATION);
  },

  hasLocation: () => {
    return storageService.getItemWithExpiry(STORAGE_KEYS.LOCATION) !== null;
  }
};

export const settingsStorage = {
  setSetting: (key, value) => {
    const settings = settingsStorage.getAllSettings();
    settings[key] = value;
    return storageService.setItem('app_settings', settings);
  },

  getSetting: (key, defaultValue = null) => {
    const settings = settingsStorage.getAllSettings();
    return settings[key] || defaultValue;
  },

  getAllSettings: () => {
    return storageService.getItem('app_settings', {});
  },

  removeSetting: (key) => {
    const settings = settingsStorage.getAllSettings();
    delete settings[key];
    return storageService.setItem('app_settings', settings);
  },

  clearSettings: () => {
    return storageService.removeItem('app_settings');
  }
};

export const cacheStorage = {
  setCache: (key, data, ttl = 10 * 60 * 1000) => { // 10 minutos por padrão
    return storageService.setItemWithExpiry(`cache_${key}`, data, ttl);
  },

  getCache: (key) => {
    return storageService.getItemWithExpiry(`cache_${key}`);
  },

  removeCache: (key) => {
    return storageService.removeItem(`cache_${key}`);
  },

  clearAllCache: () => {
    const keys = storageService.getAllKeys();
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        storageService.removeItem(key);
      }
    });
  }
};

export const clearAllAppData = () => {
  authStorage.removeToken();
  userStorage.removeUser();
  cartStorage.clearCart();
  locationStorage.removeLocation();
  cacheStorage.clearAllCache();
  settingsStorage.clearSettings();
};

export default storageService;