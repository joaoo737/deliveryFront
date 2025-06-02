import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
import { produtoApi } from '../../../services/api/produtoApi';
import { formatCurrency } from '../../../utils/formatters';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import './SearchBar.css';

const SearchBar = ({ 
  onFilterToggle, 
  hasActiveFilters = false, 
  placeholder = "Buscar produtos, empresas...",
  showSuggestions = true,
  autoFocus = false,
  onSearch
}) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Debounce da busca
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Histórico de buscas
  const [recentSearches, setRecentSearches] = useLocalStorage('recent_searches', []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Buscar sugestões
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2 && showSuggestions) {
      searchSuggestions(debouncedSearchTerm);
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [debouncedSearchTerm, showSuggestions]);

  const searchSuggestions = async (term) => {
    try {
      setLoading(true);
      const response = await produtoApi.buscarPorTermo(term, { size: 8 });
      
      // Processar resultados para sugestões
      const productSuggestions = response.content || response;
      setSuggestions(productSuggestions);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);
    
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSearch = useCallback((term = searchTerm) => {
    if (!term.trim()) return;

    // Adicionar ao histórico
    addToRecentSearches(term.trim());
    
    // Fechar sugestões
    setIsOpen(false);
    
    // Callback customizado ou navegação padrão
    if (onSearch) {
      onSearch(term.trim());
    } else {
      navigate(`/catalogo?q=${encodeURIComponent(term.trim())}`);
    }
  }, [searchTerm, onSearch, navigate]);

  const addToRecentSearches = (term) => {
    const updated = [term, ...recentSearches.filter(item => item !== term)].slice(0, 5);
    setRecentSearches(updated);
  };

  const removeFromRecentSearches = (term) => {
    setRecentSearches(recentSearches.filter(item => item !== term));
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    const maxIndex = suggestions.length + recentSearches.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, maxIndex));
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, -1));
        break;
        
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(highlightedIndex);
        } else {
          handleSearch();
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (index) => {
    const totalRecent = recentSearches.length;
    
    if (index < totalRecent) {
      // Busca recente
      const term = recentSearches[index];
      setSearchTerm(term);
      handleSearch(term);
    } else {
      // Sugestão de produto
      const suggestion = suggestions[index - totalRecent];
      if (suggestion) {
        const term = suggestion.nome;
        setSearchTerm(term);
        handleSearch(term);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (searchTerm.length >= 2 || recentSearches.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = (e) => {
    // Delay para permitir cliques nas sugestões
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }, 200);
  };

  const renderSuggestions = () => {
    if (!isOpen) return null;

    const hasRecent = recentSearches.length > 0;
    const hasSuggestions = suggestions.length > 0;
    const showLoading = loading && searchTerm.length >= 2;
    const showNoResults = !loading && searchTerm.length >= 2 && !hasSuggestions;

    return (
      <>
        <div className="search-bar__overlay" onClick={() => setIsOpen(false)} />
        <div className="search-bar__suggestions" ref={suggestionsRef}>
          {/* Buscas recentes */}
          {hasRecent && !searchTerm && (
            <div className="search-bar__recent-searches">
              <div className="search-bar__recent-title">Buscas recentes</div>
              {recentSearches.map((item, index) => (
                <div
                  key={item}
                  className={`search-bar__recent-item ${
                    highlightedIndex === index ? 'highlighted' : ''
                  }`}
                  onClick={() => handleSuggestionClick(index)}
                >
                  <span className="search-bar__recent-text">{item}</span>
                  <button
                    className="search-bar__recent-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromRecentSearches(item);
                    }}
                    aria-label="Remover busca"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading */}
          {showLoading && (
            <div className="search-bar__loading">
              Buscando produtos...
            </div>
          )}

          {/* Sugestões de produtos */}
          {hasSuggestions && (
            <div>
              {suggestions.map((suggestion, index) => {
                const suggestionIndex = recentSearches.length + index;
                return (
                  <div
                    key={suggestion.id}
                    className={`search-bar__suggestion-item ${
                      highlightedIndex === suggestionIndex ? 'highlighted' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestionIndex)}
                  >
                    <div className="search-bar__suggestion-icon">
                      {suggestion.imagemUrl ? (
                        <img 
                          src={suggestion.imagemUrl} 
                          alt={suggestion.nome}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                        />
                      ) : (
                        '🍽️'
                      )}
                    </div>
                    <div className="search-bar__suggestion-content">
                      <div className="search-bar__suggestion-title">
                        {suggestion.nome}
                      </div>
                      <div className="search-bar__suggestion-subtitle">
                        {suggestion.categoria?.nome || 'Produto'} • {suggestion.nomeEmpresa}
                      </div>
                    </div>
                    <div className="search-bar__suggestion-price">
                      {formatCurrency(suggestion.preco)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Nenhum resultado */}
          {showNoResults && (
            <div className="search-bar__no-results">
              <div className="search-bar__no-results-icon">🔍</div>
              <div className="search-bar__no-results-text">
                Nenhum resultado encontrado
              </div>
              <div className="search-bar__no-results-hint">
                Tente buscar por outros termos
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="search-bar">
      <div className="search-bar__container">
        <div className="search-bar__icon">
          🔍
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="search-bar__input"
          autoComplete="off"
          spellCheck="false"
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="search-bar__clear-btn"
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}
        
        {onFilterToggle && (
          <button
            onClick={onFilterToggle}
            className={`search-bar__filters-btn ${hasActiveFilters ? 'active' : ''}`}
            aria-label="Filtros de busca"
          >
            ⚙️
          </button>
        )}
      </div>

      {renderSuggestions()}
    </div>
  );
};

export default SearchBar;