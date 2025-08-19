import React, { useState, useEffect } from 'react';
import { Card, PageLink } from './components';
import { fetchVisits } from './api';
import type { Visit } from './types';

export default function Visits({ onViewGroup }) {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        const loadVisits = async () => {
            try {
                const data = await fetchVisits();
                setVisits(data);
            } catch (err) {
                setError('Falha ao carregar as visitas.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadVisits();
    }, []);

    const statusColors = {
        'Em dia': 'bg-green-500/30 text-green-300',
        'Agendada': 'bg-blue-500/30 text-blue-300',
        'Atrasada': 'bg-red-500/30 text-red-300',
    };

     const renderContent = () => {
        if (loading) {
            return <tr><td colSpan={6} className="text-center p-6">Carregando visitas...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan={6} className="text-center p-6 text-red-400">{error}</td></tr>;
        }
        if (visits.length === 0) {
            return <tr><td colSpan={6} className="text-center p-6">Nenhuma visita encontrada.</td></tr>;
        }
        return visits.map(visit => (
            <tr key={visit.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3"><PageLink onClick={(e) => { e.preventDefault(); onViewGroup(visit.groupId); }}>{visit.groupName}</PageLink></td>
                <td className="p-3">{visit.properties}</td>
                <td className="p-3">{new Date(visit.lastVisitDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">{new Date(visit.nextVisitDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">{visit.frequency}</td>
                <td className="p-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[visit.status]}`}>
                        {visit.status}
                    </span>
                </td>
            </tr>
        ));
    };

    return (
        <div className="p-6">
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Controle de Visitas</h3>
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700 text-gray-400 text-sm">
                        <tr>
                            <th className="p-3">Grupo Econômico</th>
                            <th className="p-3">Imóveis</th>
                            <th className="p-3">Data da Última Visita</th>
                            <th className="p-3">Data da Próxima Visita</th>
                            <th className="p-3">Frequência</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderContent()}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}