import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { 
  STATUS_PEDIDO, 
  STATUS_PEDIDO_LABELS, 
  STATUS_PEDIDO_COLORS,
  TIPO_USUARIO 
} from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import './OrderList.css';

const OrderList = ({ 
  orders, 
  onStatusChange,
  onCancelOrder,
  showActions = true 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const isEmpresa = user?.tipoUsuario === TIPO_USUARIO.EMPRESA;

  const handleStatusChange = async (orderId, newStatus) => {
    if (onStatusChange) {
      await onStatusChange(orderId, newStatus);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (onCancelOrder) {
      await onCancelOrder(orderId);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      [STATUS_PEDIDO.PENDENTE]: STATUS_PEDIDO.CONFIRMADO,
      [STATUS_PEDIDO.CONFIRMADO]: STATUS_PEDIDO.PREPARANDO,
      [STATUS_PEDIDO.PREPARANDO]: STATUS_PEDIDO.PRONTO,
      [STATUS_PEDIDO.PRONTO]: STATUS_PEDIDO.ENTREGUE
    };
    return statusFlow[currentStatus];
  };

  const canChangeStatus = (status) => {
    return status !== STATUS_PEDIDO.ENTREGUE && 
           status !== STATUS_PEDIDO.CANCELADO;
  };

  const canCancelOrder = (status) => {
    return status === STATUS_PEDIDO.PENDENTE || 
           status === STATUS_PEDIDO.CONFIRMADO;
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="order-list">
      {orders.map(order => (
        <div 
          key={order.id} 
          className={`order-card ${expandedOrder === order.id ? 'expanded' : ''}`}
        >
          <div 
            className="order-header"
            onClick={() => toggleOrderExpand(order.id)}
          >
            <div className="order-main-info">
              <span className="order-number">Pedido #{order.id}</span>
              <span 
                className="order-status"
                style={{ backgroundColor: STATUS_PEDIDO_COLORS[order.status] }}
              >
                {STATUS_PEDIDO_LABELS[order.status]}
              </span>
            </div>

            <div className="order-summary">
              <div className="order-details">
                <p>{isEmpresa ? order.cliente : order.empresa}</p>
                <p>{formatDate(order.data)}</p>
                <p className="order-total">{formatCurrency(order.total)}</p>
              </div>
              <span className={`material-icons expand-icon ${
                expandedOrder === order.id ? 'expanded' : ''
              }`}>
                expand_more
              </span>
            </div>
          </div>

          {expandedOrder === order.id && (
            <div className="order-content">
              <div className="order-items">
                {order.itens.map(item => (
                  <div key={item.id} className="order-item">
                    {item.imagemUrl && (
                      <img 
                        src={item.imagemUrl} 
                        alt={item.nome}
                        className="item-image"
                      />
                    )}
                    <div className="item-info">
                      <h4>{item.nome}</h4>
                      <p className="item-quantity">
                        {item.quantidade} x {formatCurrency(item.precoUnitario)}
                      </p>
                    </div>
                    <p className="item-total">
                      {formatCurrency(item.precoUnitario * item.quantidade)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.taxaEntrega > 0 && (
                    <div className="total-row">
                      <span>Taxa de Entrega</span>
                      <span>{formatCurrency(order.taxaEntrega)}</span>
                    </div>
                  )}
                  <div className="total-row final">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {showActions && (
                  <div className="order-actions">
                    {isEmpresa && canChangeStatus(order.status) && (
                      <button
                        className="status-button"
                        onClick={() => handleStatusChange(
                          order.id, 
                          getNextStatus(order.status)
                        )}
                      >
                        Avançar Status
                      </button>
                    )}

                    {canCancelOrder(order.status) && (
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancelar Pedido
                      </button>
                    )}
                  </div>
                )}

                {order.observacoes && (
                  <div className="order-notes">
                    <h4>Observações:</h4>
                    <p>{order.observacoes}</p>
                  </div>
                )}

                {order.enderecoEntrega && (
                  <div className="delivery-info">
                    <h4>Endereço de Entrega:</h4>
                    <p>{order.enderecoEntrega}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {orders.length === 0 && (
        <div className="no-orders">
          <span className="material-icons">receipt_long</span>
          <p>Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  );
};

export default OrderList;
