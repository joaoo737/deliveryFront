import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Hook customizado para autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export default useAuth;