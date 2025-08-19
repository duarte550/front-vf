import React, { useState, useEffect } from 'react';
import { Card, PageLink, Icon } from './components';
import { performGlobalSearch } from './api';
import type { SearchResults } from './types';
import { ICONS } from './iconPaths';


const Highlight = ({ text = '', highlight = '' }) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <span key={i} className="bg-yellow-500/30 text-yellow-200 font-semibold">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};


export default function SearchResultsPage({ query, onViewGroup }) {
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) {
            setResults(null);
            setLoading(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await performGlobalSearch(query);
                setResults(data);
            } catch (err) {
                setError('Falha ao realizar a busca.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return <div className="p-6 text-center">Buscando...</div>;
    }
    
    if (error) {
        return <div className="p-6 text-center text-red-400">{error}</div>;
    }

    const hasResults = results && (results.groups.length > 0 || results.events.length > 0);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">
                Resultados da busca para: <span className="text-blue-400">"{query}"</span>
            </h2>

            {!hasResults ? (
                <Card>
                    <p className="text-gray-400">Nenhum resultado encontrado.</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    {results.groups.length > 0 && (
                        <Card>
                            <h3 className="text-lg font-semibold text-white mb-4">Grupos Econômicos</h3>
                            <div className="space-y-3">
                                {results.groups.map(item => (
                                    <div key={`group-${item.id}`} className="p-3 bg-gray-700/50 rounded-md">
                                        <PageLink onClick={(e) => { e.preventDefault(); onViewGroup(item.groupId); }}>
                                            <Highlight text={item.title} highlight={query} />
                                        </PageLink>
                                        <p className="text-sm text-gray-400 mt-1 truncate">
                                           <Highlight text={item.snippet} highlight={query} />
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {results.events.length > 0 && (
                         <Card>
                            <h3 className="text-lg font-semibold text-white mb-4">Eventos</h3>
                            <div className="space-y-3">
                                {results.events.map(item => (
                                    <div key={`event-${item.id}`} className="p-3 bg-gray-700/50 rounded-md">
                                        <p className="font-semibold text-white"><Highlight text={item.title} highlight={query} /></p>
                                        <PageLink onClick={(e) => { e.preventDefault(); onViewGroup(item.groupId); }}>
                                            {item.snippet}
                                        </PageLink>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}