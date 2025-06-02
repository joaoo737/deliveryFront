import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { SearchBar } from '../../../components/cliente/SearchBar/SearchBar';
import { FilterPanel } from '../../../components/cliente/FilterPanel/FilterPanel';
import { RestaurantCard } from '../../../components/cliente/RestaurantCard/RestaurantCard';
import { Loading } from '../../../components/common/Loading/Loading';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    orderBy: 'relevancia',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadCategoria();
    loadEmpresas();
  }, [id, filters]);

  const loadCategoria = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.PUBLICO.CATEGORIAS}/${id}`);
      setCategoria(response);
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      navigate('/catalogo');
    }
  };

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('q', filters.search);
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await api.get(
        `${API_ENDPOINTS.PUBLICO.CATEGORIAS}/${id}/empresas?${params.toString()}`
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
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };

  if (!categoria) {
    return <Loading />;
  }

  return (
    <div className="category-page">
      <header className="category-header">
        <div className="category-info">
          <h1>{categoria.nome}</h1>
          {categoria.descricao && (
            <p className="category-description">
              {categoria.descricao}
            </p>
          )}
        </div>
        <SearchBar 
          initialValue={filters.search}
          onSearch={handleSearch}
          placeholder={`Buscar em ${categoria.nome}...`}
        />
      </header>

      <div className="category-content">
        <aside className="category-filters">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            hideCategories
          />
        </aside>

        <main className="category-main">
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
                  <span className="material-icons">store_off</span>
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

export default CategoryPage;
