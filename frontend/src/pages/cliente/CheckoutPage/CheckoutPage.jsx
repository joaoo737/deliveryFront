import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';
import { Loading } from '../../../components/common/Loading/Loading';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    endereco: '',
    complemento: '',
    formaPagamento: '',
    troco: '',
    observacoes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!cart.items.length) {
      navigate('/');
      return;
    }

    if (user?.endereco) {
      setFormData(prev => ({
        ...prev,
        endereco: user.endereco
      }));
    }
  }, [cart.items.length, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    if (!formData.formaPagamento) {
      newErrors.formaPagamento = 'Forma de pagamento é obrigatória';
    }

    if (formData.formaPagamento === 'dinheiro' && !formData.troco) {
      newErrors.troco = 'Troco é obrigatório para pagamento em dinheiro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const pedido = {
        empresaId: cart.empresa.id,
        itens: cart.items.map(item => ({
          produtoId: item.id,
          quantidade: item.quantidade,
          observacoes: item.observacoes
        })),
        endereco: formData.endereco,
        complemento: formData.complemento,
        formaPagamento: formData.formaPagamento,
        troco: formData.formaPagamento === 'dinheiro' ? formData.troco : null,
        observacoes: formData.observacoes
      };

      const response = await api.post(API_ENDPOINTS.CLIENTE.PEDIDOS, pedido);
      
      clearCart();
      navigate(`/pedidos/${response.id}`);
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-content">
          <section className="order-summary">
            <h2>Resumo do Pedido</h2>
            
            <div className="restaurant-info">
              <h3>{cart.empresa.nomeFantasia}</h3>
              <p>{cart.empresa.endereco}</p>
            </div>

            <div className="order-items">
              {cart.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-quantity">{item.quantidade}x</span>
                    <div className="item-details">
                      <h4>{item.nome}</h4>
                      {item.observacoes && (
                        <p className="item-notes">{item.observacoes}</p>
                      )}
                    </div>
                  </div>
                  <span className="item-price">
                    {formatCurrency(item.preco * item.quantidade)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="total-row">
                <span>Taxa de entrega</span>
                <span>{formatCurrency(cart.empresa.taxaEntrega)}</span>
              </div>
              <div className="total-row final">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
          </section>

          <section className="checkout-form">
            <h2>Dados de Entrega</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="endereco">Endereço de Entrega *</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className={errors.endereco ? 'error' : ''}
                />
                {errors.endereco && (
                  <span className="error-text">{errors.endereco}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="complemento">Complemento</label>
                <input
                  type="text"
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  placeholder="Apartamento, bloco, referência..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="formaPagamento">Forma de Pagamento *</label>
                <select
                  id="formaPagamento"
                  name="formaPagamento"
                  value={formData.formaPagamento}
                  onChange={handleInputChange}
                  className={errors.formaPagamento ? 'error' : ''}
                >
                  <option value="">Selecione...</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao">Cartão na Entrega</option>
                  <option value="pix">PIX</option>
                </select>
                {errors.formaPagamento && (
                  <span className="error-text">{errors.formaPagamento}</span>
                )}
              </div>

              {formData.formaPagamento === 'dinheiro' && (
                <div className="form-group">
                  <label htmlFor="troco">Troco para *</label>
                  <input
                    type="number"
                    id="troco"
                    name="troco"
                    value={formData.troco}
                    onChange={handleInputChange}
                    className={errors.troco ? 'error' : ''}
                    min={cart.total}
                    step="0.01"
                  />
                  {errors.troco && (
                    <span className="error-text">{errors.troco}</span>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="observacoes">Observações</label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Instruções especiais para entrega..."
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => navigate(-1)}
                >
                  Voltar
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                >
                  Finalizar Pedido
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
