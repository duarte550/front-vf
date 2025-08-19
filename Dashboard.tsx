import React, { useState, useEffect } from 'react';
import { Card } from './components';
import { fetchDashboardData } from './api';

const LoadingCard = () => (
    <Card className="animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-600 rounded w-1/2"></div>
    </Card>
);

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchDashboardData();
                setData(dashboardData);
            } catch (err) {
                setError('Falha ao carregar os dados do dashboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const Calendar = () => {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const monthName = today.toLocaleString('pt-BR', { month: 'long' });
        
        const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
        const emptyDays = Array.from({length: firstDayOfMonth});

        return (
             <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-white capitalize">{monthName} {year}</h4>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
                    <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
                </div>
                <div className="grid grid-cols-7 text-center text-sm">
                    {emptyDays.map((_, i) => <div key={`empty-${i}`}></div>)}
                    {days.map(day => (
                        <div key={day} className={`p-1 ${day === today.getDate() ? 'bg-blue-600 text-white rounded-full' : ''}`}>
                            {day}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    
    if (error) return <div className="p-6 text-red-400">{error}</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <LoadingCard key={i} />)
                ) : (
                    data?.metrics.map(metric => (
                        <Card key={metric.title}>
                            <h3 className="text-gray-400 text-sm">{metric.title}</h3>
                            <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                        </Card>
                    ))
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                     <h3 className="text-lg font-semibold text-white mb-2 px-4 pt-2">Calendário e Próximos Eventos</h3>
                     <Calendar />
                     <div className="px-4 pb-4 border-t border-gray-700">
                         {loading ? <p className="text-gray-400">Carregando eventos...</p> : 
                         data?.upcomingEvents.map(event => (
                            <div key={event.title} className="mt-4">
                               <p className="font-semibold text-white">{event.title}</p>
                               <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'long'})}</p>
                            </div>
                         ))}
                     </div>
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4">Alertas e Atividades Recentes</h3>
                     {loading ? <p className="text-gray-400">Carregando alertas...</p> :
                     <div className="space-y-3">
                         <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md">
                             <div>
                                 <p className="font-semibold text-white">Revisão Anual - Grupo Alfa</p>
                                 <p className="text-sm text-gray-400">Vence em 3 dias</p>
                             </div>
                             <span className="text-xs font-bold bg-red-500/30 text-red-300 px-2 py-1 rounded-full">Alta</span>
                         </div>
                          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md">
                             <div>
                                 <p className="font-semibold text-white">Seguro Garantia - Consórcio Delta</p>
                                 <p className="text-sm text-gray-400">Vence em 15 dias</p>
                             </div>
                             <span className="text-xs font-bold bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded-full">Média</span>
                         </div>
                         <div className="p-3 bg-gray-700/50 rounded-md">
                            <p className="text-gray-300">Novo evento adicionado para <span className="font-semibold text-white">Empresa Beta</span>.</p>
                         </div>
                     </div>
                     }
                </Card>
            </div>
        </div>
    );
};