import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, StatusIndicator, PageLink } from './components';
import { fetchEconomicGroups } from './api';
import type { EconomicGroup } from './types';

export default function EconomicGroups({ onViewGroup }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [groups, setGroups] = useState<EconomicGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const data = await fetchEconomicGroups();
                setGroups(data);
            } catch (err) {
                setError('Falha ao carregar os grupos econômicos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
    }, []);

    const filteredGroups = useMemo(() => groups.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, groups]);
    
    const renderContent = () => {
        if (loading) {
            return <tr><td colSpan={9} className="text-center p-6">Carregando grupos...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan={9} className="text-center p-6 text-red-400">{error}</td></tr>;
        }
        if (filteredGroups.length === 0) {
            return <tr><td colSpan={9} className="text-center p-6">Nenhum grupo encontrado.</td></tr>;
        }
        return filteredGroups.map(group => (
            <tr key={group.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3"><PageLink onClick={(e) => { e.preventDefault(); onViewGroup(group.id); }}>{group.name}</PageLink></td>
                <td className="p-3 text-center"><StatusIndicator status={group.watchlistStatus} /></td>
                <td className="p-3">{Number(group.currentVolume).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-3 text-center"><StatusIndicator status={group.insuranceStatus} /></td>
                <td className="p-3 text-center"><StatusIndicator status={group.visitStatus} /></td>
                <td className="p-3">{new Date(group.nextReviewDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">{group.rating}</td>
                <td className="p-3 text-center"><StatusIndicator status={group.covenantsStatus} /></td>
                <td className="p-3"><Button onClick={() => onViewGroup(group.id)}>Detalhes</Button></td>
            </tr>
        ));
    }

    return (
        <div className="p-6">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Grupos Econômicos</h3>
                    <input 
                        type="text" 
                        placeholder="Pesquisar por nome..." 
                        className="bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700 text-gray-400 text-sm">
                        <tr>
                            <th className="p-3">Nome</th>
                            <th className="p-3 text-center">Farol Watchlist</th>
                            <th className="p-3">Volume Atual</th>
                            <th className="p-3 text-center">Farol Seguros</th>
                            <th className="p-3 text-center">Farol Visitas</th>
                            <th className="p-3">Próxima Revisão</th>
                            <th className="p-3">Rating</th>
                            <th className="p-3 text-center">Farol Covenants</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderContent()}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};