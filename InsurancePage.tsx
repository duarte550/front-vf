import React, { useState, useEffect } from 'react';
import { Card, PageLink, StatusIndicator } from './components';
import { fetchInsurances } from './api';
import type { Status, Insurance } from './types';

const getInsuranceStatus = (expirationDate: string): Status => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only
    const expiration = new Date(expirationDate);
    const daysDiff = (expiration.getTime() - now.getTime()) / (1000 * 3600 * 24);

    if (daysDiff < 0) return 'critical'; // already expired
    if (daysDiff <= 30) return 'critical';
    if (daysDiff <= 90) return 'attention';
    return 'ok';
};


export default function InsurancePage({ onViewGroup }) {
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInsurances = async () => {
            try {
                const data = await fetchInsurances();
                setInsurances(data);
            } catch (err) {
                setError('Falha ao carregar os seguros.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadInsurances();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <tr><td colSpan={7} className="text-center p-6">Carregando seguros...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan={7} className="text-center p-6 text-red-400">{error}</td></tr>;
        }
        if (insurances.length === 0) {
            return <tr><td colSpan={7} className="text-center p-6">Nenhum seguro encontrado.</td></tr>;
        }
        return insurances.map(insurance => (
            <tr key={insurance.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3"><PageLink onClick={(e) => { e.preventDefault(); onViewGroup(insurance.groupId); }}>{insurance.groupName}</PageLink></td>
                <td className="p-3">{insurance.operationId}</td>
                <td className="p-3">{insurance.property}</td>
                <td className="p-3">{insurance.insurer}</td>
                <td className="p-3">{Number(insurance.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-3">{new Date(insurance.expirationDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-3 text-center"><StatusIndicator status={getInsuranceStatus(insurance.expirationDate)} /></td>
            </tr>
        ));
    };

    return (
        <div className="p-6">
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Controle de Seguros</h3>
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700 text-gray-400 text-sm">
                        <tr>
                            <th className="p-3">Grupo Econômico</th>
                            <th className="p-3">Operação</th>
                            <th className="p-3">Imóvel</th>
                            <th className="p-3">Seguradora</th>
                            <th className="p-3">Valor do Seguro</th>
                            <th className="p-3">Vencimento do Seguro</th>
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