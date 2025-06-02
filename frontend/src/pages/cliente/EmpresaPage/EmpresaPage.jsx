import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';
import { useCart } from '../../../hooks/useCart';
import { ProductCard } from '../../../components/cliente/ProductCard';
import { CartModal } from '../../../components/cliente/CartModal';
import { Loading } from '../../../components/common/Loading';
import './EmpresaPage.css';

const EmpresaPage = () => {
  const { id } = useParams();
  const { cart, addToCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [empresa, setEmpresa] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadEmpresa();
  }, [id]);

  const loadEmpresa = async () => {
    try {
      setLoading(true);
      const [empresaResponse, categoriasResponse] = await Promise.all([
        api.get(`${API_ENDPOINTS.PUBLICO.EMPRESAS}/${id}`),
        api.get(`${API_ENDPOINTS.PUBLICO.EMPRESAS}/${id}/categorias`)
      ]);

      setEmpresa(empresaResponse);
      setCategorias(categoriasResponse);
      if (categoriasResponse.length > 0) {
        setSelectedCategory(categoriasResponse[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowCartModal(true);
  };

  const handleAddToCart = (product, quantity, notes) => {
    addToCart({
      ...product,
      quantidade: quantity,
      observacoes: notes
    });
    setShowCartModal(false);
    setSelectedProduct(null);
  };

  if (loading || !empresa) {
    return <Loading />;
  }

  return (
    <div className="empresa-page">
      <header 
        className="empresa-header"
        style={{
          backgroundImage: empresa.bannerUrl 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${empresa.bannerUrl})`
            : undefined
        }}
      >
        <div className="empresa-info">
          {empresa.imagemUrl && (
            <img 
              src={empresa.imagemUrl} 
              alt={empresa.nomeFantasia}
              className="empresa-logo"
            />
          )}
          
          <div className="empresa-details">
            <h1>{empresa.nomeFantasia}</h1>
            
            <div className="empresa-meta">
              {empresa.categoria && (
                <span className="categoria">{empresa.categoria}</span>
              )}
              
              <div className="rating">
                <span className="material-icons">star</span>
                <span>{empresa.avaliacao.toFixed(1)}</span>
                <span className="total-ratings">
                  ({empresa.totalAvaliacoes} avaliações)
                </span>
              </div>

              <div className="delivery-info">
                <span className="material-icons">schedule</span>
                <span>{empresa.tempoEntregaMinimo}-{empresa.tempoEntregaMaximo} min</span>
                
                <span className="material-icons">local_shipping</span>
                <span>
                  {empresa.taxaEntrega === 0 
                    ? 'Grátis' 
                    : formatCurrency(empresa.taxaEntrega)
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="empresa-content">
        <nav className="categorias-nav">
          {categorias.map(categoria => (
            <button
              key={categoria.id}
              className={`categoria-button ${
                selectedCategory === categoria.id ? 'active' : ''
              }`}
              onClick={() => handleCategoryClick(categoria.id)}
            >
              {categoria.nome}
            </button>
          ))}
        </nav>

        <main className="produtos-grid">
          {categorias
            .find(cat => cat.id === selectedCategory)
            ?.produtos.map(produto => (
              <ProductCard
                key={produto.id}
                produto={produto}
                onClick={() => handleProductClick(produto)}
              />
            ))}
        </main>
      </div>

      {showCartModal && selectedProduct && (
        <CartModal
          produto={selectedProduct}
          empresa={empresa}
          onClose={() => setShowCartModal(false)}
          onAdd={handleAddToCart}
        />
      )}
    </div>
  );
};

export default EmpresaPage;
