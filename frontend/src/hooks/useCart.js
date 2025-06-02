import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useCart = () => {
  const [cart, setCart] = useLocalStorage('cart', {
    empresa: null,
    items: [],
    subtotal: 0,
    total: 0
  });

  const calculateTotals = useCallback((items, empresa) => {
    const subtotal = items.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const taxaEntrega = empresa?.taxaEntrega || 0;
    return {
      subtotal,
      total: subtotal + taxaEntrega
    };
  }, []);

  const addToCart = useCallback((produto) => {
    setCart(currentCart => {
      // If adding from a different restaurant, clear the cart first
      if (currentCart.empresa && produto.empresaId !== currentCart.empresa.id) {
        if (!window.confirm('Adicionar itens de outro restaurante irá limpar seu carrinho atual. Deseja continuar?')) {
          return currentCart;
        }
        return {
          empresa: produto.empresa,
          items: [produto],
          ...calculateTotals([produto], produto.empresa)
        };
      }

      // Check if item already exists
      const existingItemIndex = currentCart.items.findIndex(item => item.id === produto.id);
      let newItems;

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = currentCart.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantidade: item.quantidade + produto.quantidade }
            : item
        );
      } else {
        // Add new item
        newItems = [...currentCart.items, produto];
      }

      return {
        empresa: currentCart.empresa || produto.empresa,
        items: newItems,
        ...calculateTotals(newItems, currentCart.empresa || produto.empresa)
      };
    });
  }, [calculateTotals, setCart]);

  const removeFromCart = useCallback((produtoId) => {
    setCart(currentCart => {
      const newItems = currentCart.items.filter(item => item.id !== produtoId);
      
      if (newItems.length === 0) {
        return {
          empresa: null,
          items: [],
          subtotal: 0,
          total: 0
        };
      }

      return {
        ...currentCart,
        items: newItems,
        ...calculateTotals(newItems, currentCart.empresa)
      };
    });
  }, [calculateTotals, setCart]);

  const updateQuantity = useCallback((produtoId, quantidade) => {
    if (quantidade < 1) return;

    setCart(currentCart => {
      const newItems = currentCart.items.map(item =>
        item.id === produtoId ? { ...item, quantidade } : item
      );

      return {
        ...currentCart,
        items: newItems,
        ...calculateTotals(newItems, currentCart.empresa)
      };
    });
  }, [calculateTotals, setCart]);

  const clearCart = useCallback(() => {
    setCart({
      empresa: null,
      items: [],
      subtotal: 0,
      total: 0
    });
  }, [setCart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};

export default useCart;
