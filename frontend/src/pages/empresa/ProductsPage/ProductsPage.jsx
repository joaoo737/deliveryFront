import React from 'react';
import ProductManager from '../../../components/empresa/ProductManager';
import './ProductsPage.css';

const ProductsPage = () => {
  return (
    <div className="products-page">
      <header className="page-header">
        <h1>Produtos</h1>
        <p className="page-description">
          Gerencie os produtos do seu estabelecimento
        </p>
      </header>

      <div className="page-content">
        <ProductManager />
      </div>
    </div>
  );
};

export default ProductsPage;
