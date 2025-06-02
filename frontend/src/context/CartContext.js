import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartStorage } from '../services/storage';

// Ações do carrinho
const CART_ACTIONS = {
  LOAD_CART: 'LOAD_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_EMPRESA: 'SET_EMPRESA',
  SET_ENDERECO_ENTREGA: 'SET_ENDERECO_ENTREGA',
  SET_FORMA_PAGAMENTO: 'SET_FORMA_PAGAMENTO',
  SET_OBSERVACOES: 'SET_OBSERVACOES'
};

// Estado inicial do carrinho
const initialState = {
  itens: [],
  empresaId: null,
  nomeEmpresa: null,
  enderecoEntrega: '',
  formaPagamento: null,
  observacoes: '',
  subtotal: 0,
  total: 0,
  itemCount: 0
};

// Calcular totais
const calculateTotals = (itens) => {
  const subtotal = itens.reduce((total, item) => {
    return total + (item.precoUnitario * item.quantidade);
  }, 0);

  const itemCount = itens.reduce((total, item) => {
    return total + item.quantidade;
  }, 0);

  // Por enquanto, total = subtotal (sem taxas de entrega)
  const total = subtotal;

  return { subtotal, total, itemCount };
};

// Reducer do carrinho
const cartReducer = (state, action) => {
  let newItens;
  let totals;

  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      totals = calculateTotals(action.payload.itens || []);
      return {
        ...state,
        ...action.payload,
        ...totals
      };

    case CART_ACTIONS.ADD_ITEM:
      const { produto, quantidade } = action.payload;
      
      // Verificar se é da mesma empresa
      if (state.empresaId && state.empresaId !== produto.empresaId) {
        // Limpar carrinho se for de empresa diferente
        newItens = [{
          produtoId: produto.id,
          nomeProduto: produto.nome,
          precoUnitario: produto.preco,
          quantidade: quantidade,
          imagemUrl: produto.imagemUrl
        }];
      } else {
        // Verificar se produto já existe no carrinho
        const existingItemIndex = state.itens.findIndex(
          item => item.produtoId === produto.id
        );

        if (existingItemIndex >= 0) {
          // Atualizar quantidade do item existente
          newItens = [...state.itens];
          newItens[existingItemIndex].quantidade += quantidade;
        } else {
          // Adicionar novo item
          newItens = [...state.itens, {
            produtoId: produto.id,
            nomeProduto: produto.nome,
            precoUnitario: produto.preco,
            quantidade: quantidade,
            imagemUrl: produto.imagemUrl
          }];
        }
      }

      totals = calculateTotals(newItens);
      
      return {
        ...state,
        itens: newItens,
        empresaId: produto.empresaId,
        nomeEmpresa: produto.nomeEmpresa,
        ...totals
      };

    case CART_ACTIONS.UPDATE_ITEM:
      newItens = state.itens.map(item => 
        item.produtoId === action.payload.produtoId
          ? { ...item, quantidade: action.payload.quantidade }
          : item
      ).filter(item => item.quantidade > 0);

      totals = calculateTotals(newItens);

      return {
        ...state,
        itens: newItens,
        ...totals
      };

    case CART_ACTIONS.REMOVE_ITEM:
      newItens = state.itens.filter(
        item => item.produtoId !== action.payload.produtoId
      );

      totals = calculateTotals(newItens);

      // Se não há mais itens, limpar empresa
      const newState = {
        ...state,
        itens: newItens,
        ...totals
      };

      if (newItens.length === 0) {
        newState.empresaId = null;
        newState.nomeEmpresa = null;
      }

      return newState;

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...initialState
      };

    case CART_ACTIONS.SET_EMPRESA:
      return {
        ...state,
        empresaId: action.payload.id,
        nomeEmpresa: action.payload.nome
      };

    case CART_ACTIONS.SET_ENDERECO_ENTREGA:
      return {
        ...state,
        enderecoEntrega: action.payload
      };

    case CART_ACTIONS.SET_FORMA_PAGAMENTO:
      return {
        ...state,
        formaPagamento: action.payload
      };

    case CART_ACTIONS.SET_OBSERVACOES:
      return {
        ...state,
        observacoes: action.payload
      };

    default:
      return state;
  }
};

// Criar contexto
const CartContext = createContext();

// Provider do contexto do carrinho
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Carregar carrinho do storage ao inicializar
  useEffect(() => {
    loadCart();
  }, []);

  // Salvar carrinho no storage sempre que houver mudanças
  useEffect(() => {
    saveCart();
  }, [state]);

  // Carregar carrinho do storage
  const loadCart = () => {
    try {
      const savedCart = cartStorage.getCart();
      const savedData = {
        itens: savedCart.itens || [],
        empresaId: savedCart.empresaId || null,
        nomeEmpresa: savedCart.nomeEmpresa || null,
        enderecoEntrega: savedCart.enderecoEntrega || '',
        formaPagamento: savedCart.formaPagamento || null,
        observacoes: savedCart.observacoes || ''
      };

      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: savedData
      });
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  };

  // Salvar carrinho no storage
  const saveCart = () => {
    try {
      cartStorage.setCart(state);
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  };

  // Adicionar item ao carrinho
  const addItem = (produto, quantidade = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { produto, quantidade }
    });
  };

  // Atualizar quantidade de um item
  const updateItem = (produtoId, quantidade) => {
    if (quantidade <= 0) {
      removeItem(produtoId);
      return;
    }

    dispatch({
      type: CART_ACTIONS.UPDATE_ITEM,
      payload: { produtoId, quantidade }
    });
  };

  // Remover item do carrinho
  const removeItem = (produtoId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { produtoId }
    });
  };

  // Limpar carrinho
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Definir empresa
  const setEmpresa = (empresa) => {
    dispatch({
      type: CART_ACTIONS.SET_EMPRESA,
      payload: empresa
    });
  };

  // Definir endereço de entrega
  const setEnderecoEntrega = (endereco) => {
    dispatch({
      type: CART_ACTIONS.SET_ENDERECO_ENTREGA,
      payload: endereco
    });
  };

  // Definir forma de pagamento
  const setFormaPagamento = (forma) => {
    dispatch({
      type: CART_ACTIONS.SET_FORMA_PAGAMENTO,
      payload: forma
    });
  };

  // Definir observações
  const setObservacoes = (observacoes) => {
    dispatch({
      type: CART_ACTIONS.SET_OBSERVACOES,
      payload: observacoes
    });
  };

  // Verificar se produto está no carrinho
  const isInCart = (produtoId) => {
    return state.itens.some(item => item.produtoId === produtoId);
  };

  // Obter quantidade de um produto no carrinho
  const getItemQuantity = (produtoId) => {
    const item = state.itens.find(item => item.produtoId === produtoId);
    return item ? item.quantidade : 0;
  };

  // Verificar se carrinho está vazio
  const isEmpty = () => {
    return state.itens.length === 0;
  };

  // Verificar se pode finalizar pedido
  const canCheckout = () => {
    return (
      !isEmpty() &&
      state.empresaId &&
      state.enderecoEntrega.trim() !== '' &&
      state.formaPagamento
    );
  };

  // Obter dados para checkout
  const getCheckoutData = () => {
    return {
      empresaId: state.empresaId,
      total: state.total,
      formaPagamento: state.formaPagamento,
      observacoes: state.observacoes,
      enderecoEntrega: state.enderecoEntrega,
      itens: state.itens.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.precoUnitario * item.quantidade
      }))
    };
  };

  // Verificar se é de empresa diferente
  const isDifferentEmpresa = (empresaId) => {
    return state.empresaId && state.empresaId !== empresaId;
  };

  // Valor do contexto
  const value = {
    // Estado
    itens: state.itens,
    empresaId: state.empresaId,
    nomeEmpresa: state.nomeEmpresa,
    enderecoEntrega: state.enderecoEntrega,
    formaPagamento: state.formaPagamento,
    observacoes: state.observacoes,
    subtotal: state.subtotal,
    total: state.total,
    itemCount: state.itemCount,

    // Ações
    addItem,
    updateItem,
    removeItem,
    clearCart,
    setEmpresa,
    setEnderecoEntrega,
    setFormaPagamento,
    setObservacoes,

    // Helpers
    isInCart,
    getItemQuantity,
    isEmpty,
    canCheckout,
    getCheckoutData,
    isDifferentEmpresa,
    loadCart,
    saveCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar o contexto do carrinho
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  
  return context;
};

export default CartContext;