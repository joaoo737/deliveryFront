import { VALIDATION } from './constants';

/**
 * Valida email
 */
export const validateEmail = (email) => {
  if (!email) return 'Email é obrigatório';
  if (!VALIDATION.EMAIL_REGEX.test(email)) return 'Email inválido';
  return null;
};

/**
 * Valida senha
 */
export const validatePassword = (password) => {
  if (!password) return 'Senha é obrigatória';
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return `Senha deve ter pelo menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`;
  }
  return null;
};

/**
 * Valida confirmação de senha
 */
export const validatePasswordConfirmation = (password, confirmation) => {
  if (!confirmation) return 'Confirmação de senha é obrigatória';
  if (password !== confirmation) return 'Senhas não coincidem';
  return null;
};

/**
 * Valida nome
 */
export const validateName = (name) => {
  if (!name || !name.trim()) return 'Nome é obrigatório';
  if (name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
    return `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`;
  }
  if (name.length > VALIDATION.MAX_NAME_LENGTH) {
    return `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`;
  }
  return null;
};

/**
 * Valida CPF
 */
export const validateCPF = (cpf) => {
  if (!cpf) return 'CPF é obrigatório';
  
  // Remove formatação
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (!VALIDATION.CPF_REGEX.test(cleanCPF)) return 'CPF deve ter 11 dígitos';
  
  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return 'CPF inválido';
  
  // Valida dígitos verificadores
  if (!isValidCPF(cleanCPF)) return 'CPF inválido';
  
  return null;
};

/**
 * Valida CNPJ
 */
export const validateCNPJ = (cnpj) => {
  if (!cnpj) return 'CNPJ é obrigatório';
  
  // Remove formatação
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (!VALIDATION.CNPJ_REGEX.test(cleanCNPJ)) return 'CNPJ deve ter 14 dígitos';
  
  // Verifica se não são todos os dígitos iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return 'CNPJ inválido';
  
  // Valida dígitos verificadores
  if (!isValidCNPJ(cleanCNPJ)) return 'CNPJ inválido';
  
  return null;
};

/**
 * Valida telefone
 */
export const validatePhone = (phone) => {
  if (!phone) return 'Telefone é obrigatório';
  
  // Remove formatação
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  if (!VALIDATION.TELEFONE_REGEX.test(cleanPhone)) {
    return 'Telefone deve ter 10 ou 11 dígitos';
  }
  
  return null;
};

/**
 * Valida endereço
 */
export const validateAddress = (address) => {
  if (!address || !address.trim()) return 'Endereço é obrigatório';
  if (address.trim().length < 10) return 'Endereço muito curto';
  return null;
};

/**
 * Valida preço
 */
export const validatePrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'Preço é obrigatório';
  }
  
  const numPrice = Number(price);
  
  if (isNaN(numPrice)) return 'Preço deve ser um número';
  if (numPrice < VALIDATION.MIN_PRICE) return `Preço mínimo é R$ ${VALIDATION.MIN_PRICE}`;
  if (numPrice > VALIDATION.MAX_PRICE) return `Preço máximo é R$ ${VALIDATION.MAX_PRICE}`;
  
  return null;
};

/**
 * Valida quantidade
 */
export const validateQuantity = (quantity) => {
  if (quantity === null || quantity === undefined || quantity === '') {
    return 'Quantidade é obrigatória';
  }
  
  const numQuantity = Number(quantity);
  
  if (isNaN(numQuantity)) return 'Quantidade deve ser um número';
  if (!Number.isInteger(numQuantity)) return 'Quantidade deve ser um número inteiro';
  if (numQuantity < VALIDATION.MIN_QUANTITY) return `Quantidade mínima é ${VALIDATION.MIN_QUANTITY}`;
  if (numQuantity > VALIDATION.MAX_QUANTITY) return `Quantidade máxima é ${VALIDATION.MAX_QUANTITY}`;
  
  return null;
};

/**
 * Valida estoque
 */
export const validateStock = (stock) => {
  if (stock === null || stock === undefined || stock === '') {
    return 'Estoque é obrigatório';
  }
  
  const numStock = Number(stock);
  
  if (isNaN(numStock)) return 'Estoque deve ser um número';
  if (!Number.isInteger(numStock)) return 'Estoque deve ser um número inteiro';
  if (numStock < VALIDATION.MIN_STOCK) return `Estoque mínimo é ${VALIDATION.MIN_STOCK}`;
  if (numStock > VALIDATION.MAX_STOCK) return `Estoque máximo é ${VALIDATION.MAX_STOCK}`;
  
  return null;
};

/**
 * Valida nota de avaliação
 */
export const validateRating = (rating) => {
  if (rating === null || rating === undefined || rating === '') {
    return 'Nota é obrigatória';
  }
  
  const numRating = Number(rating);
  
  if (isNaN(numRating)) return 'Nota deve ser um número';
  if (!Number.isInteger(numRating)) return 'Nota deve ser um número inteiro';
  if (numRating < VALIDATION.MIN_RATING) return `Nota mínima é ${VALIDATION.MIN_RATING}`;
  if (numRating > VALIDATION.MAX_RATING) return `Nota máxima é ${VALIDATION.MAX_RATING}`;
  
  return null;
};

/**
 * Valida coordenadas de latitude
 */
export const validateLatitude = (latitude) => {
  if (latitude === null || latitude === undefined || latitude === '') {
    return 'Latitude é obrigatória';
  }
  
  const numLatitude = Number(latitude);
  
  if (isNaN(numLatitude)) return 'Latitude deve ser um número';
  if (numLatitude < -90 || numLatitude > 90) return 'Latitude deve estar entre -90 e 90';
  
  return null;
};

/**
 * Valida coordenadas de longitude
 */
export const validateLongitude = (longitude) => {
  if (longitude === null || longitude === undefined || longitude === '') {
    return 'Longitude é obrigatória';
  }
  
  const numLongitude = Number(longitude);
  
  if (isNaN(numLongitude)) return 'Longitude deve ser um número';
  if (numLongitude < -180 || numLongitude > 180) return 'Longitude deve estar entre -180 e 180';
  
  return null;
};

/**
 * Valida descrição
 */
export const validateDescription = (description, required = false) => {
  if (required && (!description || !description.trim())) {
    return 'Descrição é obrigatória';
  }
  
  if (description && description.length > VALIDATION.MAX_DESCRIPTION_LENGTH) {
    return `Descrição deve ter no máximo ${VALIDATION.MAX_DESCRIPTION_LENGTH} caracteres`;
  }
  
  return null;
};

/**
 * Valida comentário
 */
export const validateComment = (comment, required = false) => {
  if (required && (!comment || !comment.trim())) {
    return 'Comentário é obrigatório';
  }
  
  if (comment && comment.length > VALIDATION.MAX_COMMENT_LENGTH) {
    return `Comentário deve ter no máximo ${VALIDATION.MAX_COMMENT_LENGTH} caracteres`;
  }
  
  return null;
};

/**
 * Valida arquivo de imagem
 */
export const validateImageFile = (file) => {
  if (!file) return 'Arquivo é obrigatório';
  
  if (file.size > VALIDATION.MAX_FILE_SIZE) {
    return `Arquivo deve ter no máximo ${VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB`;
  }
  
  if (!VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Formato de arquivo não suportado. Use JPG, PNG, GIF ou WEBP';
  }
  
  return null;
};

/**
 * Valida um formulário completo
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];
    
    if (typeof rule === 'function') {
      const error = rule(value);
      if (error) errors[field] = error;
    } else if (Array.isArray(rule)) {
      for (const validator of rule) {
        const error = validator(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Funções auxiliares para validação de CPF e CNPJ

function isValidCPF(cpf) {
  // Cálculo do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  
  // Cálculo do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  
  // Verificação dos dígitos
  return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
}

function isValidCNPJ(cnpj) {
  // Pesos para o primeiro dígito
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Cálculo do primeiro dígito verificador
  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += parseInt(cnpj.charAt(i)) * weights1[i];
  }
  let digit1 = 11 - (sum1 % 11);
  if (digit1 >= 10) digit1 = 0;
  
  // Pesos para o segundo dígito
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Cálculo do segundo dígito verificador
  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += parseInt(cnpj.charAt(i)) * weights2[i];
  }
  let digit2 = 11 - (sum2 % 11);
  if (digit2 >= 10) digit2 = 0;
  
  // Verificação dos dígitos
  return parseInt(cnpj.charAt(12)) === digit1 && parseInt(cnpj.charAt(13)) === digit2;
}