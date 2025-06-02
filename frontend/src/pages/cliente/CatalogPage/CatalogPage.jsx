import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { SearchBar } from '../../../components/cliente/SearchBar';
import { FilterPanel } from '../../../components/cliente/FilterPanel';
import { RestaurantCard } from '../../../components/cliente/RestaurantCard';
import { Loading } from '../../../components/common/Loading';
import './CatalogPage.css';

const CatalogPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    categoria: searchParams.get('categoria') || '',
    orderBy: searchParams.get('orderBy') || 'relevancia',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  useEffect(() => {
    loadCategorias();
    loadEmpresas();
  }, [filters]);

  const loadCategorias = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PUBLICO.CATEGORIAS);
      setCategorias(response);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('q', filters.search);
      if (filters.categoria) params.append('categoria', filters.categoria);
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await api.get(
        `${API_ENDPOINTS.PUBLICO.EMPRESAS}?${params.toString()}`
      );
      setEmpresas(response);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));

    const params = new URLSearchParams();
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    navigate({
      pathname: '/catalogo',
      search: params.toString()
    });
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <h1>Restaurantes</h1>
        <SearchBar 
          initialValue={filters.search}
          onSearch={handleSearch}
        />
      </header>

      <div className="catalog-content">
        <aside className="catalog-filters">
          <FilterPanel
            categorias={categorias}
            filters={filters}
            onChange={handleFilterChange}
          />
        </aside>

        <main className="catalog-main">
          {loading ? (
            <Loading />
          ) : (
            <div className="restaurants-grid">
              {empresas.length > 0 ? (
                empresas.map(empresa => (
                  <RestaurantCard 
                    key={empresa.id}
                    empresa={empresa}
                  />
                ))
              ) : (
                <div className="no-results">
                  <span className="material-icons">search_off</span>
                  <h2>Nenhum restaurante encontrado</h2>
                  <p>
                    Tente mudar os filtros ou fazer uma nova busca
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
