import React from 'react';
import FeedbackPanel from '../../../components/empresa/FeedbackPanel';
import './FeedbackPage.css';

const FeedbackPage = () => {
  return (
    <div className="feedback-page">
      <header className="page-header">
        <h1>Avaliações</h1>
        <p className="page-description">
          Acompanhe as avaliações e feedback dos seus clientes
        </p>
      </header>

      <div className="page-content">
        <FeedbackPanel />
      </div>
    </div>
  );
};

export default FeedbackPage;
