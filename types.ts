// --- TYPES ---

export type Page = 'Início' | 'Grupos Econômicos' | 'Eventos e Tarefas' | 'Revisões' | 'Watchlist' | 'Seguros' | 'Laudos de Avaliação' | 'Visitas' | 'Covenants Recebíveis' | 'Covenants Financeiros' | 'Relatórios' | 'Configurações' | 'Resultados da Busca';

export type Status = 'ok' | 'attention' | 'problem' | 'critical';
export type Priority = 'Alta' | 'Média' | 'Baixa';
export type EventType = 'reunião' | 'documento' | 'visita' | 'outros' | 'watchlist';

export interface EconomicGroup {
  id: number;
  name: string;
  description: string;
  watchlistStatus: Status;
  currentVolume: number;
  insuranceStatus: Status;
  visitStatus: Status;
  nextReviewDate: string;
  rating: string;
  covenantsStatus: Status;
}

export interface Operation {
  id: string;
  groupId: number;
  description: string;
  volume: number;
  rating: string;
  dueDate: string;
  nextPmt: string;
  guarantees: string;
  titulos?: Titulo[];
}

export interface Titulo {
    id: number;
    operationId: string;
    codigo_cetip: string;
    indexador: string;
    taxa: string;
    rating: string;
    vencimento: string;
    nextPmt: string;
    securitizadora: string;
    agente_fiduciario: string;
    volume_total: number;
}

export interface TimelineEvent {
    id: number;
    groupId: number;
    date: string;
    title: string;
    summary: string;
    fullDescription: string;
    responsible: string;
    type: EventType;
}

export interface Rule {
    id: number;
    name: string;
    nextExecution: string;
    description: string;
    frequency: string;
    priority: Priority;
    status: 'Ativa' | 'Inativa';
}

export interface Review {
    id: number;
    groupId: number;
    groupName: string;
    rating: string;
    lastReviewDate: string;
    nextReviewDate: string;
    status: Status;
    responsible: string;
    currentVolume: number;
}

export interface Visit {
    id: number;
    groupId: number;
    groupName: string;
    properties: string;
    lastVisitDate: string;
    nextVisitDate: string;
    frequency: string;
    status: 'Em dia' | 'Agendada' | 'Atrasada';
}

export interface Insurance {
    id: number;
    groupId: number;
    groupName: string;
    operationId: string;
    property: string;
    insurer: string;
    value: number;
    expirationDate: string;
}

export interface Appraisal {
    id: number;
    groupId: number;
    groupName: string;
    operationId: string;
    property: string;
    appraiser: string;
    value: number;
    date: string;
}

export interface PropertyGuarantee {
    id: number;
    groupId: number;
    operationId: string;
    propertyName: string;
    address: string;
    lastAppraisalValue: number;
    guaranteeType: 'AF' | 'AF de Cotas' | 'CF';
    lastVisitDate: string;
    lastAppraisalDate: string;
    appraisalFrequency: string;
    visitFrequency: string;
}

// --- SEARCH TYPES ---

export interface SearchResultItem {
  id: number | string;
  type: 'Grupo Econômico' | 'Evento';
  title: string;
  snippet: string;
  groupId: number;
}

export interface SearchResults {
    groups: SearchResultItem[];
    events: SearchResultItem[];
}