import React, { useState } from 'react';
import { useCart } from '../../../hooks/useCart';
import { formatCurrency } from '../../../utils/formatters';
import { LoadingButton } from '../../common/Loading/Loading';
import './ProductCard.css';

const ProductCard = ({ produto }) => {
  const { 
    addItem, 
    updateItem, 
    getItemQuantity, 
    isDifferentEmpresa 
  } = useCart();
  
  const [quantity, setQuantity] = useState(getItemQuantity(produto.id));
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAddToCart = async () => {
    if (isDifferentEmpresa(produto.empresaId)) {
      setShowConfirm(true);
      return;
    }
    
    try {
      setLoading(true);
      await addItem(produto, 1);
      setQuantity(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 0) return;
    
    try {
      setLoading(true);
      await updateItem(produto.id, newQuantity);
      setQuantity(newQuantity);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmNewCart = async () => {
    try {
      setLoading(true);
      await addItem(produto, 1);
      setQuantity(1);
      setShowConfirm(false);
    } catch (error) {
      console.error('Erro ao criar novo carrinho:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      {produto.imagemUrl && (
        <div className="product-image">
          <img src={produto.imagemUrl} alt={produto.nome} />
        </div>
      )}

      <div className="product-info">
        <h3 className="product-name">{produto.nome}</h3>
        <p className="product-description">{produto.descricao}</p>
        <div className="product-price">
          {formatCurrency(produto.preco)}
        </div>
      </div>

      <div className="product-actions">
        {quantity > 0 ? (
          <div className="quantity-controls">
            <button 
              className="quantity-button"
              onClick={() => handleUpdateQuantity(quantity - 1)}
              disabled={loading}
            >
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button 
              className="quantity-button"
              onClick={() => handleUpdateQuantity(quantity + 1)}
              disabled={loading}
            >
              +
            </button>
          </div>
        ) : (
          <LoadingButton
            onClick={handleAddToCart}
            loading={loading}
            className="add-to-cart-button"
          >
            Adicionar
          </LoadingButton>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h4>Iniciar Novo Pedido?</h4>
            <p>
              Você já tem itens de outro restaurante no carrinho. 
              Deseja criar um novo pedido?
            </p>
            <div className="confirm-actions">
              <button 
                className="confirm-button"
                onClick={handleConfirmNewCart}
                disabled={loading}
              >
                Sim, Novo Pedido
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
