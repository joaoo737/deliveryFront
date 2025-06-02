import { api } from '../httpClient';
import { API_ENDPOINTS, STATUS_PEDIDO, STATUS_PAGAMENTO } from '../../utils/constants';

/**
 * API de pedidos
 */
export const pedidoApi = {
  /**
   * Cria novo pedido (cliente)
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
   * Lista pedidos do cliente
   */
  listarPedidosCliente: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.CLIENTE.PEDIDOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista pedidos da empresa
   */
  listarPedidosEmpresa: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.PEDIDOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca pedido por ID (cliente)
   */
  buscarPedidoCliente: async (pedidoId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CLIENTE.PEDIDOS}/${pedidoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista pedidos por status (cliente)
   */
  listarPorStatusCliente: async (status, params = {}) => {
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
   * Cancela pedido (cliente)
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
   * Rastreia pedido (cliente)
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
   * Realiza pagamento do pedido (cliente)
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
   * Atualiza status do pedido (empresa)
   */
  atualizarStatus: async (pedidoId, novoStatus) => {
    try {
      const response = await api.patch(
        `${API_ENDPOINTS.EMPRESA.PEDIDOS}/${pedidoId}/status`,
        null,
        { params: { status: novoStatus } }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém estatísticas de pedidos (cliente)
   */
  obterEstatisticasCliente: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.CLIENTE.PEDIDOS}/estatisticas`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Hooks para pedidos
 */
export const pedidoHooks = {
  /**
   * Hook para lista de pedidos
   */
  usePedidos: (tipo = 'cliente', filtros = {}) => {
    const [pedidos, setPedidos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [pagination, setPagination] = React.useState(null);

    const carregarPedidos = async (novosFiltros = {}) => {
      try {
        setLoading(true);
        setError(null);
        
        const filtrosCompletos = { ...filtros, ...novosFiltros };
        
        let response;
        if (tipo === 'cliente') {
          response = await pedidoApi.listarPedidosCliente(filtrosCompletos);
        } else {
          response = await pedidoApi.listarPedidosEmpresa(filtrosCompletos);
        }
        
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
        const response = await pedidoApi.criarPedido(dadosPedido);
        // Recarregar lista
        await carregarPedidos();
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const atualizarStatusPedido = async (pedidoId, novoStatus) => {
      try {
        setLoading(true);
        setError(null);
        const response = await pedidoApi.atualizarStatus(pedidoId, novoStatus);
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
    }, [JSON.stringify(filtros), tipo]);

    return {
      pedidos,
      loading,
      error,
      pagination,
      carregarPedidos,
      criarPedido,
      atualizarStatusPedido
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
        const response = await pedidoApi.buscarPedidoCliente(pedidoId);
        setPedido(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const cancelarPedido = async () => {
      if (!pedidoId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await pedidoApi.cancelarPedido(pedidoId);
        setPedido(response);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const pagarPedido = async () => {
      if (!pedidoId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await pedidoApi.pagarPedido(pedidoId);
        setPedido(response);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const rastrearPedido = async () => {
      if (!pedidoId) return;

      try {
        const response = await pedidoApi.rastrearPedido(pedidoId);
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
      cancelarPedido,
      pagarPedido,
      rastrearPedido
    };
  },

  /**
   * Hook para estatísticas de pedidos
   */
  useEstatisticasPedidos: () => {
    const [estatisticas, setEstatisticas] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const carregarEstatisticas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await pedidoApi.obterEstatisticasCliente();
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
 * Helpers para pedidos
 */
export const pedidoHelpers = {
  /**
   * Formata dados do pedido para criação
   */
  formatarPedidoParaCriacao: (dadosCarrinho) => {
    return {
      empresaId: dadosCarrinho.empresaId,
      formaPagamento: dadosCarrinho.formaPagamento,
      observacoes: dadosCarrinho.observacoes?.trim() || '',
      enderecoEntrega: dadosCarrinho.enderecoEntrega?.trim(),
      itens: dadosCarrinho.itens.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.precoUnitario * item.quantidade
      }))
    };
  },

  /**
   * Calcula total do pedido
   */
  calcularTotal: (itens) => {
    return itens.reduce((total, item) => {
      return total + (item.precoUnitario * item.quantidade);
    }, 0);
  },

  /**
   * Formata valor monetário
   */
  formatarValor: (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  },

  /**
   * Obtém cor do status do pedido
   */
  obterCorStatus: (status) => {
    const cores = {
      [STATUS_PEDIDO.PENDENTE]: '#ffc107',
      [STATUS_PEDIDO.CONFIRMADO]: '#17a2b8',
      [STATUS_PEDIDO.PREPARANDO]: '#FF4621',
      [STATUS_PEDIDO.PRONTO]: '#28a745',
      [STATUS_PEDIDO.ENTREGUE]: '#6f42c1',
      [STATUS_PEDIDO.CANCELADO]: '#dc3545'
    };
    return cores[status] || '#6c757d';
  },

  /**
   * Obtém label do status do pedido
   */
  obterLabelStatus: (status) => {
    const labels = {
      [STATUS_PEDIDO.PENDENTE]: 'Pendente',
      [STATUS_PEDIDO.CONFIRMADO]: 'Confirmado',
      [STATUS_PEDIDO.PREPARANDO]: 'Preparando',
      [STATUS_PEDIDO.PRONTO]: 'Pronto',
      [STATUS_PEDIDO.ENTREGUE]: 'Entregue',
      [STATUS_PEDIDO.CANCELADO]: 'Cancelado'
    };
    return labels[status] || status;
  },

  /**
   * Obtém cor do status de pagamento
   */
  obterCorStatusPagamento: (status) => {
    const cores = {
      [STATUS_PAGAMENTO.PENDENTE]: '#ffc107',
      [STATUS_PAGAMENTO.PAGO]: '#28a745',
      [STATUS_PAGAMENTO.CANCELADO]: '#dc3545'
    };
    return cores[status] || '#6c757d';
  },

  /**
   * Verifica se pedido pode ser cancelado
   */
  podeCancelar: (pedido) => {
    const statusCancelaveis = [STATUS_PEDIDO.PENDENTE, STATUS_PEDIDO.CONFIRMADO];
    return statusCancelaveis.includes(pedido.status);
  },

  /**
   * Verifica se pedido pode ser pago
   */
  podePagar: (pedido) => {
    return pedido.status === STATUS_PEDIDO.PENDENTE && 
           pedido.statusPagamento === STATUS_PAGAMENTO.PENDENTE;
  },

  /**
   * Verifica se pedido pode ser avaliado
   */
  podeAvaliar: (pedido) => {
    return pedido.status === STATUS_PEDIDO.ENTREGUE && !pedido.feedback;
  },

  /**
   * Obtém próximo status possível para empresa
   */
  obterProximosStatus: (statusAtual) => {
    const fluxo = {
      [STATUS_PEDIDO.PENDENTE]: [STATUS_PEDIDO.CONFIRMADO, STATUS_PEDIDO.CANCELADO],
      [STATUS_PEDIDO.CONFIRMADO]: [STATUS_PEDIDO.PREPARANDO, STATUS_PEDIDO.CANCELADO],
      [STATUS_PEDIDO.PREPARANDO]: [STATUS_PEDIDO.PRONTO],
      [STATUS_PEDIDO.PRONTO]: [STATUS_PEDIDO.ENTREGUE],
      [STATUS_PEDIDO.ENTREGUE]: [],
      [STATUS_PEDIDO.CANCELADO]: []
    };
    return fluxo[statusAtual] || [];
  },

  /**
   * Calcula tempo estimado de entrega
   */
  calcularTempoEstimado: (status) => {
    const tempos = {
      [STATUS_PEDIDO.PENDENTE]: '5-10 min',
      [STATUS_PEDIDO.CONFIRMADO]: '20-30 min',
      [STATUS_PEDIDO.PREPARANDO]: '15-25 min',
      [STATUS_PEDIDO.PRONTO]: '5-15 min',
      [STATUS_PEDIDO.ENTREGUE]: 'Entregue',
      [STATUS_PEDIDO.CANCELADO]: 'Cancelado'
    };
    return tempos[status] || 'Não disponível';
  },

  /**
   * Filtra pedidos por status
   */
  filtrarPorStatus: (pedidos, status) => {
    if (!status || status === 'todos') return pedidos;
    return pedidos.filter(pedido => pedido.status === status);
  },

  /**
   * Filtra pedidos por período
   */
  filtrarPorPeriodo: (pedidos, dataInicio, dataFim) => {
    if (!dataInicio && !dataFim) return pedidos;
    
    return pedidos.filter(pedido => {
      const dataPedido = new Date(pedido.dataPedido);
      
      if (dataInicio && dataPedido < new Date(dataInicio)) return false;
      if (dataFim && dataPedido > new Date(dataFim)) return false;
      
      return true;
    });
  },

  /**
   * Ordena pedidos
   */
  ordenarPedidos: (pedidos, criterio = 'data', direcao = 'desc') => {
    return [...pedidos].sort((a, b) => {
      let valorA, valorB;

      switch (criterio) {
        case 'data':
          valorA = new Date(a.dataPedido);
          valorB = new Date(b.dataPedido);
          break;
        case 'valor':
          valorA = a.total;
          valorB = b.total;
          break;
        case 'status':
          valorA = a.status;
          valorB = b.status;
          break;
        case 'empresa':
          valorA = a.nomeEmpresa?.toLowerCase() || '';
          valorB = b.nomeEmpresa?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
      return 0;
    });
  },

  /**
   * Agrupa pedidos por status
   */
  agruparPorStatus: (pedidos) => {
    return pedidos.reduce((grupos, pedido) => {
      const status = pedido.status;
      if (!grupos[status]) {
        grupos[status] = [];
      }
      grupos[status].push(pedido);
      return grupos;
    }, {});
  },

  /**
   * Calcula estatísticas básicas
   */
  calcularEstatisticas: (pedidos) => {
    const total = pedidos.length;
    const totalValor = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);
    const valorMedio = total > 0 ? totalValor / total : 0;

    const porStatus = pedidos.reduce((acc, pedido) => {
      acc[pedido.status] = (acc[pedido.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      totalValor,
      valorMedio,
      porStatus
    };
  },

  /**
   * Formata data do pedido
   */
  formatarData: (data) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data));
  },

  /**
   * Calcula tempo decorrido desde o pedido
   */
  calcularTempoDecorrido: (dataPedido) => {
    const agora = new Date();
    const pedido = new Date(dataPedido);
    const diffMs = agora - pedido;
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMinutos / 60);

    if (diffMinutos < 60) {
      return `${diffMinutos} min atrás`;
    } else if (diffHoras < 24) {
      return `${diffHoras}h atrás`;
    } else {
      const diffDias = Math.floor(diffHoras / 24);
      return `${diffDias} dia${diffDias > 1 ? 's' : ''} atrás`;
    }
  },

  /**
   * Valida dados do pedido antes do envio
   */
  validarPedido: (dadosPedido) => {
    const erros = {};

    if (!dadosPedido.empresaId) {
      erros.empresaId = 'Empresa é obrigatória';
    }

    if (!dadosPedido.formaPagamento) {
      erros.formaPagamento = 'Forma de pagamento é obrigatória';
    }

    if (!dadosPedido.enderecoEntrega || dadosPedido.enderecoEntrega.trim().length < 10) {
      erros.enderecoEntrega = 'Endereço de entrega deve ter pelo menos 10 caracteres';
    }

    if (!dadosPedido.itens || dadosPedido.itens.length === 0) {
      erros.itens = 'Pedido deve ter pelo menos um item';
    }

    // Validar itens individualmente
    if (dadosPedido.itens) {
      dadosPedido.itens.forEach((item, index) => {
        if (!item.produtoId) {
          erros[`item_${index}_produto`] = 'Produto é obrigatório';
        }
        if (!item.quantidade || item.quantidade <= 0) {
          erros[`item_${index}_quantidade`] = 'Quantidade deve ser maior que zero';
        }
        if (!item.precoUnitario || item.precoUnitario <= 0) {
          erros[`item_${index}_preco`] = 'Preço unitário deve ser maior que zero';
        }
      });
    }

    return {
      isValid: Object.keys(erros).length === 0,
      erros
    };
  },

  /**
   * Gera resumo do pedido para exibição
   */
  gerarResumo: (pedido) => {
    const totalItens = pedido.itens?.length || 0;
    const quantidadeTotal = pedido.itens?.reduce((sum, item) => sum + item.quantidade, 0) || 0;
    
    return {
      id: pedido.id,
      nomeEmpresa: pedido.nomeEmpresa,
      status: pedidoHelpers.obterLabelStatus(pedido.status),
      corStatus: pedidoHelpers.obterCorStatus(pedido.status),
      total: pedidoHelpers.formatarValor(pedido.total),
      totalItens,
      quantidadeTotal,
      dataFormatada: pedidoHelpers.formatarData(pedido.dataPedido),
      tempoDecorrido: pedidoHelpers.calcularTempoDecorrido(pedido.dataPedido),
      podeCancelar: pedidoHelpers.podeCancelar(pedido),
      podePagar: pedidoHelpers.podePagar(pedido),
      podeAvaliar: pedidoHelpers.podeAvaliar(pedido)
    };
  },

  /**
   * Obtém ícone do status do pedido
   */
  obterIconeStatus: (status) => {
    const icones = {
      [STATUS_PEDIDO.PENDENTE]: '⏱️',
      [STATUS_PEDIDO.CONFIRMADO]: '✅',
      [STATUS_PEDIDO.PREPARANDO]: '👨‍🍳',
      [STATUS_PEDIDO.PRONTO]: '📦',
      [STATUS_PEDIDO.ENTREGUE]: '🚚',
      [STATUS_PEDIDO.CANCELADO]: '❌'
    };
    return icones[status] || '📋';
  },

  /**
   * Obtém progresso do pedido (0-100)
   */
  obterProgresso: (status) => {
    const progressos = {
      [STATUS_PEDIDO.PENDENTE]: 10,
      [STATUS_PEDIDO.CONFIRMADO]: 25,
      [STATUS_PEDIDO.PREPARANDO]: 50,
      [STATUS_PEDIDO.PRONTO]: 75,
      [STATUS_PEDIDO.ENTREGUE]: 100,
      [STATUS_PEDIDO.CANCELADO]: 0
    };
    return progressos[status] || 0;
  }
};

/**
 * Constantes para pedidos
 */
export const PEDIDO_CONSTANTS = {
  STATUS_OPTIONS: [
    { value: 'todos', label: 'Todos os status' },
    { value: STATUS_PEDIDO.PENDENTE, label: 'Pendente' },
    { value: STATUS_PEDIDO.CONFIRMADO, label: 'Confirmado' },
    { value: STATUS_PEDIDO.PREPARANDO, label: 'Preparando' },
    { value: STATUS_PEDIDO.PRONTO, label: 'Pronto' },
    { value: STATUS_PEDIDO.ENTREGUE, label: 'Entregue' },
    { value: STATUS_PEDIDO.CANCELADO, label: 'Cancelado' }
  ],

  ORDENACAO_OPTIONS: [
    { value: 'data', label: 'Data do pedido' },
    { value: 'valor', label: 'Valor' },
    { value: 'status', label: 'Status' },
    { value: 'empresa', label: 'Empresa' }
  ],

  PERIODO_OPTIONS: [
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Esta semana' },
    { value: 'mes', label: 'Este mês' },
    { value: 'trimestre', label: 'Este trimestre' },
    { value: 'ano', label: 'Este ano' },
    { value: 'custom', label: 'Período personalizado' }
  ]
};

export default pedidoApi;