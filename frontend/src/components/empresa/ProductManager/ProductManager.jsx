import React, { useState, useEffect } from 'react';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS } from '../../../utils/constants';
import { formatCurrency } from '../../../utils/formatters';
import { ProductForm } from '../ProductForm';
import { Loading } from '../../common/Loading';
import './ProductManager.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.EMPRESA.PRODUTOS);
      setProducts(response);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PUBLICO.CATEGORIAS);
      setCategories(response);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await api.put(
          `${API_ENDPOINTS.EMPRESA.PRODUTOS}/${editingProduct.id}`,
          formData
        );
      } else {
        await api.post(API_ENDPOINTS.EMPRESA.PRODUTOS, formData);
      }
      
      setShowForm(false);
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      throw error;
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      await api.patch(
        `${API_ENDPOINTS.EMPRESA.PRODUTOS}/${productId}/status`,
        { disponivel: !currentStatus }
      );
      
      setProducts(products.map(product => 
        product.id === productId
          ? { ...product, disponivel: !currentStatus }
          : product
      ));
    } catch (error) {
      console.error('Erro ao alterar status do produto:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      await api.delete(`${API_ENDPOINTS.EMPRESA.PRODUTOS}/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || 
      product.categoriaId.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="product-manager">
      {showForm ? (
        <div className="product-form-container">
          <ProductForm
            produto={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <>
          <div className="product-controls">
            <div className="search-filters">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleAddProduct}
              className="add-button"
            >
              <span className="material-icons">add</span>
              Novo Produto
            </button>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={`product-card ${!product.disponivel ? 'disabled' : ''}`}
              >
                <div className="product-image">
                  {product.imagemUrl ? (
                    <img src={product.imagemUrl} alt={product.nome} />
                  ) : (
                    <div className="image-placeholder">
                      <span className="material-icons">image</span>
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <h3>{product.nome}</h3>
                  <p className="product-description">
                    {product.descricao}
                  </p>
                  <p className="product-price">
                    {formatCurrency(product.preco)}
                  </p>
                </div>

                <div className="product-actions">
                  <button
                    onClick={() => handleToggleStatus(product.id, product.disponivel)}
                    className={`status-toggle ${product.disponivel ? 'active' : ''}`}
                    title={product.disponivel ? 'Desativar' : 'Ativar'}
                  >
                    <span className="material-icons">
                      {product.disponivel ? 'toggle_on' : 'toggle_off'}
                    </span>
                  </button>

                  <button
                    onClick={() => handleEditProduct(product)}
                    className="edit-button"
                    title="Editar"
                  >
                    <span className="material-icons">edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="delete-button"
                    title="Excluir"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="no-products">
                <span className="material-icons">inventory_2</span>
                <p>Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManager;
