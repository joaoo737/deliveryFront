import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../utils/formatters';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    itens, 
    itemCount, 
    total, 
    nomeEmpresa, 
    updateItem, 
    removeItem, 
    clearCart,
    isEmpty 
  } = useCart();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleQuantityChange = async (produtoId, novaQuantidade) => {
    if (updatingItems.has(produtoId)) return;

    try {
      setUpdatingItems(prev => new Set([...prev, produtoId]));
      setIsUpdating(true);

      if (novaQuantidade <= 0) {
        await removeItem(produtoId);
      } else {
        await updateItem(produtoId, novaQuantidade);
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(produtoId);
        return newSet;
      });
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (produtoId) => {
    if (updatingItems.has(produtoId)) return;

    const confirmRemove = window.confirm('Deseja remover este item do carrinho?');
    if (!confirmRemove) return;

    try {
      setUpdatingItems(prev => new Set([...prev, produtoId]));
      setIsUpdating(true);
      await removeItem(produtoId);
    } catch (error) {
      console.error('Erro ao remover item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(produtoId);
        return newSet;
      });
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    const confirmClear = window.confirm('Deseja limpar todo o carrinho?');
    if (!confirmClear) return;

    try {
      setIsUpdating(true);
      await clearCart();
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/catalogo');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const formatItemSubtotal = (item) => {
    return formatCurrency(item.precoUnitario * item.quantidade);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={handleOverlayClick}>
      <div className={`cart-modal ${isUpdating ? 'cart-modal--loading' : ''}`}>
        {/* Header */}
        <div className="cart-modal__header">
          <h2 className="cart-modal__title">
            <span className="cart-modal__title-icon">🛒</span>
            Meu Carrinho ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="cart-modal__close"
            aria-label="Fechar carrinho"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="cart-modal__content">
          {isEmpty() ? (
            /* Carrinho Vazio */
            <div className="cart-modal__empty">
              <div className="cart-modal__empty-icon">🛒</div>
              <h3 className="cart-modal__empty-title">
                Seu carrinho está vazio
              </h3>
              <p className="cart-modal__empty-description">
                Adicione produtos ao carrinho para continuar com a compra
              </p>
              <button
                onClick={handleContinueShopping}
                className="cart-modal__empty-action"
              >
                <span>🍽️</span>
                Explorar Produtos
              </button>
            </div>
          ) : (
            <>
              {/* Informações da Empresa */}
              {nomeEmpresa && (
                <div className="cart-modal__company">
                  <div className="cart-modal__company-icon">🏢</div>
                  <div className="cart-modal__company-info">
                    <div className="cart-modal__company-name">{nomeEmpresa}</div>
                    <div className="cart-modal__company-items">
                      {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de Itens */}
              <div className="cart-modal__items">
                {itens.map((item) => (
                  <div key={item.produtoId} className="cart-item">
                    {/* Imagem do Produto */}
                    {item.imagemUrl ? (
                      <img
                        src={item.imagemUrl}
                        alt={item.nomeProduto}
                        className="cart-item__image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="cart-item__image-placeholder">
                        🍽️
                      </div>
                    )}
                    <div 
                      className="cart-item__image-placeholder" 
                      style={{ display: 'none' }}
                    >
                      🍽️
                    </div>

                    {/* Conteúdo do Item */}
                    <div className="cart-item__content">
                      <div className="cart-item__header">
                        <h4 className="cart-item__name">
                          {item.nomeProduto}
                        </h4>
                        <button
                          onClick={() => handleRemoveItem(item.produtoId)}
                          className="cart-item__remove"
                          disabled={updatingItems.has(item.produtoId)}
                          aria-label={`Remover ${item.nomeProduto} do carrinho`}
                        >
                          {updatingItems.has(item.produtoId) ? '⏳' : '🗑️'}
                        </button>
                      </div>

                      <div className="cart-item__details">
                        <div className="cart-item__price-info">
                          <div className="cart-item__unit-price">
                            {formatCurrency(item.precoUnitario)} cada
                          </div>
                          <div className="cart-item__total-price">
                            {formatItemSubtotal(item)}
                          </div>
                        </div>

                        <div className="cart-item__quantity-controls">
                          <button
                            onClick={() => handleQuantityChange(item.produtoId, item.quantidade - 1)}
                            className="cart-item__quantity-btn"
                            disabled={item.quantidade <= 1 || updatingItems.has(item.produtoId)}
                            aria-label="Diminuir quantidade"
                          >
                            −
                          </button>
                          
                          <span className="cart-item__quantity-value">
                            {updatingItems.has(item.produtoId) ? '⏳' : item.quantidade}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.produtoId, item.quantidade + 1)}
                            className="cart-item__quantity-btn"
                            disabled={updatingItems.has(item.produtoId)}
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Summary e Actions - apenas se não estiver vazio */}
        {!isEmpty() && (
          <div className="cart-modal__summary">
            {/* Resumo dos Valores */}
            <div className="cart-modal__summary-row">
              <span className="cart-modal__summary-label">
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
              </span>
              <span className="cart-modal__summary-value">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Taxa de entrega seria calculada no checkout */}
            <div className="cart-modal__summary-row">
              <span className="cart-modal__summary-label">Taxa de entrega</span>
              <span className="cart-modal__summary-value">
                Calcular no checkout
              </span>
            </div>

            {/* Total */}
            <div className="cart-modal__summary-row">
              <span className="cart-modal__summary-label">
                <strong>Total</strong>
              </span>
              <span className="cart-modal__summary-total">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Ações */}
            <div className="cart-modal__actions">
              <button
                onClick={handleContinueShopping}
                className="cart-modal__continue"
              >
                <span>🛍️</span>
                Continuar Comprando
              </button>
              
              <button
                onClick={handleCheckout}
                className="cart-modal__checkout"
                disabled={isUpdating}
              >
                <span>💳</span>
                {isUpdating ? 'Atualizando...' : 'Finalizar Pedido'}
              </button>
            </div>

            {/* Limpar Carrinho */}
            <button
              onClick={handleClearCart}
              className="cart-modal__clear"
              disabled={isUpdating}
            >
              🗑️ Limpar Carrinho
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;