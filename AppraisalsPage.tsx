import React, { useState, useEffect } from 'react';
import { Card, PageLink, StatusIndicator } from './components';
import { fetchAppraisals } from './api';
import type { Status, Appraisal } from './types';

const getAppraisalStatus = (appraisalDate: string): Status => {
    const now = new Date();
    const appraisal = new Date(appraisalDate);
    const yearsDiff = (now.getTime() - appraisal.getTime()) / (1000 * 3600 * 24 * 365.25);

    if (yearsDiff > 2) return 'critical';
    if (yearsDiff > 1.5) return 'attention';
    return 'ok';
};

export default function AppraisalsPage({ onViewGroup }) {
    const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAppraisals = async () => {
            try {
                const data = await fetchAppraisals();
                setAppraisals(data);
            } catch (err) {
                setError('Falha ao carregar os laudos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAppraisals();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <tr><td colSpan={7} className="text-center p-6">Carregando laudos...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan={7} className="text-center p-6 text-red-400">{error}</td></tr>;
        }
        if (appraisals.length === 0) {
            return <tr><td colSpan={7} className="text-center p-6">Nenhum laudo encontrado.</td></tr>;
        }
        return appraisals.map(appraisal => (
            <tr key={appraisal.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3"><PageLink onClick={(e) => { e.preventDefault(); onViewGroup(appraisal.groupId); }}>{appraisal.groupName}</PageLink></td>
                <td className="p-3">{appraisal.operationId}</td>
                <td className="p-3">{appraisal.property}</td>
                <td className="p-3">{appraisal.appraiser}</td>
                <td className="p-3">{Number(appraisal.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-3">{new Date(appraisal.date).toLocaleDateString('pt-BR')}</td>
                <td className="p-3 text-center"><StatusIndicator status={getAppraisalStatus(appraisal.date)} /></td>
            </tr>
        ));
    };

    return (
        <div className="p-6">
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Laudos de Avaliação</h3>
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700 text-gray-400 text-sm">
                        <tr>
                            <th className="p-3">Grupo Econômico</th>
                            <th className="p-3">Operação</th>
                            <th className="p-3">Imóvel</th>
                            <th className="p-3">Avaliador</th>
                            <th className="p-3">Valor do Laudo</th>
                            <th className="p-3">Data do Laudo</th>
                            <th className="p-3 text-center">Status</th>
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