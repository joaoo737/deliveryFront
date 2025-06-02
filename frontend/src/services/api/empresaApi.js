import { api } from '../httpClient';
import { API_ENDPOINTS } from '../../utils/constants';

export const empresaApi = {

  getPerfil: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.PERFIL);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getRelatorio: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.RELATORIOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPedidos: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.PEDIDOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

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

  getProdutos: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.PRODUTOS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProdutosPaginado: async (params = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/paginado`, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProduto: async (produtoId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  criarProduto: async (dadosProduto) => {
    try {
      const response = await api.post(API_ENDPOINTS.EMPRESA.PRODUTOS, dadosProduto);
      return response;
    } catch (error) {
      throw error;
    }
  },

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

  deletarProduto: async (produtoId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  ativarProduto: async (produtoId) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}/ativar`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  desativarProduto: async (produtoId) => {
    try {
      const response = await api.patch(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${produtoId}/desativar`);
      return response;
    } catch (error) {
      throw error;
    }
  },

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

  getEstatisticasProdutos: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/estatisticas`);
      return response;
    } catch (error) {
      throw error;
    }
  },

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

  getFeedbacks: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.FEEDBACKS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getEstatisticasFeedbacks: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.FEEDBACKS}/estatisticas`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  relatorios: {
    getMensal: async (mes, ano) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/mensal`, { mes, ano });
        return response;
      } catch (error) {
        throw error;
      }
    },

    getAnual: async (ano) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/anual`, { ano });
        return response;
      } catch (error) {
        throw error;
      }
    },

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

    getVendas: async (mes, ano) => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/vendas`, { mes, ano });
        return response;
      } catch (error) {
        throw error;
      }
    },

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

    getDashboard: async () => {
      try {
        const response = await api.get(`${API_ENDPOINTS.EMPRESA.RELATORIOS}/dashboard`);
        return response;
      } catch (error) {
        throw error;
      }
    },

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

export const empresaHelpers = {
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

  formatarValorRelatorio: (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  },

  calcularVariacaoPercentual: (valorAtual, valorAnterior) => {
    if (!valorAnterior || valorAnterior === 0) return 0;
    return ((valorAtual - valorAnterior) / valorAnterior) * 100;
  },

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

  formatarDadosGraficoVendas: (dados) => {
    return dados.map(item => ({
      name: item.periodo,
      vendas: item.vendas,
      pedidos: item.pedidos
    }));
  },

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