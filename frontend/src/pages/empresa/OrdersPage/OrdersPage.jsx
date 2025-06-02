import React, { useState, useEffect } from 'react';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS, STATUS_PEDIDO } from '../../../utils/constants';
import { OrderList } from '../../../components/common/OrderList/OrderList';
import { Loading } from '../../../components/common/Loading/Loading';
import './OrdersPage.css';

const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('pendente');
  const [stats, setStats] = useState({
    pendentes: 0,
    preparando: 0,
    prontos: 0,
    entregues: 0,
    cancelados: 0
  });

  useEffect(() => {
    loadOrders();
    loadStats();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await api.get(
        `${API_ENDPOINTS.EMPRESA.PEDIDOS}?${params.toString()}`
      );
      setOrders(response);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.PEDIDOS + '/stats');
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(
        `${API_ENDPOINTS.EMPRESA.PEDIDOS}/${orderId}/status`,
        { status: newStatus }
      );
      loadOrders();
      loadStats();
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      return;
    }

    try {
      await api.post(`${API_ENDPOINTS.EMPRESA.PEDIDOS}/${orderId}/cancelar`);
      loadOrders();
      loadStats();
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
    }
  };

  return (
    <div className="orders-page">
      <header className="page-header">
        <h1>Pedidos</h1>
        
        <div className="order-stats">
          <div 
            className={`stat-card ${filter === 'pendente' ? 'active' : ''}`}
            onClick={() => setFilter('pendente')}
          >
            <span className="stat-value">{stats.pendentes}</span>
            <span className="stat-label">Pendentes</span>
          </div>

          <div 
            className={`stat-card ${filter === 'preparando' ? 'active' : ''}`}
            onClick={() => setFilter('preparando')}
          >
            <span className="stat-value">{stats.preparando}</span>
            <span className="stat-label">Em Preparo</span>
          </div>

          <div 
            className={`stat-card ${filter === 'pronto' ? 'active' : ''}`}
            onClick={() => setFilter('pronto')}
          >
            <span className="stat-value">{stats.prontos}</span>
            <span className="stat-label">Prontos</span>
          </div>

          <div 
            className={`stat-card ${filter === 'entregue' ? 'active' : ''}`}
            onClick={() => setFilter('entregue')}
          >
            <span className="stat-value">{stats.entregues}</span>
            <span className="stat-label">Entregues</span>
          </div>

          <div 
            className={`stat-card ${filter === 'cancelado' ? 'active' : ''}`}
            onClick={() => setFilter('cancelado')}
          >
            <span className="stat-value">{stats.cancelados}</span>
            <span className="stat-label">Cancelados</span>
          </div>
        </div>
      </header>

      <div className="page-content">
        {loading ? (
          <Loading />
        ) : (
          <>
            {orders.length > 0 ? (
              <OrderList
                orders={orders}
                onStatusChange={handleStatusChange}
                onCancelOrder={handleCancelOrder}
              />
            ) : (
              <div className="no-orders">
                <span className="material-icons">receipt_long</span>
                <h2>Nenhum pedido encontrado</h2>
                <p>
                  {filter === 'all'
                    ? 'Você ainda não recebeu nenhum pedido'
                    : `Nenhum pedido ${STATUS_PEDIDO[filter].toLowerCase()}`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
