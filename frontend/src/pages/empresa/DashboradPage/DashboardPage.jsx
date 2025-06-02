import React, { useState, useEffect } from 'react';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';
import { Loading } from '../../../components/common/Loading';
import './DashboardPage.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pedidosHoje: 0,
    receitaHoje: 0,
    pedidosPendentes: 0,
    avaliacaoMedia: 0,
    totalAvaliacoes: 0,
    produtosMaisVendidos: [],
    graficoVendas: {
      labels: [],
      data: []
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.EMPRESA.DASHBOARD);
      setStats(response);
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
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="page-description">
          Visão geral do seu negócio
        </p>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="material-icons">receipt</span>
              <h3>Pedidos Hoje</h3>
            </div>
            <div className="stat-value">{stats.pedidosHoje}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="material-icons">payments</span>
              <h3>Receita Hoje</h3>
            </div>
            <div className="stat-value">{formatCurrency(stats.receitaHoje)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="material-icons">pending</span>
              <h3>Pedidos Pendentes</h3>
            </div>
            <div className="stat-value">{stats.pedidosPendentes}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="material-icons">star</span>
              <h3>Avaliação Média</h3>
            </div>
            <div className="stat-value">
              {stats.avaliacaoMedia.toFixed(1)}
              <span className="stat-subtitle">
                ({stats.totalAvaliacoes} avaliações)
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="dashboard-section">
            <h2>Produtos Mais Vendidos</h2>
            <div className="top-products">
              {stats.produtosMaisVendidos.map((produto, index) => (
                <div key={produto.id} className="product-item">
                  <span className="product-rank">#{index + 1}</span>
                  <div className="product-info">
                    <h4>{produto.nome}</h4>
                    <p>{produto.quantidade} vendidos</p>
                  </div>
                  <span className="product-revenue">
                    {formatCurrency(produto.receita)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Vendas dos Últimos 7 Dias</h2>
            <div className="sales-chart">
              {stats.graficoVendas.data.map((valor, index) => (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar-fill"
                    style={{
                      height: `${(valor / Math.max(...stats.graficoVendas.data)) * 100}%`
                    }}
                  />
                  <span className="bar-label">
                    {stats.graficoVendas.labels[index]}
                  </span>
                  <span className="bar-value">
                    {formatCurrency(valor)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
