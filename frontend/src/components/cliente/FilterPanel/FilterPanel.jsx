import React, { useState, useEffect } from 'react';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';
import './FilterPanel.css';

const FilterPanel = ({ 
  filters = {}, 
  onFiltersChange, 
  onClose, 
  isMobile = false,
  loading = false 
}) => {
  const [localFilters, setLocalFilters] = useState({
    categorias: [],
    precoMin: '',
    precoMax: '',
    ordenarPor: 'nome',
    apenasDisponiveis: true,
    avaliacaoMinima: 0,
    ...filters
  });

  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      ...filters
    }));
  }, [filters]);

  const carregarCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const response = await api.get(API_ENDPOINTS.PUBLICO.CATEGORIAS);
      setCategorias(response);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const handleCategoriaChange = (categoriaId) => {
    setLocalFilters(prev => {
      const categorias = prev.categorias.includes(categoriaId)
        ? prev.categorias.filter(id => id !== categoriaId)
        : [...prev.categorias, categoriaId];
      
      return { ...prev, categorias };
    });
  };

  const handlePrecoChange = (field, value) => {
    // Permitir apenas números e vírgula/ponto
    const cleanValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
    
    setLocalFilters(prev => ({
      ...prev,
      [field]: cleanValue
    }));
  };

  const handleSortChange = (ordenarPor) => {
    setLocalFilters(prev => ({
      ...prev,
      ordenarPor
    }));
  };

  const handleAvailabilityChange = (apenasDisponiveis) => {
    setLocalFilters(prev => ({
      ...prev,
      apenasDisponiveis
    }));
  };

  const handleRatingChange = (avaliacaoMinima) => {
    setLocalFilters(prev => ({
      ...prev,
      avaliacaoMinima
    }));
  };

  const handleApplyFilters = () => {
    // Converter preços para números
    const processedFilters = {
      ...localFilters,
      precoMin: localFilters.precoMin ? parseFloat(localFilters.precoMin) : undefined,
      precoMax: localFilters.precoMax ? parseFloat(localFilters.precoMax) : undefined
    };

    onFiltersChange(processedFilters);
    
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      categorias: [],
      precoMin: '',
      precoMax: '',
      ordenarPor: 'nome',
      apenasDisponiveis: true,
      avaliacaoMinima: 0
    };
    
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = () => {
    return (
      localFilters.categorias.length > 0 ||
      localFilters.precoMin ||
      localFilters.precoMax ||
      localFilters.ordenarPor !== 'nome' ||
      !localFilters.apenasDisponiveis ||
      localFilters.avaliacaoMinima > 0
    );
  };

  const getActiveFiltersLabels = () => {
    const labels = [];
    
    // Categorias selecionadas
    localFilters.categorias.forEach(categoriaId => {
      const categoria = categorias.find(c => c.id === categoriaId);
      if (categoria) {
        labels.push({
          type: 'categoria',
          id: categoriaId,
          label: categoria.nome
        });
      }
    });
    
    // Preço mínimo
    if (localFilters.precoMin) {
      labels.push({
        type: 'precoMin',
        label: `Min: ${formatCurrency(localFilters.precoMin)}`
      });
    }
    
    // Preço máximo
    if (localFilters.precoMax) {
      labels.push({
        type: 'precoMax',
        label: `Max: ${formatCurrency(localFilters.precoMax)}`
      });
    }
    
    // Ordenação
    if (localFilters.ordenarPor !== 'nome') {
      const sortLabels = {
        'preco_asc': 'Menor preço',
        'preco_desc': 'Maior preço',
        'avaliacao': 'Mais avaliados',
        'popularidade': 'Mais populares'
      };
      labels.push({
        type: 'ordenarPor',
        label: sortLabels[localFilters.ordenarPor] || localFilters.ordenarPor
      });
    }
    
    // Avaliação mínima
    if (localFilters.avaliacaoMinima > 0) {
      labels.push({
        type: 'avaliacaoMinima',
        label: `${localFilters.avaliacaoMinima}+ estrelas`
      });
    }
    
    return labels;
  };

  const removeActiveFilter = (filterToRemove) => {
    switch (filterToRemove.type) {
      case 'categoria':
        handleCategoriaChange(filterToRemove.id);
        break;
      case 'precoMin':
        handlePrecoChange('precoMin', '');
        break;
      case 'precoMax':
        handlePrecoChange('precoMax', '');
        break;
      case 'ordenarPor':
        handleSortChange('nome');
        break;
      case 'avaliacaoMinima':
        handleRatingChange(0);
        break;
    }
  };

  const sortOptions = [
    { value: 'nome', label: 'Nome A-Z' },
    { value: 'preco_asc', label: 'Menor preço' },
    { value: 'preco_desc', label: 'Maior preço' },
    { value: 'avaliacao', label: 'Mais avaliados' },
    { value: 'popularidade', label: 'Mais populares' }
  ];

  const ratingOptions = [
    { value: 0, label: 'Todas as avaliações', stars: '' },
    { value: 4, label: '4+ estrelas', stars: '★★★★☆' },
    { value: 3, label: '3+ estrelas', stars: '★★★☆☆' },
    { value: 2, label: '2+ estrelas', stars: '★★☆☆☆' },
    { value: 1, label: '1+ estrela', stars: '★☆☆☆☆' }
  ];

  const activeFiltersLabels = getActiveFiltersLabels();

  return (
    <div className={`filter-panel ${isMobile ? 'filter-panel--mobile' : ''}`}>
      <div className="filter-panel__header">
        <h3 className="filter-panel__title">Filtros</h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={handleResetFilters}
            className="filter-panel__clear"
            disabled={!hasActiveFilters() || loading}
          >
            Limpar
          </button>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="filter-panel__close-mobile"
              aria-label="Fechar filtros"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtros Ativos */}
      {activeFiltersLabels.length > 0 && (
        <div className="filter-panel__active-filters">
          <div className="filter-panel__active-title">Filtros ativos</div>
          <div className="filter-panel__active-list">
            {activeFiltersLabels.map((filter, index) => (
              <div key={index} className="filter-panel__active-tag">
                {filter.label}
                <button
                  onClick={() => removeActiveFilter(filter)}
                  className="filter-panel__active-tag-remove"
                  aria-label={`Remover filtro ${filter.label}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categorias */}
      <div className="filter-panel__section">
        <h4 className="filter-panel__section-title">
          <span className="filter-panel__section-icon">🏷️</span>
          Categorias
        </h4>
        <div className="filter-panel__categories">
          {loadingCategorias ? (
            <div style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              Carregando categorias...
            </div>
          ) : (
            categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="filter-panel__category"
                onClick={() => handleCategoriaChange(categoria.id)}
              >
                <div className={`filter-panel__category-checkbox ${
                  localFilters.categorias.includes(categoria.id) ? 'checked' : ''
                }`}>
                  {localFilters.categorias.includes(categoria.id) && '✓'}
                </div>
                <span className="filter-panel__category-icon">{categoria.icone}</span>
                <span className="filter-panel__category-label">{categoria.nome}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Faixa de Preço */}
      <div className="filter-panel__section">
        <h4 className="filter-panel__section-title">
          <span className="filter-panel__section-icon">💰</span>
          Faixa de Preço
        </h4>
        <div className="filter-panel__price-range">
          <div className="filter-panel__price-inputs">
            <input
              type="text"
              placeholder="Mín"
              value={localFilters.precoMin}
              onChange={(e) => handlePrecoChange('precoMin', e.target.value)}
              className="filter-panel__price-input"
            />
            <span className="filter-panel__price-separator">até</span>
            <input
              type="text"
              placeholder="Máx"
              value={localFilters.precoMax}
              onChange={(e) => handlePrecoChange('precoMax', e.target.value)}
              className="filter-panel__price-input"
            />
          </div>
        </div>
      </div>

      {/* Ordenação */}
      <div className="filter-panel__section">
        <h4 className="filter-panel__section-title">
          <span className="filter-panel__section-icon">🔢</span>
          Ordenar por
        </h4>
        <div className="filter-panel__sort">
          {sortOptions.map((option) => (
            <div
              key={option.value}
              className="filter-panel__sort-option"
              onClick={() => handleSortChange(option.value)}
            >
              <div className={`filter-panel__sort-radio ${
                localFilters.ordenarPor === option.value ? 'checked' : ''
              }`} />
              <span className="filter-panel__sort-label">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disponibilidade */}
      <div className="filter-panel__section">
        <h4 className="filter-panel__section-title">
          <span className="filter-panel__section-icon">📦</span>
          Disponibilidade
        </h4>
        <div className="filter-panel__availability">
          <div
            className="filter-panel__availability-option"
            onClick={() => handleAvailabilityChange(!localFilters.apenasDisponiveis)}
          >
            <div className={`filter-panel__switch ${
              localFilters.apenasDisponiveis ? 'checked' : ''
            }`}>
              <div className="filter-panel__switch-thumb" />
            </div>
            <span className="filter-panel__availability-label">
              Apenas produtos disponíveis
            </span>
          </div>
        </div>
      </div>

      {/* Avaliação */}
      <div className="filter-panel__section">
        <h4 className="filter-panel__section-title">
          <span className="filter-panel__section-icon">⭐</span>
          Avaliação
        </h4>
        <div className="filter-panel__rating">
          {ratingOptions.map((option) => (
            <div
              key={option.value}
              className="filter-panel__rating-option"
              onClick={() => handleRatingChange(option.value)}
            >
              <div className={`filter-panel__sort-radio ${
                localFilters.avaliacaoMinima === option.value ? 'checked' : ''
              }`} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="filter-panel__rating-text">{option.label}</span>
                {option.stars && (
                  <span className="filter-panel__rating-stars">{option.stars}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ações */}
      <div className="filter-panel__actions">
        <button
          onClick={handleApplyFilters}
          className="filter-panel__apply"
          disabled={loading}
        >
          {loading ? 'Aplicando...' : 'Aplicar Filtros'}
        </button>
        <button
          onClick={handleResetFilters}
          className="filter-panel__reset"
          disabled={!hasActiveFilters() || loading}
        >
          Resetar
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;