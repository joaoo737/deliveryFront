import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartStorage } from '../services/storage';

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

const calculateTotals = (itens) => {
  const subtotal = itens.reduce((total, item) => {
    return total + (item.precoUnitario * item.quantidade);
  }, 0);

  const itemCount = itens.reduce((total, item) => {
    return total + item.quantidade;
  }, 0);

  const total = subtotal;

  return { subtotal, total, itemCount };
};

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
      
      if (state.empresaId && state.empresaId !== produto.empresaId) {
        newItens = [{
          produtoId: produto.id,
          nomeProduto: produto.nome,
          precoUnitario: produto.preco,
          quantidade: quantidade,
          imagemUrl: produto.imagemUrl
        }];
      } else {
        const existingItemIndex = state.itens.findIndex(
          item => item.produtoId === produto.id
        );

        if (existingItemIndex >= 0) {
          newItens = [...state.itens];
          newItens[existingItemIndex].quantidade += quantidade;
        } else {
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

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [state]);

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

  const saveCart = () => {
    try {
      cartStorage.setCart(state);
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  };

  const addItem = (produto, quantidade = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { produto, quantidade }
    });
  };

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

  const removeItem = (produtoId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { produtoId }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const setEmpresa = (empresa) => {
    dispatch({
      type: CART_ACTIONS.SET_EMPRESA,
      payload: empresa
    });
  };

  const setEnderecoEntrega = (endereco) => {
    dispatch({
      type: CART_ACTIONS.SET_ENDERECO_ENTREGA,
      payload: endereco
    });
  };

  const setFormaPagamento = (forma) => {
    dispatch({
      type: CART_ACTIONS.SET_FORMA_PAGAMENTO,
      payload: forma
    });
  };

  const setObservacoes = (observacoes) => {
    dispatch({
      type: CART_ACTIONS.SET_OBSERVACOES,
      payload: observacoes
    });
  };

  const isInCart = (produtoId) => {
    return state.itens.some(item => item.produtoId === produtoId);
  };

  const getItemQuantity = (produtoId) => {
    const item = state.itens.find(item => item.produtoId === produtoId);
    return item ? item.quantidade : 0;
  };

  const isEmpty = () => {
    return state.itens.length === 0;
  };

  const canCheckout = () => {
    return (
      !isEmpty() &&
      state.empresaId &&
      state.enderecoEntrega.trim() !== '' &&
      state.formaPagamento
    );
  };

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

  const isDifferentEmpresa = (empresaId) => {
    return state.empresaId && state.empresaId !== empresaId;
  };

  const value = {
    itens: state.itens,
    empresaId: state.empresaId,
    nomeEmpresa: state.nomeEmpresa,
    enderecoEntrega: state.enderecoEntrega,
    formaPagamento: state.formaPagamento,
    observacoes: state.observacoes,
    subtotal: state.subtotal,
    total: state.total,
    itemCount: state.itemCount,

    addItem,
    updateItem,
    removeItem,
    clearCart,
    setEmpresa,
    setEnderecoEntrega,
    setFormaPagamento,
    setObservacoes,

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

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  
  return context;
};

export default CartContext;