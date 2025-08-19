import React, { useState } from 'react';
import type { Page, Status } from './types';
import { ICONS } from './iconPaths';

export const Icon = ({ path, className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

export const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick = () => {}, variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors inline-flex items-center justify-center';
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };
    return <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>
}

export const StatusIndicator = ({ status } : {status: Status}) => {
    const colors = {
        ok: 'bg-green-500',
        attention: 'bg-yellow-500',
        problem: 'bg-pink-500',
        critical: 'bg-red-500',
    };
    return <span className={`w-3 h-3 rounded-full inline-block ${colors[status]}`}></span>
};

export const PageLink = ({ children, onClick }) => (
    <a href="#" onClick={onClick} className="text-blue-400 hover:text-blue-300 hover:underline font-medium">
        {children}
    </a>
);

export const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icon path={ICONS.close} />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export const Sidebar = ({ currentPage, setPage, isCollapsed, setCollapsed }) => {
  const navItems: { name: Page; icon: string }[] = [
    { name: 'Início', icon: ICONS.home },
    { name: 'Grupos Econômicos', icon: ICONS.groups },
    { name: 'Eventos e Tarefas', icon: ICONS.calendar },
    { name: 'Revisões', icon: ICONS.reviews },
    { name: 'Watchlist', icon: ICONS.watchlist },
    { name: 'Seguros', icon: ICONS.insurance },
    { name: 'Laudos de Avaliação', icon: ICONS.appraisals },
    { name: 'Visitas', icon: ICONS.visits },
    { name: 'Covenants Recebíveis', icon: ICONS.covenants },
    { name: 'Covenants Financeiros', icon: ICONS.covenants },
    { name: 'Relatórios', icon: ICONS.reports },
    { name: 'Configurações', icon: ICONS.settings },
  ];

  return (
    <aside className={`bg-gray-800 text-gray-300 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className={`text-2xl font-bold text-white ${isCollapsed ? 'hidden' : 'block'}`}>CRM</h1>
        <h1 className={`text-2xl font-bold text-white ${isCollapsed ? 'block' : 'hidden'}`}>C</h1>
      </div>
      <nav className="flex-grow p-2">
        {navItems.map(item => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => { e.preventDefault(); setPage(item.name); }}
            className={`flex items-center p-3 my-1 rounded-md transition-colors ${currentPage === item.name ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
          >
            <Icon path={item.icon} className="w-6 h-6"/>
            {!isCollapsed && <span className="ml-4">{item.name}</span>}
          </a>
        ))}
      </nav>
       <button onClick={() => setCollapsed(!isCollapsed)} className="p-4 border-t border-gray-700 hover:bg-gray-700 flex items-center justify-center">
            <Icon path={isCollapsed ? ICONS.chevronRight : ICONS.chevronLeft} className="w-6 h-6 text-white"/>
       </button>
    </aside>
  );
};

export const Header = ({ currentPage, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      onSearch(searchTerm.trim());
    }
  };
  
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-white">{currentPage}</h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Pesquisa global..." 
            className="bg-gray-700 text-white rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon path={ICONS.search} className="w-5 h-5"/>
          </span>
        </div>
        <button className="text-gray-400 hover:text-white">
          <Icon path={ICONS.notifications} className="w-6 h-6"/>
        </button>
        <div className="flex items-center gap-2">
          <img src="https://i.pravatar.cc/40" alt="User" className="w-10 h-10 rounded-full" />
          <span className="text-white font-medium">Usuário</span>
          <Icon path={ICONS.chevronDown} className="w-5 h-5 text-gray-400"/>
        </div>
      </div>
    </header>
  );
}