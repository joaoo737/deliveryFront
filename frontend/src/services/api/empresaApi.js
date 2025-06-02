import { api } from '../httpClient';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * API de empresa
 */
export const empresaApi = {
  /**
   * Obtém perfil da empresa
   */
  getPerfil: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.PERFIL);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém relatório da empresa
   */
  getRelatorio: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.RELATORIOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista pedidos da empresa
   */
  getPedidos: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.PEDIDOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza status do pedido
   */
  atualizarStatusPedido: async (pedidoId, status) => {
    try {
      const response = await api.patch(
        `${API_ENDPOINTS.EMPRESA.PEDIDOS}/${pedidoId}/status`,
        null,
        { params: { status } }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista produtos da empresa
   */
  getProdutos: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.PRODUTOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista produtos paginados
   */
  getProdutosPaginado: async (params = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/paginado`, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca produto por ID
   */
  getProduto: async (produtoId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cria novo produto
   */
  criarProduto: async (dadosProduto) => {
    try {
      const response = await api.post(API_ENDPOINTS.EMPRESA.PRODUTOS, dadosProduto);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza produto
   */
  atualizarProduto: async (produtoId, dadosProduto) => {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}`,
        dadosProduto
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Remove produto
   */
  deletarProduto: async (produtoId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Ativa produto
   */
  ativarProduto: async (produtoId) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}/ativar`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Desativa produto
   */
  desativarProduto: async (produtoId) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}/desativar`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza estoque do produto
   */
  atualizarEstoque: async (produtoId, novoEstoque) => {
    try {
      const response = await api.patch(
        `${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}/estoque`,
        { estoque: novoEstoque }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém estatísticas dos produtos
   */
  getEstatisticasProdutos: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/estatisticas`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista produtos com baixo estoque
   */
  getProdutosBaixoEstoque: async (limite = 10) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.EMPRESA.PRODUTOS}/baixo-estoque`,
        { limite }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista feedbacks da empresa
   */
  getFeedbacks: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.FEEDBACKS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém estatísticas de feedbacks
   */
  getEstatisticasFeedbacks: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.FEEDBACKS}/estatisticas`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Relatórios específicos
  relatorios: {
    /**
     * Relatório mensal
     */
    getMensal: async (mes, ano) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/mensal`, { mes, ano });
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Relatório anual
     */
    getAnual: async (ano) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/anual`, { ano });
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Relatório por período
     */
    getPorPeriodo: async (dataInicio, dataFim) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/periodo`, {
          dataInicio,
          dataFim
        });
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Relatório de vendas
     */
    getVendas: async (mes, ano) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/vendas`, { mes, ano });
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Produtos mais vendidos
     */
    getProdutosMaisVendidos: async (mes, ano, limite = 10) => {
      try {
        const response = await api.get(
          `${API_ENDPOINTS.EMPRESA.RELATORIOS}/produtos-mais-vendidos`,
          { mes, ano, limite }
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Clientes frequentes
     */
    getClientesFrequentes: async (mes, ano, limite = 10) => {
      try {
        const response = await api.get(
          `${API_ENDPOINTS.EMPRESA.RELATORIOS}/clientes-frequentes`,
          { mes, ano, limite }
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Dashboard
     */
    getDashboard: async () => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/dashboard`);
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Relatório comparativo
     */
    getComparativo: async (mesAtual, anoAtual) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/comparativo`, {
          mesAtual,
          anoAtual
        });
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Exportar relatório PDF
     */
    exportarPDF: async (mes, ano) => {
      try {
        const response = await api.download(
          `${API_ENDPOINTS.EMPRESA.RELATORIOS}/exportar/pdf`,
          `relatorio-${mes}-${ano}.pdf`,
          { mes, ano }
        );
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
};

/**
 * Helpers para empresa
 */
export const empresaHelpers = {
  /**
   * Formata dados do produto para envio
   */
  formatarProdutoParaEnvio: (dados) => {
    return {
      nome: dados.nome?.trim(),
      descricao: dados.descricao?.trim() || null,
      preco: parseFloat(dados.preco),
      imagemUrl: dados.imagemUrl?.trim() || null,
      estoque: parseInt(dados.estoque) || 0,
      ativo: Boolean(dados.ativo),
      categoria: dados.categoria ? {
        id: parseInt(dados.categoria.id)
      } : null
    };
  },

  /**
   * Calcula estatísticas de produtos
   */
  calcularEstatisticasProdutos: (produtos) => {
    const total = produtos.length;
    const ativos = produtos.filter(p => p.ativo).length;
    const inativos = total - ativos;
    const baixoEstoque = produtos.filter(p => p.estoque < 10).length;
    const semEstoque = produtos.filter(p => p.estoque === 0).length;

    return {
      total,
      ativos,
      inativos,
      baixoEstoque,
      semEstoque,
      percentualAtivos: total > 0 ? (ativos / total) * 100 : 0
    };
  },

  /**
   * Formata valor monetário para relatórios
   */
  formatarValorRelatorio: (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  },

  /**
   * Calcula variação percentual
   */
  calcularVariacaoPercentual: (valorAtual, valorAnterior) => {
    if (!valorAnterior || valorAnterior === 0) return 0;
    return ((valorAtual - valorAnterior) / valorAnterior) * 100;
  },

  /**
   * Gera cores para gráficos
   */
  gerarCoresGrafico: (quantidade) => {
    const cores = [
      '#FF4621', '#e63e1a', '#ff6542', '#cc3617',
      '#28a745', '#17a2b8', '#ffc107', '#dc3545',
      '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'
    ];
    
    return Array.from({ length: quantidade }, (_, i) => 
      cores[i % cores.length]
    );
  },

  /**
   * Formata dados para gráfico de vendas
   */
  formatarDadosGraficoVendas: (dados) => {
    return dados.map(item => ({
      name: item.periodo,
      vendas: item.vendas,
      pedidos: item.pedidos
    }));
  },

  /**
   * Valida dados do produto
   */
  validarProduto: (dados) => {
    const erros = {};

    if (!dados.nome || dados.nome.trim().length < 2) {
      erros.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!dados.preco || isNaN(parseFloat(dados.preco)) || parseFloat(dados.preco) <= 0) {
      erros.preco = 'Preço deve ser um valor válido maior que zero';
    }

    if (dados.estoque !== undefined && (isNaN(parseInt(dados.estoque)) || parseInt(dados.estoque) < 0)) {
      erros.estoque = 'Estoque deve ser um número maior ou igual a zero';
    }

    return {
      isValid: Object.keys(erros).length === 0,
      erros
    };
  },

  /**
   * Filtra produtos por status
   */
  filtrarProdutosPorStatus: (produtos, status) => {
    switch (status) {
      case 'ativos':
        return produtos.filter(p => p.ativo);
      case 'inativos':
        return produtos.filter(p => !p.ativo);
      case 'baixo-estoque':
        return produtos.filter(p => p.estoque < 10);
      case 'sem-estoque':
        return produtos.filter(p => p.estoque === 0);
      default:
        return produtos;
    }
  }
};

export default empresaApi;