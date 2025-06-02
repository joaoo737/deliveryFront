import { useState, useCallback, useRef, useEffect } from 'react';
import { api, createCancelToken, isCancel } from '../services/httpClient';

export const useApi = (initialState = {}) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    ...initialState
  });

  const cancelTokenRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { 
      onSuccess,
      onError,
      showLoading = true,
      cancelPrevious = true 
    } = options;

    try {
      if (cancelPrevious && cancelTokenRef.current) {
        cancelTokenRef.current.cancel('New request initiated');
      }

      cancelTokenRef.current = createCancelToken();

      if (showLoading) {
        setState(prev => ({
          ...prev,
          loading: true,
          error: null
        }));
      }

      const response = await apiCall(cancelTokenRef.current.token);

      setState(prev => ({
        ...prev,
        data: response,
        loading: false,
        error: null
      }));

      if (onSuccess) {
        onSuccess(response);
      }

      return response;

    } catch (error) {
      if (isCancel(error)) {
        console.log('Request cancelled:', error.message);
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro desconhecido'
      }));

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  const cancel = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Request cancelled by user');
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
    cancel
  };
};

export const useGet = (url, options = {}) => {
  const { 
    immediate = false,
    params = {},
    dependencies = [],
    ...apiOptions 
  } = options;

  const apiState = useApi();

  const get = useCallback(async (customParams = {}) => {
    return apiState.execute(
      (cancelToken) => api.get(url, { ...params, ...customParams }, { cancelToken }),
      apiOptions
    );
  }, [url, params, apiOptions, apiState]);

  useEffect(() => {
    if (immediate) {
      get();
    }
  }, [immediate, ...dependencies]);

  return {
    ...apiState,
    get
  };
};

export const usePost = (url, options = {}) => {
  const apiState = useApi();

  const post = useCallback(async (data = {}, config = {}) => {
    return apiState.execute(
      (cancelToken) => api.post(url, data, { ...config, cancelToken }),
      options
    );
  }, [url, options, apiState]);

  return {
    ...apiState,
    post
  };
};

export const usePut = (url, options = {}) => {
  const apiState = useApi();

  const put = useCallback(async (data = {}, config = {}) => {
    return apiState.execute(
      (cancelToken) => api.put(url, data, { ...config, cancelToken }),
      options
    );
  }, [url, options, apiState]);

  return {
    ...apiState,
    put
  };
};

export const usePatch = (url, options = {}) => {
  const apiState = useApi();

  const patch = useCallback(async (data = {}, config = {}) => {
    return apiState.execute(
      (cancelToken) => api.patch(url, data, { ...config, cancelToken }),
      options
    );
  }, [url, options, apiState]);

  return {
    ...apiState,
    patch
  };
};

export const useDelete = (url, options = {}) => {
  const apiState = useApi();

  const deleteRequest = useCallback(async (config = {}) => {
    return apiState.execute(
      (cancelToken) => api.delete(url, { ...config, cancelToken }),
      options
    );
  }, [url, options, apiState]);

  return {
    ...apiState,
    delete: deleteRequest
  };
};

export const useUpload = (url, options = {}) => {
  const [progress, setProgress] = useState(0);
  const apiState = useApi();

  const upload = useCallback(async (file, config = {}) => {
    setProgress(0);
    
    return apiState.execute(
      (cancelToken) => api.upload(
        url, 
        file, 
        (progressPercent) => setProgress(progressPercent),
        { ...config, cancelToken }
      ),
      options
    );
  }, [url, options, apiState]);

  return {
    ...apiState,
    upload,
    progress
  };
};

export const useParallelRequests = () => {
  const [state, setState] = useState({
    data: [],
    loading: false,
    error: null,
    completed: 0,
    total: 0
  });

  const execute = useCallback(async (requests, options = {}) => {
    const { onProgress, onSuccess, onError } = options;

    try {
      setState({
        data: [],
        loading: true,
        error: null,
        completed: 0,
        total: requests.length
      });

      const promises = requests.map(async (request, index) => {
        try {
          const result = await request();
          
          setState(prev => {
            const newCompleted = prev.completed + 1;
            const newData = [...prev.data];
            newData[index] = result;
            
            if (onProgress) {
              onProgress(newCompleted, prev.total);
            }
            
            return {
              ...prev,
              data: newData,
              completed: newCompleted
            };
          });
          
          return result;
        } catch (error) {
          setState(prev => ({
            ...prev,
            completed: prev.completed + 1
          }));
          throw error;
        }
      });

      const results = await Promise.allSettled(promises);
      
      const successResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
        
      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

      setState(prev => ({
        ...prev,
        loading: false,
        error: errors.length > 0 ? errors : null
      }));

      if (onSuccess) {
        onSuccess(successResults);
      }

      return successResults;

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro desconhecido'
      }));

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, []);

  return {
    ...state,
    execute
  };
};


export const usePolling = (apiCall, interval = 5000, options = {}) => {
  const { 
    immediate = true,
    enabled = true,
    onSuccess,
    onError 
  } = options;

  const apiState = useApi();
  const intervalRef = useRef(null);

  const startPolling = useCallback(() => {
    if (!enabled) return;

    const poll = async () => {
      try {
        const result = await apiCall();
        apiState.execute(() => Promise.resolve(result), { onSuccess });
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    };

    if (immediate) {
      poll();
    }

    intervalRef.current = setInterval(poll, interval);
  }, [apiCall, interval, immediate, enabled, onSuccess, onError, apiState]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [enabled, startPolling, stopPolling]);

  return {
    ...apiState,
    startPolling,
    stopPolling,
    isPolling: !!intervalRef.current
  };
};

export default useApi;