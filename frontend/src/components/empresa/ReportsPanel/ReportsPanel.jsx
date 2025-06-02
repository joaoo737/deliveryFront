import React, { useState, useEffect } from 'react';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Loading } from '../../common/Loading/Loading';
import './ReportsPanel.css';

const ReportsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reports, setReports] = useState({
    resumo: {
      totalVendas: 0,
      totalPedidos: 0,
      ticketMedio: 0,
      taxaCancelamento: 0
    },
    vendasPorDia: [],
    vendasPorCategoria: [],
    produtosMaisVendidos: [],
    horariosPico: []
  });

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.EMPRESA.RELATORIOS, {
        params: dateRange
      });
      setReports(response);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="reports-panel">
      <div className="date-filter">
        <div className="date-inputs">
          <div className="input-group">
            <label htmlFor="startDate">Data Inicial</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              max={dateRange.endDate}
            />
          </div>
          <div className="input-group">
            <label htmlFor="endDate">Data Final</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              min={dateRange.startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card summary">
          <h3>Resumo do Período</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total em Vendas</span>
              <span className="stat-value">
                {formatCurrency(reports.resumo.totalVendas)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total de Pedidos</span>
              <span className="stat-value">{reports.resumo.totalPedidos}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ticket Médio</span>
              <span className="stat-value">
                {formatCurrency(reports.resumo.ticketMedio)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Taxa de Cancelamento</span>
              <span className="stat-value">
                {reports.resumo.taxaCancelamento.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="report-card sales-by-day">
          <h3>Vendas por Dia</h3>
          <div className="sales-chart">
            {reports.vendasPorDia.map(day => (
              <div key={day.data} className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ 
                    height: `${(day.total / Math.max(...reports.vendasPorDia.map(d => d.total))) * 100}%`
                  }}
                >
                  <span className="bar-value">{formatCurrency(day.total)}</span>
                </div>
                <span className="bar-label">{formatDate(day.data, 'short')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card categories">
          <h3>Vendas por Categoria</h3>
          <div className="categories-list">
            {reports.vendasPorCategoria.map(category => (
              <div key={category.categoria} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.categoria}</span>
                  <span className="category-value">
                    {formatCurrency(category.total)}
                  </span>
                </div>
                <div className="category-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(category.total / Math.max(...reports.vendasPorCategoria.map(c => c.total))) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card top-products">
          <h3>Produtos Mais Vendidos</h3>
          <div className="products-list">
            {reports.produtosMaisVendidos.map((product, index) => (
              <div key={product.id} className="product-item">
                <span className="product-rank">#{index + 1}</span>
                <div className="product-info">
                  <span className="product-name">{product.nome}</span>
                  <span className="product-stats">
                    {product.quantidade} vendidos • {formatCurrency(product.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-card peak-hours">
          <h3>Horários de Pico</h3>
          <div className="hours-chart">
            {reports.horariosPico.map(hour => (
              <div key={hour.hora} className="hour-bar">
                <div 
                  className="bar-fill"
                  style={{ 
                    height: `${(hour.pedidos / Math.max(...reports.horariosPico.map(h => h.pedidos))) * 100}%`
                  }}
                >
                  <span className="bar-value">{hour.pedidos}</span>
                </div>
                <span className="bar-label">{hour.hora}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
