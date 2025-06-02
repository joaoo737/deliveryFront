import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { useDebounce } from '../../../hooks/useDebounce';
import './FilterPanel.css';

const FilterPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoria: searchParams.get('categoria') || '',
    orderBy: searchParams.get('orderBy') || 'relevancia',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedPrice = useDebounce({
    min: filters.minPrice,
    max: filters.maxPrice
  }, 500);

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    updateQueryParams();
  }, [debouncedSearch, filters.categoria, filters.orderBy, debouncedPrice]);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.PUBLICO.CATEGORIAS);
      setCategorias(response);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateQueryParams = () => {
    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.categoria) params.set('categoria', filters.categoria);
    if (filters.orderBy) params.set('orderBy', filters.orderBy);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categoria: '',
      orderBy: 'relevancia',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Buscar produtos..."
          className="search-input"
        />
      </div>

      <div className="filter-section">
        <label>Categoria</label>
        <select
          name="categoria"
          value={filters.categoria}
          onChange={handleInputChange}
          className="select-input"
          disabled={loading}
        >
          <option value="">Todas as categorias</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Ordenar por</label>
        <select
          name="orderBy"
          value={filters.orderBy}
          onChange={handleInputChange}
          className="select-input"
        >
          <option value="relevancia">Relevância</option>
          <option value="menor-preco">Menor Preço</option>
          <option value="maior-preco">Maior Preço</option>
          <option value="mais-vendidos">Mais Vendidos</option>
          <option value="avaliacoes">Melhores Avaliações</option>
        </select>
      </div>

      <div className="filter-section price-range">
        <label>Faixa de Preço</label>
        <div className="price-inputs">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="Min"
            className="price-input"
            min="0"
          />
          <span>até</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="Max"
            className="price-input"
            min="0"
          />
        </div>
      </div>

      <button 
        className="clear-filters"
        onClick={handleClearFilters}
      >
        Limpar Filtros
      </button>
    </div>
  );
};

export default FilterPanel;
