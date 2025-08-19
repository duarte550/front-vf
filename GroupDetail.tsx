import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, StatusIndicator, Modal, Icon } from './components';
import { ICONS } from './iconPaths';
import type { TimelineEvent, Status, Rule, EconomicGroup, Operation, PropertyGuarantee } from './types';
import { formatToMillionsBRL } from './utils';
import { fetchGroupDetails, createTimelineEvent, fetchRules, createWatchlistEvent } from './api';


interface GroupDetailsData {
    group: EconomicGroup;
    operations: Operation[];
    timeline: TimelineEvent[];
    properties: PropertyGuarantee[];
    review: { status: Status };
}

const STATUS_MAP = {
  ok: { label: 'Verde (Saudável)' },
  attention: { label: 'Amarelo (Atenção)' },
  problem: { label: 'Rosa (Problema)' },
  critical: { label: 'Vermelho (Crítico)' },
};


export default function GroupDetail({ groupId, onBack }) {
    const [details, setDetails] = useState<GroupDetailsData | null>(null);
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [activeTab, setActiveTab] = useState('Operações');
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');

    const loadDetails = async () => {
        try {
            setLoading(true);
            const [detailsData, rulesData] = await Promise.all([
                fetchGroupDetails(groupId),
                fetchRules()
            ]);
            setDetails(detailsData);
            setRules(rulesData);
        } catch (err) {
            setError('Falha ao carregar detalhes do grupo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) {
            loadDetails();
        }
    }, [groupId]);


    if (loading) return <div className="p-6 text-center">Carregando detalhes do grupo...</div>;
    if (error) return <div className="p-6 text-center text-red-400">{error}</div>;
    if (!details) return <div className="p-6">Grupo não encontrado. <Button onClick={onBack}>Voltar</Button></div>;

    const { group, review, operations, timeline, properties } = details;

    const tabs = ['Operações', 'Watchlist', 'Timeline de Eventos', 'Regras e Controles', 'Imóveis'];
    
    const TimelineTab = () => {
        const [expandedId, setExpandedId] = useState<number | null>(null);
        const [sortOrder, setSortOrder] = useState('date-desc');

        const sortedEvents = useMemo(() => {
            return [...timeline].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                switch(sortOrder) {
                    case 'date-asc': return dateA - dateB;
                    case 'resp-asc': return a.responsible.localeCompare(b.responsible);
                    case 'resp-desc': return b.responsible.localeCompare(a.responsible);
                    default: return dateB - dateA; // date-desc
                }
            });
        }, [timeline, sortOrder]);

        const handleAddEvent = async (eventData) => {
            try {
                const newEvent = await createTimelineEvent(groupId, eventData);
                setDetails(prev => ({...prev, timeline: [newEvent, ...prev.timeline]}));
                setModalOpen(false);
            } catch (error) {
                console.error("Failed to add event:", error);
                alert("Falha ao adicionar evento. Tente novamente.");
            }
        };

        return (
             <div>
                <div className="flex justify-between items-center mb-4">
                     <select onChange={e => setSortOrder(e.target.value)} value={sortOrder} className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="date-desc">Data (Mais Recente)</option>
                        <option value="date-asc">Data (Mais Antiga)</option>
                        <option value="resp-asc">Responsável (A-Z)</option>
                        <option value="resp-desc">Responsável (Z-A)</option>
                    </select>
                    <Button onClick={() => { setModalType('event'); setModalOpen(true); }}><Icon path={ICONS.plus} className="w-5 h-5 mr-2 inline"/> Adicionar Evento</Button>
                </div>
                <div className="space-y-4">
                {sortedEvents.map(event => (
                    <Card key={event.id}>
                        <div className="flex justify-between items-start">
                           <div className="flex items-start gap-4">
                            <Icon path={ICONS.eventType[event.type]} className="w-8 h-8 text-gray-400 mt-1"/>
                             <div>
                                <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString('pt-BR')}</p>
                                <h4 className="font-semibold text-white mt-1">{event.title}</h4>
                                <p className="text-gray-300 mt-1">{event.summary}</p>
                             </div>
                           </div>
                           <Button onClick={() => setExpandedId(expandedId === event.id ? null : event.id)} variant="secondary">
                                {expandedId === event.id ? 'Ver menos' : 'Detalhes'}
                           </Button>
                        </div>
                        {expandedId === event.id && (
                             <div className="mt-4 pt-4 border-t border-gray-700 ml-12">
                                 <p className="text-gray-300">{event.fullDescription}</p>
                                 <p className="text-sm text-gray-400 mt-2">Responsável: {event.responsible}</p>
                             </div>
                        )}
                    </Card>
                ))}
                </div>
                 <Modal show={isModalOpen && modalType === 'event'} onClose={() => setModalOpen(false)} title="Adicionar Novo Evento">
                    <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        const formData = new FormData(e.target as HTMLFormElement);
                        const data = Object.fromEntries(formData.entries());
                        handleAddEvent(data);
                    }}>
                        <div className="space-y-4">
                            <input name="title" type="text" placeholder="Título do Evento" className="w-full bg-gray-700 p-2 rounded" required />
                             <input name="summary" type="text" placeholder="Resumo do Evento" className="w-full bg-gray-700 p-2 rounded" required />
                            <textarea name="fullDescription" placeholder="Descrição completa" className="w-full bg-gray-700 p-2 rounded" rows={4} required></textarea>
                            <input name="responsible" type="text" placeholder="Responsável" className="w-full bg-gray-700 p-2 rounded" required />
                            <select name="type" className="w-full bg-gray-700 p-2 rounded" required>
                                <option value="reunião">Reunião</option>
                                <option value="documento">Documento</option>
                                <option value="visita">Visita</option>
                                <option value="outros">Outros</option>
                            </select>
                            <Button type="submit" className="w-full">Salvar Evento</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        )
    };

    const WatchlistTab = () => {
        const [expandedId, setExpandedId] = useState<number | null>(null);
        const [sortOrder, setSortOrder] = useState('date-desc');
        
        const sortedEvents = useMemo(() => {
             return [...timeline].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                switch(sortOrder) {
                    case 'date-asc': return dateA - dateB;
                    case 'resp-asc': return a.responsible.localeCompare(b.responsible);
                    case 'resp-desc': return b.responsible.localeCompare(a.responsible);
                    default: return dateB - dateA; // date-desc
                }
            });
        }, [timeline, sortOrder]);

        const handleAddWatchlistEvent = async (eventData) => {
            try {
                const newEvent = await createWatchlistEvent(groupId, eventData);
                setDetails(prev => ({
                    ...prev,
                    group: { ...prev.group, watchlistStatus: eventData.newStatus },
                    timeline: [newEvent, ...prev.timeline]
                }));
                setModalOpen(false);
            } catch (error) {
                console.error("Failed to add watchlist event:", error);
                alert("Falha ao adicionar evento de watchlist. Tente novamente.");
            }
        };

        return (
             <div>
                <div className="flex justify-between items-center mb-4">
                     <select onChange={e => setSortOrder(e.target.value)} value={sortOrder} className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="date-desc">Data (Mais Recente)</option>
                        <option value="date-asc">Data (Mais Antiga)</option>
                        <option value="resp-asc">Responsável (A-Z)</option>
                        <option value="resp-desc">Responsável (Z-A)</option>
                    </select>
                    <Button onClick={() => { setModalType('watchlist'); setModalOpen(true); }}><Icon path={ICONS.plus} className="w-5 h-5 mr-2 inline"/> Adicionar Acompanhamento</Button>
                </div>
                <div className="space-y-4">
                {sortedEvents.map(event => (
                    <Card key={event.id}>
                        <div className="flex justify-between items-start">
                           <div className="flex items-start gap-4">
                            <Icon path={ICONS.eventType[event.type]} className="w-8 h-8 text-gray-400 mt-1"/>
                             <div>
                                <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString('pt-BR')}</p>
                                <h4 className="font-semibold text-white mt-1">{event.title}</h4>
                                <p className="text-gray-300 mt-1">{event.summary}</p>
                             </div>
                           </div>
                           <Button onClick={() => setExpandedId(expandedId === event.id ? null : event.id)} variant="secondary">
                                {expandedId === event.id ? 'Ver menos' : 'Detalhes'}
                           </Button>
                        </div>
                        {expandedId === event.id && (
                             <div className="mt-4 pt-4 border-t border-gray-700 ml-12">
                                 <p className="text-gray-300">{event.fullDescription}</p>
                                 <p className="text-sm text-gray-400 mt-2">Responsável: {event.responsible}</p>
                             </div>
                        )}
                    </Card>
                ))}
                </div>
                 <Modal show={isModalOpen && modalType === 'watchlist'} onClose={() => setModalOpen(false)} title="Adicionar Acompanhamento de Watchlist">
                    <form onSubmit={(e) => { 
                        e.preventDefault(); 
                        const formData = new FormData(e.target as HTMLFormElement);
                        const data = Object.fromEntries(formData.entries());
                        handleAddWatchlistEvent(data);
                    }}>
                        <div className="space-y-4 text-gray-200">
                             <div>
                                <label className="block text-sm font-medium mb-1">Novo Farol de Watchlist</label>
                                <select name="newStatus" defaultValue={group.watchlistStatus} className="w-full bg-gray-700 p-2 rounded" required>
                                    {Object.entries(STATUS_MAP).map(([key, { label }]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <hr className="border-gray-600"/>
                            <p className="text-sm text-gray-400">Descreva o motivo da alteração ou o evento de acompanhamento.</p>
                            <input name="title" type="text" placeholder="Título do Evento" className="w-full bg-gray-700 p-2 rounded" required />
                            <textarea name="fullDescription" placeholder="Descrição completa do evento/motivo" className="w-full bg-gray-700 p-2 rounded" rows={4} required></textarea>
                            <input name="responsible" type="text" placeholder="Responsável" className="w-full bg-gray-700 p-2 rounded" required />
                            
                            <Button type="submit" className="w-full">Salvar e Atualizar Status</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        )
    };

    const RulesTab = () => {
        const priorityColors = {
            'Alta': 'bg-red-500/30 text-red-300',
            'Média': 'bg-yellow-500/30 text-yellow-300',
            'Baixa': 'bg-blue-500/30 text-blue-300',
        };
        return (
             <div>
                <div className="flex justify-end mb-4">
                    <Button onClick={() => { setModalType('rule'); setModalOpen(true); }}><Icon path={ICONS.plus} className="w-5 h-5 mr-2 inline"/> Adicionar Nova Regra</Button>
                </div>
                <div className="space-y-4">
                    {rules.map(rule => (
                        <Card key={rule.id}>
                            <div className="flex justify-between items-start">
                               <div>
                                 <h4 className="font-semibold text-white">{rule.name}</h4>
                                 <p className="text-sm text-gray-400 mt-1">Próxima execução: {new Date(rule.nextExecution).toLocaleDateString('pt-BR')}</p>
                                 <p className="text-gray-300 mt-2">{rule.description}</p>
                               </div>
                               <div className="text-right flex-shrink-0 ml-4">
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${priorityColors[rule.priority]}`}>{rule.priority}</span>
                                  <p className="text-sm text-gray-400 mt-2">{rule.frequency}</p>
                               </div>
                            </div>
                        </Card>
                    ))}
                </div>
                 <Modal show={isModalOpen && modalType === 'rule'} onClose={() => setModalOpen(false)} title="Adicionar Nova Regra">
                    <p>Formulário para adicionar regra...</p>
                    <Button onClick={() => setModalOpen(false)} className="mt-4">Fechar</Button>
                </Modal>
            </div>
        );
    }
    
    const TabContent = () => {
        const [expandedOpId, setExpandedOpId] = useState<string | null>(null);

        switch(activeTab) {
            case 'Operações': return (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700 text-gray-400 text-sm">
                            <tr>
                                <th className="p-3 w-4"></th>
                                <th className="p-3 whitespace-nowrap">Operação</th>
                                <th className="p-3 whitespace-nowrap">Volume</th>
                                <th className="p-3 whitespace-nowrap">Rating</th>
                                <th className="p-3 whitespace-nowrap">Vencimento</th>
                                <th className="p-3 whitespace-nowrap">Próxima PMT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operations.map(op => {
                                const isExpanded = expandedOpId === op.id;
                                const titulosForOp = op.titulos || [];

                                return (
                                <React.Fragment key={op.id}>
                                    <tr className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer" onClick={() => setExpandedOpId(isExpanded ? null : op.id)}>
                                        <td className="p-3 text-center">
                                            {titulosForOp.length > 0 && <Icon path={isExpanded ? ICONS.chevronUp : ICONS.chevronDown} className="w-5 h-5 text-gray-400" />}
                                        </td>
                                        <td className="p-3 font-medium text-white whitespace-nowrap">{op.id}</td>
                                        <td className="p-3 whitespace-nowrap">{Number(op.volume).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                        <td className="p-3 whitespace-nowrap">{op.rating}</td>
                                        <td className="p-3 whitespace-nowrap">{new Date(op.dueDate).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-3 whitespace-nowrap">{new Date(op.nextPmt).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                    {isExpanded && titulosForOp.length > 0 && (
                                    <tr className="bg-gray-900/50">
                                        <td colSpan={6} className="p-0">
                                            <div className="p-4 mx-4 my-2 border-l-2 border-blue-500 space-y-4">
                                                <div>
                                                    <h5 className="text-md font-semibold text-white mb-2">Descrição da Operação</h5>
                                                    <p className="text-gray-400 text-sm">{op.description}</p>
                                                </div>
                                                <div>
                                                    <h5 className="text-md font-semibold text-white mb-3">Títulos da Operação</h5>
                                                    <table className="w-full text-left text-sm">
                                                        <thead className="text-gray-400">
                                                            <tr>
                                                                <th className="pb-2 font-medium">Cód. CETIP</th>
                                                                <th className="pb-2 font-medium">Indexador</th>
                                                                <th className="pb-2 font-medium">Taxa</th>
                                                                <th className="pb-2 font-medium">Rating</th>
                                                                <th className="pb-2 font-medium">Securitizadora</th>
                                                                <th className="pb-2 font-medium">Ag. Fiduciário</th>
                                                                <th className="pb-2 font-medium text-right">Volume Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {titulosForOp.map(titulo => (
                                                                <tr key={titulo.id} className="border-b border-gray-700/50">
                                                                    <td className="py-2">{titulo.codigo_cetip}</td>
                                                                    <td className="py-2">{titulo.indexador}</td>
                                                                    <td className="py-2">{titulo.taxa}</td>
                                                                    <td className="py-2">{titulo.rating}</td>
                                                                    <td className="py-2">{titulo.securitizadora}</td>
                                                                    <td className="py-2">{titulo.agente_fiduciario}</td>
                                                                    <td className="py-2 text-right">{Number(titulo.volume_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    )}
                                </React.Fragment>
                            )})}
                        </tbody>
                    </table>
                </div>
            );
            case 'Imóveis':
                if (properties.length === 0) {
                    return <p className="text-gray-400 p-3">Nenhum imóvel encontrado para este grupo.</p>;
                }
                return (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-700 text-gray-400 text-sm">
                                <tr>
                                    <th className="p-3 whitespace-nowrap">Operação</th>
                                    <th className="p-3 whitespace-nowrap">Imóvel</th>
                                    <th className="p-3 whitespace-nowrap">Endereço</th>
                                    <th className="p-3 whitespace-nowrap">Último Valor de Avaliação</th>
                                    <th className="p-3 whitespace-nowrap">Tipo de Garantia</th>
                                    <th className="p-3 whitespace-nowrap">Última Visita</th>
                                    <th className="p-3 whitespace-nowrap">Último Laudo</th>
                                    <th className="p-3 whitespace-nowrap">Periodicidade Laudo</th>
                                    <th className="p-3 whitespace-nowrap">Periodicidade Visita</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(prop => (
                                    <tr key={prop.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-3 whitespace-nowrap">{prop.operationId}</td>
                                        <td className="p-3 font-medium text-white whitespace-nowrap">{prop.propertyName}</td>
                                        <td className="p-3 whitespace-nowrap">{prop.address}</td>
                                        <td className="p-3 whitespace-nowrap">{formatToMillionsBRL(Number(prop.lastAppraisalValue))}</td>
                                        <td className="p-3 whitespace-nowrap">{prop.guaranteeType}</td>
                                        <td className="p-3 whitespace-nowrap">{new Date(prop.lastVisitDate).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-3 whitespace-nowrap">{new Date(prop.lastAppraisalDate).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-3 whitespace-nowrap">{prop.appraisalFrequency}</td>
                                        <td className="p-3 whitespace-nowrap">{prop.visitFrequency}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'Timeline de Eventos': return <TimelineTab />;
            case 'Regras e Controles': return <RulesTab />;
            case 'Watchlist': return <WatchlistTab />;
            default: return <p>Conteúdo para {activeTab}</p>;
        }
    }

    return (
        <div className="p-6 space-y-6">
            <button onClick={onBack} className="text-blue-400 hover:underline flex items-center">
                <Icon path={ICONS.chevronLeft} className="w-5 h-5 mr-1"/> Voltar para Grupos Econômicos
            </button>
            <h2 className="text-2xl font-bold text-white">{group.name}</h2>

            <Card>
                <h3 className="text-md font-semibold text-gray-300 mb-2">Descrição do Grupo</h3>
                <p className="text-gray-400">{group.description}</p>
            </Card>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><h3 className="text-gray-400 text-sm">Volume Total</h3><p className="text-xl font-bold">{Number(group.currentVolume).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></Card>
                <Card><h3 className="text-gray-400 text-sm">Rating</h3><p className="text-xl font-bold">{group.rating}</p></Card>
                <Card><h3 className="text-gray-400 text-sm">Próxima Revisão</h3><p className="text-xl font-bold">{new Date(group.nextReviewDate).toLocaleDateString('pt-BR')}</p></Card>
                <Card>
                    <h3 className="text-gray-400 text-sm mb-2">Status Consolidado</h3>
                    <div className="flex justify-around items-center h-full">
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-xs text-gray-300">Revisão</span>
                            <StatusIndicator status={review.status} />
                        </div>
                        <div className="h-8 w-px bg-gray-600"></div>
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-xs text-gray-300">Seguros</span>
                            <StatusIndicator status={group.insuranceStatus} />
                        </div>
                        <div className="h-8 w-px bg-gray-600"></div>
                        <div className="flex flex-col items-center space-y-1">
                            <span className="text-xs text-gray-300">Visitas</span>
                            <StatusIndicator status={group.visitStatus} />
                        </div>
                    </div>
                </Card>
            </div>
            
            <Card>
                <div className="border-b border-gray-700 mb-4">
                    <nav className="-mb-px flex space-x-6">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <div>
                  <TabContent/>
                </div>
            </Card>
        </div>
    );
};