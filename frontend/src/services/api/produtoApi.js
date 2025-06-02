import { api } from '../httpClient';
import { API_ENDPOINTS } from '../../utils/constants';

export const produtoApi = {
  listarTodos: async (params = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/produtos`, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  buscarPorTermo: async (termo, params = {}) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/produtos/termo`, {
        termo,
        ...params
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  buscarPorCategoria: async (categoriaId, params = {}) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.PUBLICO.BUSCA}/produtos/categoria/${categoriaId}`,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  listarPorEmpresa: async (empresaId, params = {}) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.PUBLICO.BUSCA}/empresas/${empresaId}/produtos`,
        params
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  buscarPorId: async (produtoId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/produtos/${produtoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  buscarComFiltros: async (filtros = {}) => {
    try {
      const params = {
        termo: filtros.termo,
        categoriaId: filtros.categoriaId,
        empresaId: filtros.empresaId,
        precoMin: filtros.precoMin,
        precoMax: filtros.precoMax,
        ordenarPor: filtros.ordenarPor,
        direcao: filtros.direcao,
        page: filtros.page || 0,
        size: filtros.size || 20
      };

      const response = await api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/produtos`, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  buscarSimilares: async (produtoId, limite = 10) => {
    try {
      const produto = await produtoApi.buscarPorId(produtoId);
      if (produto.categoria) {
        const response = await produtoApi.buscarPorCategoria(produto.categoria.id, {
          size: limite + 1
        });
        const produtosSimilares = response.content.filter(p => p.id !== produtoId);
        return produtosSimilares.slice(0, limite);
      }
      return [];
    } catch (error) {
      throw error;
    }
  },

  buscarPopulares: async (limite = 10) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/produtos`, {
        ordenarPor: 'popularidade',
        direcao: 'desc',
        size: limite
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  buscarPromocoes: async (limite = 20) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/produtos/promocoes`, {
        size: limite
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  buscarRecentes: async (limite = 20) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/produtos`, {
        ordenarPor: 'createdAt',
        direcao: 'desc',
        size: limite
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const produtoHooks = {
  useProdutos: (filtros = {}) => {
    const [produtos, setProdutos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [pagination, setPagination] = React.useState(null);

    const carregarProdutos = async (novosFiltros = {}) => {
      try {
        setLoading(true);
        setError(null);
        
        const filtrosCompletos = { ...filtros, ...novosFiltros };
        const response = await produtoApi.buscarComFiltros(filtrosCompletos);
        
        setProdutos(response.content || response);
        setPagination(response.pagination || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      carregarProdutos();
    }, [JSON.stringify(filtros)]);

    return {
      produtos,
      loading,
      error,
      pagination,
      carregarProdutos
    };
  },

  useProduto: (produtoId) => {
    const [produto, setProduto] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const carregarProduto = async () => {
      if (!produtoId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await produtoApi.buscarPorId(produtoId);
        setProduto(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      carregarProduto();
    }, [produtoId]);

    return {
      produto,
      loading,
      error,
      carregarProduto
    };
  },

  useProdutosSimilares: (produtoId, limite = 10) => {
    const [produtos, setProdutos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const carregarProdutosSimilares = async () => {
      if (!produtoId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await produtoApi.buscarSimilares(produtoId, limite);
        setProdutos(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      carregarProdutosSimilares();
    }, [produtoId, limite]);

    return {
      produtos,
      loading,
      error,
      carregarProdutosSimilares
    };
  },

  useBuscaProdutos: (termo = '', debounceTime = 500) => {
    const [resultados, setResultados] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [termoBusca, setTermoBusca] = React.useState(termo);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setTermoBusca(termo);
      }, debounceTime);

      return () => clearTimeout(timer);
    }, [termo, debounceTime]);

    const buscar = async (termoPesquisa = termoBusca) => {
      if (!termoPesquisa || termoPesquisa.length < 2) {
        setResultados([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await produtoApi.buscarPorTermo(termoPesquisa);
        setResultados(response.content || response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      buscar();
    }, [termoBusca]);

    return {
      resultados,
      loading,
      error,
      buscar
    };
  }
};

export const produtoHelpers = {

  formatarPreco: (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco || 0);
  },

  calcularDesconto: (precoOriginal, precoPromocional) => {
    if (!precoOriginal || !precoPromocional) return 0;
    return Math.round(((precoOriginal - precoPromocional) / precoOriginal) * 100);
  },

  estaEmPromocao: (produto) => {
    return produto.precoPromocional && produto.precoPromocional < produto.preco;
  },

  obterPrecoFinal: (produto) => {
    return produtoHelpers.estaEmPromocao(produto) ? produto.precoPromocional : produto.preco;
  },

  estaDisponivel: (produto) => {
    return produto.ativo && produto.estoque > 0;
  },

  obterStatusEstoque: (produto) => {
    if (!produto.ativo) return 'inativo';
    if (produto.estoque === 0) return 'sem-estoque';
    if (produto.estoque < 10) return 'baixo-estoque';
    return 'disponivel';
  },

  obterCorStatusEstoque: (status) => {
    const cores = {
      'disponivel': '#28a745',
      'baixo-estoque': '#ffc107',
      'sem-estoque': '#dc3545',
      'inativo': '#6c757d'
    };
    return cores[status] || '#6c757d';
  },

  filtrarPorDisponibilidade: (produtos, apenasDisponiveis = true) => {
    if (!apenasDisponiveis) return produtos;
    return produtos.filter(produto => produtoHelpers.estaDisponivel(produto));
  },

  ordenarProdutos: (produtos, criterio = 'nome', direcao = 'asc') => {
    return [...produtos].sort((a, b) => {
      let valorA, valorB;

      switch (criterio) {
        case 'nome':
          valorA = a.nome?.toLowerCase() || '';
          valorB = b.nome?.toLowerCase() || '';
          break;
        case 'preco':
          valorA = produtoHelpers.obterPrecoFinal(a);
          valorB = produtoHelpers.obterPrecoFinal(b);
          break;
        case 'estoque':
          valorA = a.estoque || 0;
          valorB = b.estoque || 0;
          break;
        case 'data':
          valorA = new Date(a.createdAt || 0);
          valorB = new Date(b.createdAt || 0);
          break;
        default:
          return 0;
      }

      if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
      return 0;
    });
  },

  agruparPorCategoria: (produtos) => {
    return produtos.reduce((grupos, produto) => {
      const categoria = produto.categoria?.nome || 'Sem categoria';
      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }
      grupos[categoria].push(produto);
      return grupos;
    }, {});
  },

  calcularEstatisticasPrecos: (produtos) => {
    if (!produtos.length) return { min: 0, max: 0, media: 0 };

    const precos = produtos.map(p => produtoHelpers.obterPrecoFinal(p));
    const min = Math.min(...precos);
    const max = Math.max(...precos);
    const media = precos.reduce((sum, preco) => sum + preco, 0) / precos.length;

    return { min, max, media };
  },

  filtrarPorPreco: (produtos, precoMin = 0, precoMax = Infinity) => {
    return produtos.filter(produto => {
      const preco = produtoHelpers.obterPrecoFinal(produto);
      return preco >= precoMin && preco <= precoMax;
    });
  },

  buscarPorTexto: (produtos, texto) => {
    if (!texto) return produtos;
    
    const termoLower = texto.toLowerCase();
    return produtos.filter(produto => 
      produto.nome?.toLowerCase().includes(termoLower) ||
      produto.descricao?.toLowerCase().includes(termoLower) ||
      produto.categoria?.nome?.toLowerCase().includes(termoLower)
    );
  },

  validarProduto: (produto) => {
    const erros = {};

    if (!produto.nome || produto.nome.trim().length < 2) {
      erros.nome = 'Nome é obrigatório e deve ter pelo menos 2 caracteres';
    }

    if (!produto.preco || produto.preco <= 0) {
      erros.preco = 'Preço deve ser maior que zero';
    }

    if (produto.estoque < 0) {
      erros.estoque = 'Estoque não pode ser negativo';
    }

    return {
      isValid: Object.keys(erros).length === 0,
      erros
    };
  }
};

export default produtoApi;