import React, { useState } from 'react';
import { Sidebar, Header } from './components';
import type { Page } from './types';
import Dashboard from './Dashboard';
import EconomicGroups from './EconomicGroups';
import GroupDetail from './GroupDetail';
import Reviews from './Reviews';
import Watchlist from './Watchlist';
import Visits from './Visits';
import EventsAndTasksPage from './EventsAndTasksPage';
import PlaceholderPage from './PlaceholderPage';
import InsurancePage from './InsurancePage';
import AppraisalsPage from './AppraisalsPage';
import SettingsPage from './SettingsPage';
import SearchResultsPage from './SearchResultsPage';
import ReportsPage from './ReportsPage';

export default function App() {
  const [page, setPage] = useState<Page>('Início');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const navigateToPage = (newPage: Page) => {
    setPage(newPage);
    setSearchQuery(null);
    if (newPage !== 'Grupos Econômicos') {
      setSelectedGroupId(null);
    }
  };
  
  const handleViewGroup = (id: number) => {
      setSelectedGroupId(id);
      setPage('Grupos Econômicos'); 
      setSearchQuery(null);
  }
  
  const handleBackToGroups = () => {
      setSelectedGroupId(null);
  }

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    setPage('Resultados da Busca');
    setSelectedGroupId(null);
  };

  const renderPage = () => {
    if (page === 'Grupos Econômicos' && selectedGroupId !== null) {
        return <GroupDetail groupId={selectedGroupId} onBack={handleBackToGroups} />
    }
    
    switch (page) {
      case 'Início':
        return <Dashboard />;
      case 'Grupos Econômicos':
        return <EconomicGroups onViewGroup={handleViewGroup} />;
      case 'Revisões':
        return <Reviews onViewGroup={handleViewGroup} />;
      case 'Watchlist':
        return <Watchlist onViewGroup={handleViewGroup} />;
      case 'Visitas':
        return <Visits onViewGroup={handleViewGroup} />;
      case 'Eventos e Tarefas':
        return <EventsAndTasksPage onViewGroup={handleViewGroup}/>;
      case 'Seguros':
        return <InsurancePage onViewGroup={handleViewGroup} />;
      case 'Laudos de Avaliação':
        return <AppraisalsPage onViewGroup={handleViewGroup} />;
      case 'Resultados da Busca':
        return <SearchResultsPage query={searchQuery} onViewGroup={handleViewGroup} />;
      case 'Relatórios':
        return <ReportsPage />;
      case 'Covenants Recebíveis':
      case 'Covenants Financeiros':
        return <PlaceholderPage title={page} />;
      case 'Configurações':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar currentPage={page} setPage={navigateToPage} isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={page} onSearch={handleSearch} />
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}