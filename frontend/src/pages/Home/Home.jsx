import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/httpClient';
import { API_ENDPOINTS } from '../../utils/constants';
import Loading from '../../components/common/Loading/Loading';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({
    totalEmpresas: 0,
    totalProdutos: 0,
    totalCategorias: 0
  });

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados em paralelo
      const [categoriesRes, companiesRes, productsRes] = await Promise.allSettled([
        api.get(API_ENDPOINTS.PUBLICO.CATEGORIAS),
        api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/empresas`, { size: 6 }),
        api.get(`${API_ENDPOINTS.PUBLICO.BUSCA}/produtos`, { size: 8 })
      ]);

      // Categorias
      if (categoriesRes.status === 'fulfilled') {
        setCategories(categoriesRes.value.slice(0, 8));
      }

      // Empresas em destaque
      if (companiesRes.status === 'fulfilled') {
        setFeaturedCompanies(companiesRes.value.content || companiesRes.value);
      }

      // Produtos em destaque
      if (productsRes.status === 'fulfilled') {
        setFeaturedProducts(productsRes.value.content || productsRes.value);
      }

      // Estatísticas básicas
      setStats({
        totalEmpresas: companiesRes.status === 'fulfilled' ? (companiesRes.value.totalElements || companiesRes.value.length) : 0,
        totalProdutos: productsRes.status === 'fulfilled' ? (productsRes.value.totalElements || productsRes.value.length) : 0,
        totalCategorias: categoriesRes.status === 'fulfilled' ? categoriesRes.value.length : 0
      });

    } catch (error) {
      console.error('Erro ao carregar dados da home:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/categoria/${category.slug}`);
  };

  const handleCompanyClick = (company) => {
    navigate(`/empresa/${company.id}`);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="home">
      <Header />
      
      <main className="home__content">
        {/* Hero Section */}
        <section className="home__hero">
          <div className="container">
            <div className="home__hero-content">
              <h1 className="home__hero-title">
                Seu delivery favorito chegou! 🚚
              </h1>
              <p className="home__hero-subtitle">
                Descubra milhares de restaurantes e produtos incríveis na sua região
              </p>
              {!isAuthenticated ? (
                <div className="home__hero-actions">
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Começar Agora
                  </Link>
                  <Link to="/catalogo" className="btn btn-secondary btn-lg">
                    Ver Catálogo
                  </Link>
                </div>
              ) : (
                <div className="home__hero-actions">
                  <Link 
                    to={user?.tipoUsuario === 'EMPRESA' ? '/empresa/dashboard' : '/catalogo'} 
                    className="btn btn-primary btn-lg"
                  >
                    {user?.tipoUsuario === 'EMPRESA' ? 'Meu Dashboard' : 'Explorar Catálogo'}
                  </Link>
                </div>
              )}
            </div>
            
            <div className="home__hero-stats">
              <div className="home__stat">
                <span className="home__stat-number">{stats.totalEmpresas}+</span>
                <span className="home__stat-label">Empresas</span>
              </div>
              <div className="home__stat">
                <span className="home__stat-number">{stats.totalProdutos}+</span>
                <span className="home__stat-label">Produtos</span>
              </div>
              <div className="home__stat">
                <span className="home__stat-number">{stats.totalCategorias}+</span>
                <span className="home__stat-label">Categorias</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="home__section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Explore por Categoria</h2>
                <p className="section-subtitle">
                  Encontre exatamente o que você está procurando
                </p>
              </div>
              
              <div className="home__categories">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="home__category-card"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="home__category-icon">
                      {category.icone}
                    </div>
                    <h3 className="home__category-name">{category.nome}</h3>
                  </div>
                ))}
              </div>
              
              <div className="section-actions">
                <Link to="/catalogo" className="btn btn-secondary">
                  Ver Todas as Categorias
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Featured Companies Section */}
        {featuredCompanies.length > 0 && (
          <section className="home__section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Empresas em Destaque</h2>
                <p className="section-subtitle">
                  Descubra os melhores estabelecimentos da sua região
                </p>
              </div>
              
              <div className="home__companies">
                {featuredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="home__company-card"
                    onClick={() => handleCompanyClick(company)}
                  >
                    <div className="home__company-image">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.nomeFantasia} />
                      ) : (
                        <div className="home__company-placeholder">
                          {company.nomeFantasia.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className="home__company-info">
                      <h3 className="home__company-name">{company.nomeFantasia}</h3>
                      {company.categoria && (
                        <span className="home__company-category">
                          {company.categoria.icone} {company.categoria.nome}
                        </span>
                      )}
                      {company.avaliacao > 0 && (
                        <div className="home__company-rating">
                          <span className="home__rating-stars">
                            {'★'.repeat(Math.floor(company.avaliacao))}
                            {'☆'.repeat(5 - Math.floor(company.avaliacao))}
                          </span>
                          <span className="home__rating-value">
                            {company.avaliacao.toFixed(1)}
                          </span>
                          <span className="home__rating-count">
                            ({company.totalAvaliacoes || 0})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="section-actions">
                <Link to="/catalogo" className="btn btn-secondary">
                  Ver Todas as Empresas
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="home__section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Produtos Populares</h2>
                <p className="section-subtitle">
                  Os produtos mais pedidos pelos nossos usuários
                </p>
              </div>
              
              <div className="home__products">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="home__product-card">
                    <div className="home__product-image">
                      {product.imagemUrl ? (
                        <img src={product.imagemUrl} alt={product.nome} />
                      ) : (
                        <div className="home__product-placeholder">
                          🍽️
                        </div>
                      )}
                    </div>
                    
                    <div className="home__product-info">
                      <h3 className="home__product-name">{product.nome}</h3>
                      <p className="home__product-price">
                        {formatCurrency(product.preco)}
                      </p>
                      {product.categoria && (
                        <span className="home__product-category">
                          {product.categoria.nome}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="section-actions">
                <Link to="/catalogo" className="btn btn-secondary">
                  Ver Todos os Produtos
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="home__cta">
          <div className="container">
            <div className="home__cta-content">
              <h2 className="home__cta-title">
                Pronto para começar?
              </h2>
              <p className="home__cta-subtitle">
                {isAuthenticated ? (
                  user?.tipoUsuario === 'EMPRESA' ? 
                    'Gerencie seus produtos e pedidos no dashboard'
                    : 'Explore nosso catálogo e faça seu primeiro pedido'
                ) : (
                  'Cadastre-se agora e tenha acesso a milhares de opções'
                )}
              </p>
              <div className="home__cta-actions">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Criar Conta
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">
                      Já tenho conta
                    </Link>
                  </>
                ) : (
                  <Link 
                    to={user?.tipoUsuario === 'EMPRESA' ? '/empresa/dashboard' : '/catalogo'} 
                    className="btn btn-primary btn-lg"
                  >
                    {user?.tipoUsuario === 'EMPRESA' ? 'Ir para Dashboard' : 'Explorar Agora'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;