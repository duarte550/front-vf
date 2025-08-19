import React, { useState, useEffect } from 'react';
import { Card, Icon } from './components';
import { fetchReportsData } from './api';
import { ICONS } from './iconPaths';
import { formatToMillionsBRL } from './utils';

interface ReportRow {
    rating: string;
    total_volume: number;
}

export default function ReportsPage() {
    const [reportData, setReportData] = useState<ReportRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true);
                const data = await fetchReportsData();
                setReportData(data);
            } catch (err) {
                setError('Falha ao carregar o relatório do Databricks. Verifique a conexão do backend e as configurações do cluster.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadReport();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center p-10">
                    <p className="text-lg text-gray-300">Carregando relatório analítico...</p>
                    <p className="text-sm text-gray-500 mt-2">Consultas em nossa plataforma de Big Data (Databricks) podem levar alguns segundos.</p>
                </div>
            );
        }
        if (error) {
            return <div className="text-center p-10 text-red-400">{error}</div>;
        }
        if (reportData.length === 0) {
            return <div className="text-center p-10">Nenhum dado encontrado para gerar o relatório.</div>;
        }
        return (
            <table className="w-full text-left">
                <thead className="border-b border-gray-700 text-gray-400 text-sm">
                    <tr>
                        <th className="p-3">Rating da Operação</th>
                        <th className="p-3 text-right">Volume Total Consolidado</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((row) => (
                        <tr key={row.rating} className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="p-3 font-medium text-white">{row.rating}</td>
                            <td className="p-3 text-right font-mono">{formatToMillionsBRL(Number(row.total_volume))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="p-6">
            <Card>
                <div className="flex items-center gap-4 mb-4">
                     <Icon path={ICONS.reports} className="w-8 h-8 text-blue-400" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Relatórios Analíticos</h2>
                        <p className="text-gray-400">Relatórios gerados a partir da nossa plataforma de dados (Databricks).</p>
                    </div>
                </div>

                <Card className="mt-6 bg-gray-900/50">
                     <h3 className="text-lg font-semibold text-white mb-4">Volume Total por Rating</h3>
                     {renderContent()}
                </Card>
            </Card>
        </div>
    );
}