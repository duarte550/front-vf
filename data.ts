import type { EconomicGroup, Operation, TimelineEvent, Rule, Review, Visit, Insurance, Appraisal, PropertyGuarantee, Titulo, Status } from './types';
import { ICONS as ICON_PATHS } from './iconPaths'; // Renamed to avoid conflict

// --- ICONS ---

export const ICONS = ICON_PATHS;


// --- MOCK DATA for Frontend Test Mode ---

const MOCK_ECONOMIC_GROUPS: EconomicGroup[] = [
    { id: 1, name: 'Grupo Alfa (Mock)', description: 'Descrição mock para Grupo Alfa.', watchlistStatus: 'ok', currentVolume: 12500000, insuranceStatus: 'ok', visitStatus: 'ok', nextReviewDate: '2024-09-15T00:00:00Z', rating: 'AAA', covenantsStatus: 'ok' },
    { id: 2, name: 'Empresa Beta (Mock)', description: 'Descrição mock para Empresa Beta.', watchlistStatus: 'problem', currentVolume: 8200000, insuranceStatus: 'critical', visitStatus: 'attention', nextReviewDate: '2024-08-20T00:00:00Z', rating: 'AA-', covenantsStatus: 'ok' },
    { id: 3, name: 'Holdings Gama (Mock)', description: 'Descrição mock para Holdings Gama.', watchlistStatus: 'ok', currentVolume: 25000000, insuranceStatus: 'ok', visitStatus: 'ok', nextReviewDate: '2024-11-01T00:00:00Z', rating: 'A+', covenantsStatus: 'attention' },
    { id: 4, name: 'Consórcio Delta (Mock)', description: 'Descrição mock para Consórcio Delta.', watchlistStatus: 'critical', currentVolume: 4500000, insuranceStatus: 'attention', visitStatus: 'ok', nextReviewDate: '2024-07-30T00:00:00Z', rating: 'B', covenantsStatus: 'critical' },
    { id: 5, name: 'Investimentos Épsilon (Mock)', description: 'Descrição mock para Investimentos Épsilon.', watchlistStatus: 'ok', currentVolume: 15000000, insuranceStatus: 'ok', visitStatus: 'ok', nextReviewDate: '2025-01-10T00:00:00Z', rating: 'AAA', covenantsStatus: 'ok' },
];

export const MOCK_OPERATIONS: Operation[] = [
    { id: '102.812.333-4', groupId: 1, description: 'CRI para financiamento de capital de giro (Mock)', volume: 5000000, rating: 'AAA', dueDate: '2026-05-20T00:00:00Z', nextPmt: '2024-08-15T00:00:00Z', guarantees: 'Recebíveis', titulos: [
        { id: 1, operationId: '102.812.333-4', codigo_cetip: 'MOCK-C1', indexador: 'CDI', taxa: '110%', rating: 'AAA', vencimento: '2026-05-20T00:00:00Z', nextPmt: '2024-08-15T00:00:00Z', securitizadora: 'Habitasec', agente_fiduciario: 'Oliveira Trust', volume_total: 2500000 },
        { id: 2, operationId: '102.812.333-4', codigo_cetip: 'MOCK-C2', indexador: 'CDI', taxa: '110%', rating: 'AAA', vencimento: '2026-05-20T00:00:00Z', nextPmt: '2024-08-15T00:00:00Z', securitizadora: 'Habitasec', agente_fiduciario: 'Oliveira Trust', volume_total: 2500000 }
    ]},
    { id: '102.812.456-7', groupId: 1, description: 'CRI lastreado em contratos de aluguel (Mock)', volume: 7500000, rating: 'AA+', dueDate: '2025-11-10T00:00:00Z', nextPmt: '2024-08-10T00:00:00Z', guarantees: 'Imóveis', titulos: []},
    { id: '102.333.444-5', groupId: 2, description: 'Operação de Capital de Giro (Mock)', volume: 8200000, rating: 'AA-', dueDate: '2027-01-01T00:00:00Z', nextPmt: '2024-08-25T00:00:00Z', guarantees: 'Recebíveis', titulos: [] },
    { id: '102.111.222-3', groupId: 4, description: 'Financiamento de Obra Pública (Mock)', volume: 4500000, rating: 'B', dueDate: '2025-03-15T00:00:00Z', nextPmt: '2024-08-30T00:00:00Z', guarantees: 'Imóveis', titulos: [] },
];

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
    { id: 1, groupId: 1, date: '2024-07-20T00:00:00Z', title: 'Reunião de Acompanhamento (Mock)', summary: 'Discussão sobre performance do Q2.', fullDescription: 'Descrição completa da reunião.', responsible: 'João Silva', type: 'reunião' },
    { id: 2, groupId: 1, date: '2024-07-15T00:00:00Z', title: 'Recebimento de Documentação (Mock)', summary: 'Balanço do Q2 recebido.', fullDescription: 'Descrição completa do documento.', responsible: 'Ana Costa', type: 'documento' },
    { id: 3, groupId: 2, date: '2024-07-18T00:00:00Z', title: 'Visita Técnica (Mock)', summary: 'Inspeção de garantias.', fullDescription: 'Descrição completa da visita.', responsible: 'Carlos Pereira', type: 'visita' },
    { id: 4, groupId: 4, date: '2024-07-18T00:00:00Z', title: 'Evento de Watchlist (Mock)', summary: 'Status alterado para Crítico.', fullDescription: 'Descrição completa do evento de watchlist.', responsible: 'Sistema', type: 'watchlist' },
];

const MOCK_PROPERTIES: PropertyGuarantee[] = [
    { id: 1, groupId: 1, operationId: '102.812.456-7', propertyName: 'Sede Administrativa (Mock)', address: 'Av. Paulista, 1000', lastAppraisalValue: 15000000, guaranteeType: 'AF', lastVisitDate: '2024-01-20T00:00:00Z', lastAppraisalDate: '2024-01-10T00:00:00Z', appraisalFrequency: 'Bienal', visitFrequency: 'Anual' },
    { id: 2, groupId: 2, operationId: '102.333.444-5', propertyName: 'Parque Fabril (Mock)', address: 'Rod. Anhanguera, km 50', lastAppraisalValue: 9500000, guaranteeType: 'AF', lastVisitDate: '2024-05-10T00:00:00Z', lastAppraisalDate: '2023-11-20T00:00:00Z', appraisalFrequency: 'Bienal', visitFrequency: 'Semestral' },
];

const MOCK_REVIEWS: Review[] = [
    { id: 1, groupId: 1, groupName: 'Grupo Alfa (Mock)', rating: 'AAA', lastReviewDate: '2023-09-15T00:00:00Z', nextReviewDate: '2024-09-15T00:00:00Z', status: 'ok', responsible: 'Ana Costa', currentVolume: 12500000 },
    { id: 2, groupId: 2, groupName: 'Empresa Beta (Mock)', rating: 'AA-', lastReviewDate: '2023-08-20T00:00:00Z', nextReviewDate: '2024-08-20T00:00:00Z', status: 'attention', responsible: 'João Silva', currentVolume: 8200000 },
    { id: 3, groupId: 4, groupName: 'Consórcio Delta (Mock)', rating: 'B', lastReviewDate: '2023-07-30T00:00:00Z', nextReviewDate: '2024-07-30T00:00:00Z', status: 'critical', responsible: 'Carlos Pereira', currentVolume: 4500000 },
];

const MOCK_RULES: Rule[] = [
    { id: 1, name: 'Verificar Apólice de Seguro (Mock)', nextExecution: '2024-08-01T00:00:00Z', description: 'Garantir que a apólice de seguro para as garantias esteja ativa.', frequency: 'Mensal', priority: 'Alta', status: 'Ativa' },
    { id: 2, name: 'Analisar Balancete Mensal (Mock)', nextExecution: '2024-08-10T00:00:00Z', description: 'Receber e analisar o balancete contábil.', frequency: 'Mensal', priority: 'Média', status: 'Ativa' },
];

const MOCK_VISITS: Visit[] = [
    { id: 1, groupId: 1, groupName: 'Grupo Alfa (Mock)', properties: 'Sede Administrativa', lastVisitDate: '2024-01-20T00:00:00Z', nextVisitDate: '2025-01-20T00:00:00Z', frequency: 'Anual', status: 'Em dia' },
    { id: 2, groupId: 2, groupName: 'Empresa Beta (Mock)', properties: 'Parque Fabril', lastVisitDate: '2024-05-10T00:00:00Z', nextVisitDate: '2024-11-10T00:00:00Z', frequency: 'Semestral', status: 'Agendada' },
    { id: 3, groupId: 4, groupName: 'Consórcio Delta (Mock)', properties: 'Galpão Logístico', lastVisitDate: '2023-06-15T00:00:00Z', nextVisitDate: '2024-06-15T00:00:00Z', frequency: 'Anual', status: 'Atrasada' },
];

const MOCK_INSURANCES: Insurance[] = [
    { id: 1, groupId: 1, groupName: 'Grupo Alfa (Mock)', operationId: '102.812.456-7', property: 'Sede Administrativa', insurer: 'Porto Seguro', value: 10000000, expirationDate: '2025-06-30T00:00:00Z' },
    { id: 2, groupId: 4, groupName: 'Consórcio Delta (Mock)', operationId: '102.111.222-3', property: 'Galpão Logístico', insurer: 'Allianz', value: 5000000, expirationDate: '2024-09-15T00:00:00Z' },
    { id: 3, groupId: 2, groupName: 'Empresa Beta (Mock)', operationId: '102.333.444-5', property: 'Parque Fabril', insurer: 'Tokio Marine', value: 8000000, expirationDate: '2024-08-25T00:00:00Z' },
];

const MOCK_APPRAISALS: Appraisal[] = [
    { id: 1, groupId: 1, groupName: 'Grupo Alfa (Mock)', operationId: '102.812.456-7', property: 'Sede Administrativa', appraiser: 'CBRE', value: 15000000, date: '2024-01-10T00:00:00Z' },
    { id: 2, groupId: 4, groupName: 'Consórcio Delta (Mock)', operationId: '102.111.222-3', property: 'Galpão Logístico', appraiser: 'JLL', value: 6000000, date: '2022-10-01T00:00:00Z' },
];

const MOCK_DASHBOARD_DATA = {
    metrics: [
        { title: 'Volume total de operações saudáveis', value: 'R$ 52,5M' },
        { title: 'Volume total de operações watchlist', value: 'R$ 12,7M' },
        { title: 'Total de operações', value: '5' },
        { title: 'Eventos do mês', value: '8' },
        { title: 'Tarefas em atraso', value: '2' },
    ],
    upcomingEvents: [
        { title: 'Próxima Revisão - Consórcio Delta (Mock)', date: '2024-07-30T00:00:00Z' },
        { title: 'Verificar Apólice de Seguro (Mock)', date: '2024-08-01T00:00:00Z' },
        { title: 'Próxima Revisão - Empresa Beta (Mock)', date: '2024-08-20T00:00:00Z' },
    ]
};

const MOCK_EVENTS_AND_TASKS = [
     { id: 'rev-2', date: '2024-08-20T00:00:00Z', title: 'Revisão', groupName: 'Empresa Beta (Mock)', groupId: 2, type: 'Revisão', icon: ICONS.reviews },
     { id: 'rev-1', date: '2024-09-15T00:00:00Z', title: 'Revisão', groupName: 'Grupo Alfa (Mock)', groupId: 1, type: 'Revisão', icon: ICONS.reviews },
     { id: 'vis-2', date: '2024-11-10T00:00:00Z', title: 'Visita', groupName: 'Empresa Beta (Mock)', groupId: 2, type: 'Visita', icon: ICONS.visits },
     { id: 'rul-1', date: '2024-08-01T00:00:00Z', title: 'Verificar Apólice de Seguro (Mock)', groupName: 'Sistema', groupId: null, type: 'Regra', icon: ICONS.settings },
     { id: 'task-1', date: '2024-08-22T00:00:00Z', title: 'Coletar balancete (Mock)', groupName: 'Grupo Alfa (Mock)', groupId: 1, type: 'Tarefa', icon: ICONS.task },
];

export const MOCK_DATA = {
    economicGroups: MOCK_ECONOMIC_GROUPS,
    operations: MOCK_OPERATIONS,
    timeline: MOCK_TIMELINE_EVENTS,
    reviews: MOCK_REVIEWS,
    visits: MOCK_VISITS,
    insurances: MOCK_INSURANCES,
    appraisals: MOCK_APPRAISALS,
    rules: MOCK_RULES,
    dashboard: MOCK_DASHBOARD_DATA,
    events: MOCK_EVENTS_AND_TASKS,
    watchlistSummary: {
        ok: MOCK_ECONOMIC_GROUPS.filter(g => g.watchlistStatus === 'ok').length,
        attention: MOCK_ECONOMIC_GROUPS.filter(g => g.watchlistStatus === 'attention' || g.watchlistStatus === 'problem').length,
        critical: MOCK_ECONOMIC_GROUPS.filter(g => g.watchlistStatus === 'critical').length,
    },
    watchlistGroups: MOCK_ECONOMIC_GROUPS
        .filter(g => g.watchlistStatus !== 'ok')
        .map(g => ({...g, lastObservation: 'Observação mock de watchlist.'})),
    groupDetails: (id: number) => {
        const group = MOCK_ECONOMIC_GROUPS.find(g => g.id === id);
        if (!group) return null;
        return {
            group,
            operations: MOCK_OPERATIONS.filter(op => op.groupId === id),
            timeline: MOCK_TIMELINE_EVENTS.filter(e => e.groupId === id),
            properties: MOCK_PROPERTIES.filter(p => p.groupId === id),
            review: MOCK_REVIEWS.find(r => r.groupId === id) || { status: 'ok' as Status }
        }
    }
}