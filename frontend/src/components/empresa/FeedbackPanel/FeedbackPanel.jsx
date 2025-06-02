import React, { useState, useEffect } from 'react';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { formatDate } from '../../../utils/formatters';
import { Loading } from '../../common/Loading/Loading';
import './FeedbackPanel.css';

const FeedbackPanel = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    mediaGeral: 0,
    totalAvaliacoes: 0,
    distribuicaoNotas: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  });

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const [feedbacksResponse, statsResponse] = await Promise.all([
        api.get(API_ENDPOINTS.EMPRESA.FEEDBACKS),
        api.get(API_ENDPOINTS.EMPRESA.FEEDBACKS + '/stats')
      ]);

      setFeedbacks(feedbacksResponse);
      setStats(statsResponse);
    } catch (error) {
      console.error('Erro ao carregar feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingDistribution = () => {
    const maxCount = Math.max(...Object.values(stats.distribuicaoNotas));
    
    return (
      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = stats.distribuicaoNotas[rating];
          const percentage = (count / stats.totalAvaliacoes) * 100;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={rating} className="rating-bar">
              <div className="rating-label">{rating} estrelas</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="rating-count">
                {count} ({percentage.toFixed(1)}%)
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="material-icons"
            style={{
              color: star <= rating ? 'var(--primary-color)' : 'var(--text-tertiary)'
            }}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="feedback-panel">
      <div className="feedback-stats">
        <div className="stats-card average-rating">
          <h3>Avaliação Média</h3>
          <div className="rating-value">
            {stats.mediaGeral.toFixed(1)}
            <span className="total-ratings">
              ({stats.totalAvaliacoes} avaliações)
            </span>
          </div>
          {renderStars(Math.round(stats.mediaGeral))}
        </div>

        <div className="stats-card distribution">
          <h3>Distribuição das Avaliações</h3>
          {renderRatingDistribution()}
        </div>
      </div>

      <div className="feedback-list">
        <h3>Avaliações Recentes</h3>
        {feedbacks.length > 0 ? (
          feedbacks.map(feedback => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-header">
                <div className="feedback-info">
                  <h4>{feedback.cliente}</h4>
                  <span className="feedback-date">
                    {formatDate(feedback.data)}
                  </span>
                </div>
                {renderStars(feedback.nota)}
              </div>
              
              {feedback.pedidoId && (
                <div className="order-reference">
                  Pedido #{feedback.pedidoId}
                </div>
              )}
              
              {feedback.comentario && (
                <p className="feedback-comment">
                  {feedback.comentario}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="no-feedback">
            Ainda não há avaliações para exibir.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackPanel;
