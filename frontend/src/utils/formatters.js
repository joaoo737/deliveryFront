/**
 * Formata valor monetário para o formato brasileiro
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata número com separadores de milhares
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Formata data para o formato brasileiro
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formata data e hora para o formato brasileiro
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Formata apenas a hora
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Formata data de forma relativa (há 2 dias, há 1 hora, etc.)
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Agora mesmo';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `Há ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  }
  
  return formatDate(dateObj);
};

/**
 * Formata CPF
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length <= 11) {
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

/**
 * Formata CNPJ
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length <= 14) {
    return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return cnpj;
};

/**
 * Formata telefone
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Formata CEP
 */
export const formatCEP = (cep) => {
  if (!cep) return '';
  
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length <= 8) {
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return cep;
};

/**
 * Trunca texto com ellipsis
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitaliza todas as palavras
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Remove formatação de números
 */
export const unformatNumber = (formattedNumber) => {
  if (!formattedNumber) return 0;
  return parseFloat(formattedNumber.toString().replace(/[^\d,-]/g, '').replace(',', '.'));
};

/**
 * Remove formatação de telefone
 */
export const unformatPhone = (formattedPhone) => {
  if (!formattedPhone) return '';
  return formattedPhone.replace(/\D/g, '');
};

/**
 * Remove formatação de CPF
 */
export const unformatCPF = (formattedCPF) => {
  if (!formattedCPF) return '';
  return formattedCPF.replace(/\D/g, '');
};

/**
 * Remove formatação de CNPJ
 */
export const unformatCNPJ = (formattedCNPJ) => {
  if (!formattedCNPJ) return '';
  return formattedCNPJ.replace(/\D/g, '');
};

/**
 * Remove formatação de CEP
 */
export const unformatCEP = (formattedCEP) => {
  if (!formattedCEP) return '';
  return formattedCEP.replace(/\D/g, '');
};

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formata distância em metros/quilômetros
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
};

/**
 * Formata duração em minutos/horas
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}min`;
    }
  }
};

/**
 * Formata avaliação com estrelas
 */
export const formatRatingStars = (rating) => {
  if (!rating) return '☆☆☆☆☆';
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
};

/**
 * Formata número ordinal
 */
export const formatOrdinal = (number) => {
  const suffixes = ['º', 'ª'];
  return number + 'º';
};

/**
 * Formata texto para slug (URL amigável)
 */
export const formatSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9 -]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim('-'); // Remove hífens do início e fim
};

/**
 * Formata texto para busca (normaliza)
 */
export const formatSearchText = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Máscara para entrada de dados em tempo real
 */
export const applyMask = (value, mask) => {
  if (!value || !mask) return value;
  
  const cleanValue = value.replace(/\D/g, '');
  let maskedValue = '';
  let valueIndex = 0;
  
  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    if (mask[i] === '#') {
      maskedValue += cleanValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += mask[i];
    }
  }
  
  return maskedValue;
};

// Máscaras predefinidas
export const MASKS = {
  CPF: '###.###.###-##',
  CNPJ: '##.###.###/####-##',
  PHONE: '(##) #####-####',
  CEP: '#####-###',
  DATE: '##/##/####',
  TIME: '##:##'
};