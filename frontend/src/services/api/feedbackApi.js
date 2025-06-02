import { api } from '../httpClient';
import { API_ENDPOINTS } from '../../utils/constants';

/**
 * API de feedbacks
 */
export const feedbackApi = {
  /**
   * Cria feedback para pedido (cliente)
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
  },

  /**
   * Lista feedbacks da empresa (empresa)
   */
  listarFeedbacksEmpresa: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.EMPRESA.FEEDBACKS, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém estatísticas de feedbacks (empresa)
   */
  obterEstatisticasEmpresa: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.EMPRESA.FEEDBACKS}/estatisticas`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

/**
 * Hooks para feedbacks
 */
export const feedbackHooks = {
  /**
   * Hook para feedbacks da empresa
   */
  useFeedbacksEmpresa: (filtros = {}) => {
    const [feedbacks, setFeedbacks] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [pagination, setPagination] = React.useState(null);

    const carregarFeedbacks = async (novosFiltros = {}) => {
      try {
        setLoading(true);
        setError(null);
        
        const filtrosCompletos = { ...filtros, ...novosFiltros };
        const response = await feedbackApi.listarFeedbacksEmpresa(filtrosCompletos);
        
        setFeedbacks(response.content || response);
        setPagination(response.pagination || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      carregarFeedbacks();
    }, [JSON.stringify(filtros)]);

    return {
      feedbacks,
      loading,
      error,
      pagination,
      carregarFeedbacks
    };
  },

  /**
   * Hook para estatísticas de feedbacks
   */
  useEstatisticasFeedbacks: () => {
    const [estatisticas, setEstatisticas] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const carregarEstatisticas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await feedbackApi.obterEstatisticasEmpresa();
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
  },

  /**
   * Hook para criar feedback
   */
  useCreateFeedback: () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const criarFeedback = async (pedidoId, dadosFeedback) => {
      try {
        setLoading(true);
        setError(null);
        const response = await feedbackApi.criarFeedback(pedidoId, dadosFeedback);
        return response;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    return {
      criarFeedback,
      loading,
      error
    };
  }
};

/**
 * Helpers para feedbacks
 */
export const feedbackHelpers = {
  /**
   * Formata dados do feedback para envio
   */
  formatarFeedbackParaEnvio: (dados) => {
    return {
      nota: parseInt(dados.nota),
      comentario: dados.comentario?.trim() || null
    };
  },

  /**
   * Valida dados do feedback
   */
  validarFeedback: (dados) => {
    const erros = {};

    if (!dados.nota || dados.nota < 1 || dados.nota > 5) {
      erros.nota = 'Nota deve ser entre 1 e 5';
    }

    if (dados.comentario && dados.comentario.length > 500) {
      erros.comentario = 'Comentário deve ter no máximo 500 caracteres';
    }

    return {
      isValid: Object.keys(erros).length === 0,
      erros
    };
  },

  /**
   * Formata nota com estrelas
   */
  formatarEstrelas: (nota) => {
    const estrelaCheia = '★';
    const estrelaVazia = '☆';
    
    let resultado = '';
    for (let i = 1; i <= 5; i++) {
      resultado += i <= nota ? estrelaCheia : estrelaVazia;
    }
    return resultado;
  },

  /**
   * Obtém cor da nota
   */
  obterCorNota: (nota) => {
    if (nota >= 4) return '#28a745'; // Verde
    if (nota >= 3) return '#ffc107'; // Amarelo
    if (nota >= 2) return '#fd7e14'; // Laranja
    return '#dc3545'; // Vermelho
  },

  /**
   * Obtém descrição da nota
   */
  obterDescricaoNota: (nota) => {
    const descricoes = {
      1: 'Muito ruim',
      2: 'Ruim',
      3: 'Regular',
      4: 'Bom',
      5: 'Excelente'
    };
    return descricoes[nota] || 'Não avaliado';
  },

  /**
   * Calcula estatísticas de feedbacks
   */
  calcularEstatisticas: (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) {
      return {
        total: 0,
        notaMedia: 0,
        distribuicao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        percentualPositivos: 0,
        comentarios: 0
      };
    }

    const total = feedbacks.length;
    const somaNotas = feedbacks.reduce((sum, feedback) => sum + feedback.nota, 0);
    const notaMedia = somaNotas / total;

    const distribuicao = feedbacks.reduce((acc, feedback) => {
      acc[feedback.nota] = (acc[feedback.nota] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    const positivos = feedbacks.filter(f => f.nota >= 4).length;
    const percentualPositivos = (positivos / total) * 100;

    const comentarios = feedbacks.filter(f => f.comentario && f.comentario.trim()).length;

    return {
      total,
      notaMedia: parseFloat(notaMedia.toFixed(1)),
      distribuicao,
      percentualPositivos: parseFloat(percentualPositivos.toFixed(1)),
      comentarios
    };
  },

  /**
   * Filtra feedbacks por nota
   */
  filtrarPorNota: (feedbacks, notaMinima = 1, notaMaxima = 5) => {
    return feedbacks.filter(feedback => 
      feedback.nota >= notaMinima && feedback.nota <= notaMaxima
    );
  },

  /**
   * Filtra feedbacks com comentários
   */
  filtrarComComentarios: (feedbacks) => {
    return feedbacks.filter(feedback => 
      feedback.comentario && feedback.comentario.trim()
    );
  },

  /**
   * Ordena feedbacks
   */
  ordenarFeedbacks: (feedbacks, criterio = 'data', direcao = 'desc') => {
    return [...feedbacks].sort((a, b) => {
      let valorA, valorB;

      switch (criterio) {
        case 'data':
          valorA = new Date(a.dataFeedback);
          valorB = new Date(b.dataFeedback);
          break;
        case 'nota':
          valorA = a.nota;
          valorB = b.nota;
          break;
        case 'cliente':
          valorA = a.nomeCliente?.toLowerCase() || '';
          valorB = b.nomeCliente?.toLowerCase() || '';
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
   * Agrupa feedbacks por nota
   */
  agruparPorNota: (feedbacks) => {
    return feedbacks.reduce((grupos, feedback) => {
      const nota = feedback.nota;
      if (!grupos[nota]) {
        grupos[nota] = [];
      }
      grupos[nota].push(feedback);
      return grupos;
    }, {});
  },

  /**
   * Busca feedbacks por texto
   */
  buscarPorTexto: (feedbacks, texto) => {
    if (!texto) return feedbacks;
    
    const termoLower = texto.toLowerCase();
    return feedbacks.filter(feedback => 
      feedback.nomeCliente?.toLowerCase().includes(termoLower) ||
      feedback.comentario?.toLowerCase().includes(termoLower)
    );
  },

  /**
   * Formata data do feedback
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
   * Formata tempo relativo
   */
  formatarTempoRelativo: (data) => {
    const agora = new Date();
    const feedback = new Date(data);
    const diffMs = agora - feedback;
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMinutos < 60) {
      return `${diffMinutos} min atrás`;
    } else if (diffHoras < 24) {
      return `${diffHoras}h atrás`;
    } else if (diffDias < 30) {
      return `${diffDias} dia${diffDias > 1 ? 's' : ''} atrás`;
    } else {
      return feedbackHelpers.formatarData(data);
    }
  },

  /**
   * Gera resumo do feedback
   */
  gerarResumo: (feedback) => {
    return {
      id: feedback.id,
      nomeCliente: feedback.nomeCliente,
      nota: feedback.nota,
      estrelas: feedbackHelpers.formatarEstrelas(feedback.nota),
      corNota: feedbackHelpers.obterCorNota(feedback.nota),
      descricaoNota: feedbackHelpers.obterDescricaoNota(feedback.nota),
      comentario: feedback.comentario,
      temComentario: Boolean(feedback.comentario && feedback.comentario.trim()),
      dataFormatada: feedbackHelpers.formatarData(feedback.dataFeedback),
      tempoRelativo: feedbackHelpers.formatarTempoRelativo(feedback.dataFeedback),
      pedidoId: feedback.pedidoId
    };
  },

  /**
   * Calcula distribuição percentual das notas
   */
  calcularDistribuicaoPercentual: (feedbacks) => {
    const estatisticas = feedbackHelpers.calcularEstatisticas(feedbacks);
    const total = estatisticas.total;
    
    if (total === 0) {
      return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }

    const distribuicaoPercentual = {};
    for (let nota = 1; nota <= 5; nota++) {
      distribuicaoPercentual[nota] = ((estatisticas.distribuicao[nota] || 0) / total) * 100;
    }

    return distribuicaoPercentual;
  },

  /**
   * Obtém feedbacks recentes
   */
  obterRecentes: (feedbacks, limite = 5) => {
    return feedbackHelpers.ordenarFeedbacks(feedbacks, 'data', 'desc').slice(0, limite);
  },

  /**
   * Obtém feedbacks destacados (notas altas com comentários)
   */
  obterDestacados: (feedbacks, limite = 3) => {
    return feedbacks
      .filter(f => f.nota >= 4 && f.comentario && f.comentario.trim())
      .sort((a, b) => b.nota - a.nota)
      .slice(0, limite);
  }
};

/**
 * Constantes para feedbacks
 */
export const FEEDBACK_CONSTANTS = {
  NOTAS: [
    { value: 1, label: 'Muito ruim', emoji: '😞' },
    { value: 2, label: 'Ruim', emoji: '😕' },
    { value: 3, label: 'Regular', emoji: '😐' },
    { value: 4, label: 'Bom', emoji: '😊' },
    { value: 5, label: 'Excelente', emoji: '😍' }
  ],

  FILTROS_NOTA: [
    { value: 'todos', label: 'Todas as notas' },
    { value: '5', label: '5 estrelas' },
    { value: '4', label: '4 estrelas' },
    { value: '3', label: '3 estrelas' },
    { value: '2', label: '2 estrelas' },
    { value: '1', label: '1 estrela' },
    { value: 'positivos', label: 'Positivos (4-5)' },
    { value: 'negativos', label: 'Negativos (1-2)' }
  ],

  ORDENACAO_OPTIONS: [
    { value: 'data', label: 'Data' },
    { value: 'nota', label: 'Nota' },
    { value: 'cliente', label: 'Cliente' }
  ]
};

export default feedbackApi;