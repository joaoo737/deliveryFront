import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { formatCurrency } from '../../../utils/formatters';
import { LoadingButton } from '../../common/Loading/Loading';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { 
    itens, 
    nomeEmpresa, 
    subtotal, 
    total, 
    updateItem, 
    removeItem, 
    clearCart 
  } = useCart();

  if (!isOpen) return null;

  const handleUpdateQuantity = (produtoId, quantidade) => {
    if (quantidade <= 0) {
      removeItem(produtoId);
    } else {
      updateItem(produtoId, quantidade);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    onClose();
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Carrinho</h2>
          <button className="close-button" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {itens.length > 0 ? (
          <>
            <div className="cart-empresa">
              <span className="material-icons">store</span>
              {nomeEmpresa}
            </div>

            <div className="cart-items">
              {itens.map(item => (
                <div key={item.produtoId} className="cart-item">
                  {item.imagemUrl && (
                    <img 
                      src={item.imagemUrl} 
                      alt={item.nomeProduto} 
                      className="item-image"
                    />
                  )}
                  
                  <div className="item-info">
                    <h3>{item.nomeProduto}</h3>
                    <p className="item-price">
                      {formatCurrency(item.precoUnitario)}
                    </p>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleUpdateQuantity(
                          item.produtoId, 
                          item.quantidade - 1
                        )}
                      >
                        -
                      </button>
                      <span>{item.quantidade}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(
                          item.produtoId, 
                          item.quantidade + 1
                        )}
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="item-subtotal">
                      {formatCurrency(item.precoUnitario * item.quantidade)}
                    </p>

                    <button 
                      className="remove-button"
                      onClick={() => removeItem(item.produtoId)}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="cart-actions">
              <LoadingButton
                onClick={handleCheckout}
                className="checkout-button"
              >
                Finalizar Pedido
              </LoadingButton>
              
              <button 
                className="clear-button"
                onClick={handleClearCart}
              >
                Limpar Carrinho
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <span className="material-icons">shopping_cart</span>
            <p>Seu carrinho está vazio</p>
            <button 
              className="continue-shopping"
              onClick={onClose}
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
