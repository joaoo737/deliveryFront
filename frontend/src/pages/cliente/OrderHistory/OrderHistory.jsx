import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { OrderList } from '../../../components/common/OrderList/OrderList';
import { Loading } from '../../../components/common/Loading/Loading';
import './OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await api.get(
        `${API_ENDPOINTS.CLIENTE.PEDIDOS}?${params.toString()}`
      );
      setOrders(response);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.post(`${API_ENDPOINTS.CLIENTE.PEDIDOS}/${orderId}/cancelar`);
      loadOrders();
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/pedidos/${orderId}`);
  };

  return (
    <div className="order-history">
      <header className="history-header">
        <h1>Meus Pedidos</h1>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={`filter-tab ${filter === 'pendente' ? 'active' : ''}`}
            onClick={() => setFilter('pendente')}
          >
            Em Andamento
          </button>
          <button
            className={`filter-tab ${filter === 'entregue' ? 'active' : ''}`}
            onClick={() => setFilter('entregue')}
          >
            Entregues
          </button>
          <button
            className={`filter-tab ${filter === 'cancelado' ? 'active' : ''}`}
            onClick={() => setFilter('cancelado')}
          >
            Cancelados
          </button>
        </div>
      </header>

      <div className="history-content">
        {loading ? (
          <Loading />
        ) : (
          <>
            {orders.length > 0 ? (
              <OrderList
                orders={orders}
                onCancelOrder={handleCancelOrder}
                onOrderClick={handleOrderClick}
              />
            ) : (
              <div className="no-orders">
                <span className="material-icons">receipt_long</span>
                <h2>Nenhum pedido encontrado</h2>
                <p>
                  {filter === 'all'
                    ? 'Você ainda não fez nenhum pedido'
                    : 'Nenhum pedido encontrado com este filtro'}
                </p>
                <button
                  className="browse-button"
                  onClick={() => navigate('/catalogo')}
                >
                  Explorar Restaurantes
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
