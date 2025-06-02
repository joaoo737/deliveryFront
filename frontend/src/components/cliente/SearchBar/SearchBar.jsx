import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { useDebounce } from '../../../hooks/useDebounce';
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    empresas: [],
    produtos: []
  });
  
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch();
    } else {
      setResults({ empresas: [], produtos: [] });
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async () => {
    if (!debouncedQuery.trim()) return;

    try {
      setLoading(true);
      const response = await api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}?q=${encodeURIComponent(debouncedQuery)}`);
      
      // Ensure we have valid arrays even if the response is empty
      setResults({
        empresas: Array.isArray(response.empresas) ? response.empresas : [],
        produtos: Array.isArray(response.produtos) ? response.produtos : []
      });
      setShowResults(true);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults({ empresas: [], produtos: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleEmpresaClick = (empresaId) => {
    navigate(`/empresa/${empresaId}`);
    setShowResults(false);
    setQuery('');
  };

  const handleProdutoClick = (empresaId, produtoId) => {
    navigate(`/empresa/${empresaId}?produto=${produtoId}`);
    setShowResults(false);
    setQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
    }
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Buscar restaurantes e pratos..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <span className="material-icons">search</span>
        </button>
      </form>

      {showResults && (query.trim() || loading) && (
        <div className="search-results">
          {loading ? (
            <div className="search-loading">
              <span className="material-icons spinning">refresh</span>
              <span>Buscando...</span>
            </div>
          ) : (
            <>
              {results.empresas.length === 0 && results.produtos.length === 0 ? (
                <div className="no-results">
                  Nenhum resultado encontrado
                </div>
              ) : (
                <>
                  {results.empresas.length > 0 && (
                    <div className="results-section">
                      <h3>Restaurantes</h3>
                      {results.empresas.map(empresa => (
                        <div
                          key={empresa.id}
                          className="result-item"
                          onClick={() => handleEmpresaClick(empresa.id)}
                        >
                          {empresa.imagemUrl && (
                            <img 
                              src={empresa.imagemUrl} 
                              alt={empresa.nomeFantasia}
                              className="result-image"
                            />
                          )}
                          <div className="result-info">
                            <h4>{empresa.nomeFantasia}</h4>
                            <p>{empresa.categoria}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.produtos.length > 0 && (
                    <div className="results-section">
                      <h3>Produtos</h3>
                      {results.produtos.map(produto => (
                        <div
                          key={produto.id}
                          className="result-item"
                          onClick={() => handleProdutoClick(produto.empresaId, produto.id)}
                        >
                          {produto.imagemUrl && (
                            <img 
                              src={produto.imagemUrl} 
                              alt={produto.nome}
                              className="result-image"
                            />
                          )}
                          <div className="result-info">
                            <h4>{produto.nome}</h4>
                            <p>{produto.empresa}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
