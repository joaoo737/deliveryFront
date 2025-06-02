import React from 'react';
import { ReportsPanel } from '../../../components/empresa/ReportsPanel/ReportsPanel';
import './ReportsPage.css';

const ReportsPage = () => {
  return (
    <div className="reports-page">
      <header className="page-header">
        <h1>Relatórios</h1>
        <p className="page-description">
          Analise o desempenho do seu negócio através de relatórios detalhados
        </p>
      </header>

      <div className="page-content">
        <ReportsPanel />
      </div>
    </div>
  );
};

export default ReportsPage;
