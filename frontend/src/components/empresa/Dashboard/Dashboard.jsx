import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS, STATUS_PEDIDO } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Loading } from '../../common/Loading/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pedidosHoje: 0,
    receitaHoje: 0,
    pedidosPendentes: 0,
    avaliacaoMedia: 0
  });
  const [pedidosRecentes, setPedidosRecentes] = useState([]);
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]);
  const [avaliacoesRecentes, setAvaliacoesRecentes] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsResponse,
        pedidosResponse,
        produtosResponse,
        avaliacoesResponse
      ] = await Promise.all([
        api.get(API_ENDPOINTS.EMPRESA.RELATORIOS + '/stats'),
        api.get(API_ENDPOINTS.EMPRESA.PEDIDOS + '/recentes'),
        api.get(API_ENDPOINTS.EMPRESA.RELATORIOS + '/produtos-mais-vendidos'),
        api.get(API_ENDPOINTS.EMPRESA.FEEDBACKS + '/recentes')
      ]);

      setStats(statsResponse);
      setPedidosRecentes(pedidosResponse);
      setProdutosMaisVendidos(produtosResponse);
      setAvaliacoesRecentes(avaliacoesResponse);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders">
            <span className="material-icons">receipt</span>
          </div>
          <div className="stat-info">
            <h3>Pedidos Hoje</h3>
            <p className="stat-value">{stats.pedidosHoje}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <span className="material-icons">payments</span>
          </div>
          <div className="stat-info">
            <h3>Receita Hoje</h3>
            <p className="stat-value">{formatCurrency(stats.receitaHoje)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <span className="material-icons">pending</span>
          </div>
          <div className="stat-info">
            <h3>Pedidos Pendentes</h3>
            <p className="stat-value">{stats.pedidosPendentes}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rating">
            <span className="material-icons">star</span>
          </div>
          <div className="stat-info">
            <h3>Avaliação Média</h3>
            <p className="stat-value">{stats.avaliacaoMedia.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Pedidos Recentes</h2>
            <button onClick={() => navigate('/empresa/pedidos')}>
              Ver Todos
            </button>
          </div>
          <div className="card-content">
            {pedidosRecentes.length > 0 ? (
              <div className="orders-list">
                {pedidosRecentes.map(pedido => (
                  <div key={pedido.id} className="order-item">
                    <div className="order-info">
                      <span className="order-id">#{pedido.id}</span>
                      <span className={`order-status ${pedido.status.toLowerCase()}`}>
                        {STATUS_PEDIDO[pedido.status]}
                      </span>
                    </div>
                    <div className="order-details">
                      <p>{pedido.cliente}</p>
                      <p>{formatCurrency(pedido.total)}</p>
                      <p>{formatDate(pedido.data)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Nenhum pedido recente</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Produtos Mais Vendidos</h2>
            <button onClick={() => navigate('/empresa/produtos')}>
              Ver Todos
            </button>
          </div>
          <div className="card-content">
            {produtosMaisVendidos.length > 0 ? (
              <div className="products-list">
                {produtosMaisVendidos.map(produto => (
                  <div key={produto.id} className="product-item">
                    {produto.imagemUrl && (
                      <img 
                        src={produto.imagemUrl} 
                        alt={produto.nome}
                        className="product-image"
                      />
                    )}
                    <div className="product-info">
                      <h3>{produto.nome}</h3>
                      <p>{formatCurrency(produto.preco)}</p>
                    </div>
                    <div className="product-stats">
                      <p>{produto.quantidadeVendida} vendidos</p>
                      <p>{formatCurrency(produto.receitaTotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Nenhum produto vendido ainda</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Avaliações Recentes</h2>
            <button onClick={() => navigate('/empresa/avaliacoes')}>
              Ver Todas
            </button>
          </div>
          <div className="card-content">
            {avaliacoesRecentes.length > 0 ? (
              <div className="reviews-list">
                {avaliacoesRecentes.map(avaliacao => (
                  <div key={avaliacao.id} className="review-item">
                    <div className="review-header">
                      <div className="review-rating">
                        {[...Array(5)].map((_, index) => (
                          <span
                            key={index}
                            className="material-icons"
                            style={{
                              color: index < avaliacao.nota ? 'var(--primary-color)' : 'var(--text-tertiary)'
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="review-date">
                        {formatDate(avaliacao.data)}
                      </span>
                    </div>
                    <p className="review-comment">{avaliacao.comentario}</p>
                    <p className="review-author">{avaliacao.cliente}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Nenhuma avaliação ainda</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
