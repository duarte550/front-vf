import React, { useMemo, useState, useEffect } from 'react';
import { Card, StatusIndicator, PageLink } from './components';
import { fetchWatchlistSummary, fetchWatchlistGroups } from './api';
import { formatToMillionsBRL } from './utils';

export default function Watchlist({ onViewGroup }) {
    const [summary, setSummary] = useState({ ok: 0, attention: 0, critical: 0 });
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [summaryData, groupsData] = await Promise.all([
                    fetchWatchlistSummary(),
                    fetchWatchlistGroups(),
                ]);
                setSummary(summaryData);
                setGroups(groupsData);
            } catch (err) {
                setError('Falha ao carregar dados da watchlist.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (error) {
        return <div className="p-6 text-red-400">{error}</div>
    }

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 p-5">
                     <div className="p-3 bg-green-500/20 rounded-full"><StatusIndicator status="ok" /></div>
                    <div>
                        <h3 className="text-gray-400 text-sm">Operações OK</h3>
                        <p className="text-2xl font-bold text-white">{loading ? '...' : summary.ok}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-5">
                    <div className="p-3 bg-yellow-500/20 rounded-full"><StatusIndicator status="attention" /></div>
                    <div>
                        <h3 className="text-gray-400 text-sm">Operações em Atenção</h3>
                        <p className="text-2xl font-bold text-white">{loading ? '...' : summary.attention}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 p-5">
                    <div className="p-3 bg-red-500/20 rounded-full"><StatusIndicator status="critical" /></div>
                    <div>
                        <h3 className="text-gray-400 text-sm">Operações Críticas</h3>
                        <p className="text-2xl font-bold text-white">{loading ? '...' : summary.critical}</p>
                    </div>
                </Card>
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Grupos em Watchlist</h3>
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700 text-gray-400 text-sm">
                        <tr>
                            <th className="p-3">Grupo Econômico</th>
                            <th className="p-3 text-center">Farol Watchlist</th>
                            <th className="p-3">Volume</th>
                            <th className="p-3">Última Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="text-center p-6">Carregando grupos...</td></tr>
                        ) : (
                            groups.map(group => (
                                <tr key={group.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-3"><PageLink onClick={(e) => { e.preventDefault(); onViewGroup(group.id); }}>{group.name}</PageLink></td>
                                    <td className="p-3 text-center"><StatusIndicator status={group.watchlistStatus} /></td>
                                    <td className="p-3">{formatToMillionsBRL(Number(group.currentVolume))}</td>
                                    <td className="p-3">{group.lastObservation}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}