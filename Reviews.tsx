import React, { useState, useEffect } from 'react';
import { Card, PageLink, StatusIndicator } from './components';
import { fetchReviews } from './api';
import { formatToMillionsBRL } from './utils';
import type { Review } from './types';

export default function Reviews({ onViewGroup }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await fetchReviews();
                setReviews(data);
            } catch (err) {
                setError('Falha ao carregar as revisões.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadReviews();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <tr><td colSpan={7} className="text-center p-6">Carregando revisões...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan={7} className="text-center p-6 text-red-400">{error}</td></tr>;
        }
        if (reviews.length === 0) {
            return <tr><td colSpan={7} className="text-center p-6">Nenhuma revisão encontrada.</td></tr>;
        }
        return reviews.map(review => (
            <tr key={review.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3"><PageLink onClick={(e) => { e.preventDefault(); onViewGroup(review.groupId); }}>{review.groupName}</PageLink></td>
                <td className="p-3">{formatToMillionsBRL(Number(review.currentVolume))}</td>
                <td className="p-3">{review.rating}</td>
                <td className="p-3">{new Date(review.lastReviewDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-3">{new Date(review.nextReviewDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-3 text-center"><StatusIndicator status={review.status} /></td>
                <td className="p-3">{review.responsible}</td>
            </tr>
        ));
    };

    return (
        <div className="p-6">
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Revisões</h3>
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700 text-gray-400 text-sm">
                        <tr>
                            <th className="p-3">Grupo Econômico</th>
                            <th className="p-3">Volume Total</th>
                            <th className="p-3">Rating</th>
                            <th className="p-3">Data da Última Revisão</th>
                            <th className="p-3">Data da Próxima Revisão</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3">Responsável</th>
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