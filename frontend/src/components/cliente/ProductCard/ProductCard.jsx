import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../hooks/useAuth';
import { formatCurrency } from '../../../utils/formatters';
import './ProductCard.css';

const ProductCard = ({ 
  produto,
  variant = 'default', // 'default', 'compact', 'wide'
  showCompany = true,
  showDescription = true,
  showFavorite = true,
  onFavoriteToggle,
  loading = false
}) => {
  const navigate = useNavigate();
  const { addItem, getItemQuantity, updateItem, isDifferentEmpresa } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!produto) return null;

  const quantity = getItemQuantity(produto.id);
  const isInCart = quantity > 0;
  const isAvailable = produto.ativo && produto.estoque > 0;
  const isLowStock = produto.estoque > 0 && produto.estoque <= 5;
  const hasPromotion = produto.precoPromocional && produto.precoPromocional < produto.preco;
  const finalPrice = hasPromotion ? produto.precoPromocional : produto.preco;
  const discountPercent = hasPromotion ? Math.round(((produto.preco - produto.precoPromocional) / produto.preco) * 100) : 0;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleProductClick = () => {
    if (loading) return;
    // Navegar para página do produto ou empresa
    navigate(`/produto/${produto.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.tipoUsuario !== 'CLIENTE') {
      return;
    }

    if (!isAvailable || isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      
      // Verificar se é de empresa diferente
      if (isDifferentEmpresa(produto.empresaId)) {
        const confirmChange = window.confirm(
          'Você já tem itens de outra empresa no carrinho. Deseja limpar o carrinho e adicionar este produto?'
        );
        
        if (!confirmChange) {
          return;
        }
      }

      await addItem({
        ...produto,
        empresaId: produto.empresaId,
        nomeEmpresa: produto.nomeEmpresa
      }, 1);

    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = async (e, change) => {
    e.stopPropagation();
    
    const newQuantity = quantity + change;
    
    if (newQuantity <= 0) {
      await updateItem(produto.id, 0);
    } else if (newQuantity <= produto.estoque) {
      await updateItem(produto.id, newQuantity);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (onFavoriteToggle) {
      onFavoriteToggle(produto.id);
    }
  };

  const getStatusBadge = () => {
    if (!produto.ativo) {
      return { text: 'Indisponível', className: 'product-card__status-badge--unavailable' };
    }
    
    if (produto.estoque === 0) {
      return { text: 'Esgotado', className: 'product-card__status-badge--unavailable' };
    }
    
    if (isLowStock) {
      return { text: 'Últimas unidades', className: 'product-card__status-badge--low-stock' };
    }
    
    if (hasPromotion) {
      return { text: `${discountPercent}% OFF`, className: 'product-card__status-badge--promotion' };
    }
    
    return null;
  };

  const getStockStatus = () => {
    if (!produto.ativo || produto.estoque === 0) {
      return { text: 'Indisponível', className: 'product-card__stock--unavailable' };
    }
    
    if (isLowStock) {
      return { text: `Apenas ${produto.estoque} restantes`, className: 'product-card__stock--low' };
    }
    
    return { text: 'Disponível', className: 'product-card__stock--available' };
  };

  const statusBadge = getStatusBadge();
  const stockStatus = getStockStatus();

  const cardClasses = [
    'product-card',
    variant !== 'default' && `product-card--${variant}`,
    loading && 'product-card--loading',
    !isAvailable && 'product-card--disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={handleProductClick}>
      {/* Container da Imagem */}
      <div className="product-card__image-container">
        {produto.imagemUrl && !imageError ? (
          <img
            src={produto.imagemUrl}
            alt={produto.nome}
            className="product-card__image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="product-card__image-placeholder">
            🍽️
          </div>
        )}

        {/* Badge de Status */}
        {statusBadge && (
          <div className={`product-card__status-badge ${statusBadge.className}`}>
            {statusBadge.text}
          </div>
        )}

        {/* Botão de Favorito */}
        {showFavorite && isAuthenticated && user?.tipoUsuario === 'CLIENTE' && (
          <button
            onClick={handleFavoriteClick}
            className={`product-card__favorite-btn ${produto.isFavorited ? 'favorited' : ''}`}
            aria-label={produto.isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {produto.isFavorited ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="product-card__content">
        {/* Header */}
        <div className="product-card__header">
          <h3 className="product-card__title">{produto.nome}</h3>
          {produto.categoria && (
            <div className="product-card__category">
              {produto.categoria.icone} {produto.categoria.nome}
            </div>
          )}
        </div>

        {/* Descrição */}
        {showDescription && produto.descricao && (
          <p className="product-card__description">
            {produto.descricao}
          </p>
        )}

        {/* Detalhes */}
        <div className="product-card__details">
          {/* Empresa */}
          {showCompany && produto.nomeEmpresa && (
            <div className="product-card__company">
              <span className="product-card__company-icon">🏢</span>
              <span>{produto.nomeEmpresa}</span>
            </div>
          )}

          {/* Avaliação */}
          {produto.avaliacao > 0 && (
            <div className="product-card__rating">
              <span className="product-card__rating-stars">
                {'★'.repeat(Math.floor(produto.avaliacao))}
                {'☆'.repeat(5 - Math.floor(produto.avaliacao))}
              </span>
              <span className="product-card__rating-value">
                {produto.avaliacao.toFixed(1)}
              </span>
              {produto.totalAvaliacoes > 0 && (
                <span className="product-card__rating-count">
                  ({produto.totalAvaliacoes})
                </span>
              )}
            </div>
          )}

          {/* Status do Estoque */}
          <div className={`product-card__stock ${stockStatus.className}`}>
            {stockStatus.text}
          </div>
        </div>

        {/* Footer */}
        <div className="product-card__footer">
          {/* Preços */}
          <div className="product-card__price-container">
            {hasPromotion ? (
              <div className="product-card__price--promotion">
                <span className="product-card__price">
                  {formatCurrency(produto.precoPromocional)}
                </span>
                <span className="product-card__price--original">
                  {formatCurrency(produto.preco)}
                </span>
                <span className="product-card__discount">
                  -{discountPercent}%
                </span>
              </div>
            ) : (
              <span className="product-card__price">
                {formatCurrency(produto.preco)}
              </span>
            )}
          </div>

          {/* Ações */}
          {isAuthenticated && user?.tipoUsuario === 'CLIENTE' && (
            <div className="product-card__actions">
              {isInCart ? (
                <div className="product-card__quantity-controls">
                  <button
                    onClick={(e) => handleQuantityChange(e, -1)}
                    className="product-card__quantity-btn"
                    disabled={quantity <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    −
                  </button>
                  <span className="product-card__quantity-value">{quantity}</span>
                  <button
                    onClick={(e) => handleQuantityChange(e, 1)}
                    className="product-card__quantity-btn"
                    disabled={quantity >= produto.estoque}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="product-card__add-btn"
                  disabled={!isAvailable || isAddingToCart}
                  aria-label={`Adicionar ${produto.nome} ao carrinho`}
                >
                  {isAddingToCart ? (
                    <>
                      <span>⏳</span>
                      Adicionando...
                    </>
                  ) : (
                    <>
                      <span>🛒</span>
                      Adicionar
                    </>
                  )}
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/produto/${produto.id}`);
                }}
                className="product-card__view-btn"
                aria-label={`Ver detalhes de ${produto.nome}`}
              >
                <span>👁️</span>
                Ver mais
              </button>
            </div>
          )}

          {/* Para usuários não logados ou empresas */}
          {(!isAuthenticated || user?.tipoUsuario !== 'CLIENTE') && (
            <div className="product-card__actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    navigate(`/produto/${produto.id}`);
                  }
                }}
                className="product-card__view-btn"
                style={{ flex: 1 }}
              >
                <span>👁️</span>
                {!isAuthenticated ? 'Fazer login' : 'Ver detalhes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;