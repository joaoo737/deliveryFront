import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';
import './RestaurantCard.css';

const RestaurantCard = ({ empresa }) => {
  const renderRating = () => {
    const fullStars = Math.floor(empresa.avaliacao);
    const hasHalfStar = empresa.avaliacao % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="rating">
        {[...Array(fullStars)].map((_, index) => (
          <span key={`full-${index}`} className="material-icons star">
            star
          </span>
        ))}
        {hasHalfStar && (
          <span className="material-icons star">
            star_half
          </span>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="material-icons star">
            star_outline
          </span>
        ))}
        <span className="rating-value">
          {empresa.avaliacao.toFixed(1)}
        </span>
        {empresa.totalAvaliacoes > 0 && (
          <span className="rating-count">
            ({empresa.totalAvaliacoes})
          </span>
        )}
      </div>
    );
  };

  const renderTags = () => {
    const tags = [];

    if (empresa.tempoEntregaMinimo && empresa.tempoEntregaMaximo) {
      tags.push(
        <span key="delivery-time" className="tag delivery-time">
          <span className="material-icons">schedule</span>
          {empresa.tempoEntregaMinimo}-{empresa.tempoEntregaMaximo} min
        </span>
      );
    }

    if (empresa.taxaEntrega !== undefined) {
      tags.push(
        <span key="delivery-fee" className="tag delivery-fee">
          <span className="material-icons">local_shipping</span>
          {empresa.taxaEntrega === 0 
            ? 'Entrega Grátis' 
            : formatCurrency(empresa.taxaEntrega)
          }
        </span>
      );
    }

    if (empresa.pedidoMinimo) {
      tags.push(
        <span key="min-order" className="tag min-order">
          <span className="material-icons">shopping_bag</span>
          Mín. {formatCurrency(empresa.pedidoMinimo)}
        </span>
      );
    }

    return (
      <div className="tags">
        {tags}
      </div>
    );
  };

  return (
    <Link to={`/empresa/${empresa.id}`} className="restaurant-card">
      <div className="restaurant-image">
        {empresa.imagemUrl ? (
          <img src={empresa.imagemUrl} alt={empresa.nomeFantasia} />
        ) : (
          <div className="image-placeholder">
            <span className="material-icons">store</span>
          </div>
        )}
        {empresa.online && (
          <span className="status-badge online">Aberto</span>
        )}
      </div>

      <div className="restaurant-info">
        <h3 className="restaurant-name">{empresa.nomeFantasia}</h3>
        
        {empresa.categoria && (
          <span className="restaurant-category">
            {empresa.categoria}
          </span>
        )}

        {empresa.avaliacao > 0 && renderRating()}

        {renderTags()}

        {empresa.promocao && (
          <div className="promotion">
            <span className="material-icons">local_offer</span>
            {empresa.promocao}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;
