import { api } from '../httpClient';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * API de cliente
 */
export const clienteApi = {
  /**
   * Obtém perfil do cliente
   */
  getPerfil: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CLIENTE.PERFIL);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza perfil do cliente
   */
  updatePerfil: async (dadosCliente) => {
    try {
      const response = await api.put(API_ENDPOINTS.CLIENTE.PERFIL, dadosCliente);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista pedidos do cliente
   */
  getPedidos: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.CLIENTE.PEDIDOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca pedido por ID
   */
  getPedido: async (pedidoId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CLIENTE.PEDIDOS}/${pedidoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cria novo pedido
   */
  criarPedido: async (dadosPedido) => {
    try {
      const response = await api.post(API_ENDPOINTS.CLIENTE.PEDIDOS, dadosPedido);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista pedidos por status
   */
  getPedidosPorStatus: async (status, params = {}) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.CLIENTE.PEDIDOS}/status/${status}`,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cancela pedido
   */
  cancelarPedido: async (pedidoId) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.CLIENTE.PEDIDOS}/${pedidoId}/cancelar`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Rastreia pedido
   */
  rastrearPedido: async (pedidoId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.CLIENTE.PEDIDOS}/${pedidoId}/rastrear`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Paga pedido
   */
  pagarPedido: async (pedidoId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.CLIENTE.PEDIDOS}/${pedidoId}/pagar`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém estatísticas do cliente
   */
  getEstatisticas: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CLIENTE.PEDIDOS}/estatisticas`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cria feedback para pedido
   */
  criarFeedback: async (pedidoId, dadosFeedback) => {
    try {
      const response = await api.post(
        `${API_ENDPOINTS.CLIENTE.FEEDBACKS}/pedido/${pedidoId}`,
        dadosFeedback
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Hooks para cliente
 */
export const clienteHooks = {
  /**
   * Hook para perfil do cliente
   */
  usePerfil: () => {
    const [perfil, setPerfil] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const carregarPerfil = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await clienteApi.getPerfil();
        setPerfil(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const atualizarPerfil = async (dados) => {
      try {
        setLoading(true);
        setError(null);
        const response = await clienteApi.updatePerfil(dados);
        setPerfil(response);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      carregarPerfil();
    }, []);

    return {
      perfil,
      loading,
      error,
      carregarPerfil,
      atualizarPerfil
    };
  },

  /**
   * Hook para pedidos do cliente
   */
  usePedidos: (params = {}) => {
    const [pedidos, setPedidos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [pagination, setPagination] = React.useState(null);

    const carregarPedidos = async (novosParams = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await clienteApi.getPedidos({ ...params, ...novosParams });
        setPedidos(response.content || response);
        setPagination(response.pagination || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const criarPedido = async (dadosPedido) => {
      try {
        setLoading(true);
        setError(null);
        const response = await clienteApi.criarPedido(dadosPedido);
        // Recarregar lista de pedidos
        await carregarPedidos();
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const cancelarPedido = async (pedidoId) => {
      try {
        setLoading(true);
        setError(null);
        const response = await clienteApi.cancelarPedido(pedidoId);
        // Atualizar pedido na lista
        setPedidos(prev => prev.map(pedido => 
          pedido.id === pedidoId ? response : pedido
        ));
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      carregarPedidos();
    }, [JSON.stringify(params)]);

    return {
      pedidos,
      loading,
      error,
      pagination,
      carregarPedidos,
      criarPedido,
      cancelarPedido
    };
  },

  /**
   * Hook para pedido específico
   */
  usePedido: (pedidoId) => {
    const [pedido, setPedido] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const carregarPedido = async () => {
      if (!pedidoId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await clienteApi.getPedido(pedidoId);
        setPedido(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const rastrearPedido = async () => {
      if (!pedidoId) return;
      
      try {
        const response = await clienteApi.rastrearPedido(pedidoId);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    };

    const pagarPedido = async () => {
      if (!pedidoId) return;
      
      try {
        const response = await clienteApi.pagarPedido(pedidoId);
        setPedido(response);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    };

    React.useEffect(() => {
      carregarPedido();
    }, [pedidoId]);

    return {
      pedido,
      loading,
      error,
      carregarPedido,
      rastrearPedido,
      pagarPedido
    };
  },

  /**
   * Hook para estatísticas do cliente
   */
  useEstatisticas: () => {
    const [estatisticas, setEstatisticas] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const carregarEstatisticas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await clienteApi.getEstatisticas();
        setEstatisticas(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      carregarEstatisticas();
    }, []);

    return {
      estatisticas,
      loading,
      error,
      carregarEstatisticas
    };
  }
};

/**
 * Helpers para cliente
 */
export const clienteHelpers = {
  /**
   * Formata dados do perfil para envio
   */
  formatarPerfilParaEnvio: (dados) => {
    return {
      nome: dados.nome?.trim(),
      telefone: dados.telefone?.replace(/\D/g, ''),
      endereco: dados.endereco?.trim(),
      latitude: dados.latitude ? parseFloat(dados.latitude) : null,
      longitude: dados.longitude ? parseFloat(dados.longitude) : null
    };
  },

  /**
   * Formata dados do pedido para envio
   */
  formatarPedidoParaEnvio: (dados) => {
    return {
      empresaId: parseInt(dados.empresaId),
      formaPagamento: dados.formaPagamento,
      observacoes: dados.observacoes?.trim() || null,
      enderecoEntrega: dados.enderecoEntrega?.trim(),
      itens: dados.itens.map(item => ({
        produtoId: parseInt(item.produtoId),
        quantidade: parseInt(item.quantidade),
        precoUnitario: parseFloat(item.precoUnitario),
        subtotal: parseFloat(item.subtotal)
      }))
    };
  },

  /**
   * Calcula total do pedido
   */
  calcularTotalPedido: (itens) => {
    return itens.reduce((total, item) => {
      return total + (item.precoUnitario * item.quantidade);
    }, 0);
  },

  /**
   * Verifica se pedido pode ser cancelado
   */
  podeCancelarPedido: (pedido) => {
    const statusCancelaveis = ['PENDENTE', 'CONFIRMADO'];
    return statusCancelaveis.includes(pedido.status);
  },

  /**
   * Verifica se pedido pode ser avaliado
   */
  podeAvaliarPedido: (pedido) => {
    return pedido.status === 'ENTREGUE' && !pedido.feedback;
  },

  /**
   * Formata feedback para envio
   */
  formatarFeedbackParaEnvio: (dados) => {
    return {
      nota: parseInt(dados.nota),
      comentario: dados.comentario?.trim() || null
    };
  }
};

export default clienteApi;