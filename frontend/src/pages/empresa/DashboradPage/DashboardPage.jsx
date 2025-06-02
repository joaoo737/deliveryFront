import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { empresaApi } from '../../../services/api/empresaApi';
import { formatCurrency, formatDateTime, formatRelativeTime } from '../../../utils/formatters';
import Header from '../../../components/common/Header/Header';
import Loading from '../../../components/common/Loading/Loading';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [pedidosRecentes, setPedidosRecentes] = useState([]);
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState([]);

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const carregarDadosDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, pedidosRes, produtosRes] = await Promise.allSettled([
        empresaApi.relatorios.getDashboard(),
        empresaApi.getPedidos({ page: 0, size: 5 }),
        empresaApi.getProdutosBaixoEstoque(5)
      ]);

      if (dashboardRes.status === 'fulfilled') {
        setDashboardData(dashboardRes.value);
      }

      if (pedidosRes.status === 'fulfilled') {
        setPedidosRecentes(pedidosRes.value.content || pedidosRes.value);
      }

      if (produtosRes.status === 'fulfilled') {
        setProdutosBaixoEstoque(produtosRes.value);
      }

    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const obterIconeStatus = (status) => {
    const icones = {
      'PENDENTE': '⏱️',
      'CONFIRMADO': '✅',
      'PREPARANDO': '👨‍🍳',
      'PRONTO': '📦',
      'ENTREGUE': '🚚',
      'CANCELADO': '❌'
    };
    return icones[status] || '📋';
  };

  const obterClasseStatus = (status) => {
    const classes = {
      'PENDENTE': 'dashboard-order-item__status--pending',
      'CONFIRMADO': 'dashboard-order-item__status--confirmed',
      'PREPARANDO': 'dashboard-order-item__status--preparing',
      'PRONTO': 'dashboard-order-item__status--ready',
      'ENTREGUE': 'dashboard-order-item__status--ready',
      'CANCELADO': 'dashboard-order-item__status--pending'
    };
    return classes[status] || '';
  };

  const calcularVariacao = (atual, anterior) => {
    if (!anterior || anterior === 0) return 0;
    return ((atual - anterior) / anterior) * 100;
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Header />
        <div className="dashboard-loading">
          <Loading size="large" text="Carregando dashboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <Header />
        <div className="dashboard-error">
          <h2 className="dashboard-error__title">Erro ao carregar dashboard</h2>
          <p className="dashboard-error__message">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={carregarDadosDashboard}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData || {};

  return (
    <div className="dashboard-page">
      <Header />
      
      <div className="dashboard-page__container">
        <div className="dashboard-page__header">
          <div>
            <h1 className="dashboard-page__title">Dashboard</h1>
            <p className="dashboard-page__subtitle">
              Bem-vindo de volta! Aqui está um resumo do seu negócio hoje.
            </p>
          </div>
          
          <div className="dashboard-page__actions">
            <Link to="/empresa/produtos" className="btn btn-secondary">
              Gerenciar Produtos
            </Link>
            <Link to="/empresa/pedidos" className="btn btn-primary">
              Ver Pedidos
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="dashboard-page__stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__header">
              <div className="dashboard-stat-card__icon">💰</div>
            </div>
            <div className="dashboard-stat-card__value">
              {formatCurrency(stats.vendasMes || 0)}
            </div>
            <div className="dashboard-stat-card__label">Vendas este mês</div>
            <div className="dashboard-stat-card__change dashboard-stat-card__change--positive">
              <span className="dashboard-stat-card__change-icon">↗</span>
              +12% vs mês anterior
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__header">
              <div className="dashboard-stat-card__icon">📦</div>
            </div>
            <div className="dashboard-stat-card__value">
              {stats.pedidosMes || 0}
            </div>
            <div className="dashboard-stat-card__label">Pedidos este mês</div>
            <div className="dashboard-stat-card__change dashboard-stat-card__change--positive">
              <span className="dashboard-stat-card__change-icon">↗</span>
              +8% vs mês anterior
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__header">
              <div className="dashboard-stat-card__icon">🍕</div>
            </div>
            <div className="dashboard-stat-card__value">
              {stats.produtosAtivos || 0}
            </div>
            <div className="dashboard-stat-card__label">Produtos ativos</div>
            <div className="dashboard-stat-card__change dashboard-stat-card__change--negative">
              <span className="dashboard-stat-card__change-icon">⚠️</span>
              {stats.produtosBaixoEstoque || 0} com baixo estoque
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-card__header">
              <div className="dashboard-stat-card__icon">⭐</div>
            </div>
            <div className="dashboard-stat-card__value">
              {(stats.avaliacaoMedia || 0).toFixed(1)}
            </div>
            <div className="dashboard-stat-card__label">Avaliação média</div>
            <div className="dashboard-stat-card__change">
              <span className="dashboard-stat-card__change-icon">📊</span>
              {stats.totalAvaliacoes || 0} avaliações
            </div>
          </div>
        </div>

        <div className="dashboard-page__content">
          <div className="dashboard-page__main">
            {/* Gráfico de Vendas */}
            <div className="dashboard-section">
              <div className="dashboard-section__header">
                <h3 className="dashboard-section__title">Vendas dos últimos 7 dias</h3>
                <Link to="/empresa/relatorios" className="dashboard-section__action">
                  Ver relatórios completos
                </Link>
              </div>
              <div className="dashboard-chart">
                <p>Gráfico de vendas será implementado aqui</p>
              </div>
            </div>

            {/* Pedidos Recentes */}
            <div className="dashboard-section">
              <div className="dashboard-section__header">
                <h3 className="dashboard-section__title">Pedidos Recentes</h3>
                <Link to="/empresa/pedidos" className="dashboard-section__action">
                  Ver todos os pedidos
                </Link>
              </div>
              
              <div className="dashboard-recent-orders">
                {pedidosRecentes.length > 0 ? (
                  pedidosRecentes.map((pedido) => (
                    <div key={pedido.id} className="dashboard-order-item">
                      <div className="dashboard-order-item__info">
                        <div className="dashboard-order-item__id">
                          {obterIconeStatus(pedido.status)} Pedido #{pedido.id}
                        </div>
                        <div className="dashboard-order-item__time">
                          {formatRelativeTime(pedido.dataPedido)}
                        </div>
                      </div>
                      
                      <div className={`dashboard-order-item__status ${obterClasseStatus(pedido.status)}`}>
                        {pedido.status}
                      </div>
                      
                      <div className="dashboard-order-item__value">
                        {formatCurrency(pedido.total)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center" style={{ color: 'var(--text-tertiary)', padding: 'var(--spacing-xl)' }}>
                    Nenhum pedido recente encontrado
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-page__sidebar">
            {/* Alertas */}
            <div className="dashboard-section">
              <div className="dashboard-section__header">
                <h3 className="dashboard-section__title">Alertas</h3>
              </div>
              
              <div className="dashboard-alerts">
                {produtosBaixoEstoque.length > 0 && (
                  <div className="dashboard-alert dashboard-alert--critical">
                    <div className="dashboard-alert__icon dashboard-alert__icon--critical">⚠️</div>
                    <div className="dashboard-alert__content">
                      <div className="dashboard-alert__title">Produtos com baixo estoque</div>
                      <div className="dashboard-alert__message">
                        {produtosBaixoEstoque.length} produtos precisam de reposição
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="dashboard-alert dashboard-alert--info">
                  <div className="dashboard-alert__icon dashboard-alert__icon--info">💡</div>
                  <div className="dashboard-alert__content">
                    <div className="dashboard-alert__title">Dica do dia</div>
                    <div className="dashboard-alert__message">
                      Produtos com fotos têm 40% mais chances de serem pedidos!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="dashboard-section">
              <div className="dashboard-section__header">
                <h3 className="dashboard-section__title">Ações Rápidas</h3>
              </div>
              
              <div className="dashboard-quick-actions">
                <Link to="/empresa/produtos" className="dashboard-quick-action">
                  <div className="dashboard-quick-action__icon">➕</div>
                  <div className="dashboard-quick-action__label">Adicionar Produto</div>
                </Link>
                
                <Link to="/empresa/relatorios" className="dashboard-quick-action">
                  <div className="dashboard-quick-action__icon">📊</div>
                  <div className="dashboard-quick-action__label">Ver Relatórios</div>
                </Link>
                
                <Link to="/empresa/feedbacks" className="dashboard-quick-action">
                  <div className="dashboard-quick-action__icon">⭐</div>
                  <div className="dashboard-quick-action__label">Feedbacks</div>
                </Link>
                
                <Link to="/empresa/perfil" className="dashboard-quick-action">
                  <div className="dashboard-quick-action__icon">⚙️</div>
                  <div className="dashboard-quick-action__label">Configurações</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;