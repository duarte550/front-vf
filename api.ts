import type { EconomicGroup, Operation, TimelineEvent, Rule, Review, Visit, Insurance, Appraisal, PropertyGuarantee, Titulo, SearchResults } from './types';
import { MOCK_DATA } from './data';
import { ICONS } from './iconPaths';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kineacrm.azurewebsites.net/api';

async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Network response was not ok');
    }
    return response.json();
}

async function getMockData(key: string, delay = 300, ...args: any[]) {
    console.log(`[Frontend Test Mode] Fetching mock data for: ${key}`);
    const dataOrFn = MOCK_DATA[key];
    const data = typeof dataOrFn === 'function' ? dataOrFn(...args) : dataOrFn;
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));
}

// Ensure a default mode is set if none exists. Default is now 'complete'.
if (!localStorage.getItem('appMode')) {
    localStorage.setItem('appMode', 'complete');
}

const isTestMode = () => localStorage.getItem('appMode') === 'frontend-test';

// --- API Functions ---

export const fetchEconomicGroups = async (): Promise<EconomicGroup[]> => {
    if (isTestMode()) return getMockData('economicGroups') as Promise<EconomicGroup[]>;
    const response = await fetch(`${API_BASE_URL}/economic-groups`);
    return handleResponse(response);
};

export const fetchGroupDetails = async (id: number) => {
    if (isTestMode()) return getMockData('groupDetails', 300, id);
    const response = await fetch(`${API_BASE_URL}/economic-groups/${id}/details`);
    return handleResponse(response);
};

export const createTimelineEvent = async (groupId: number, eventData: any): Promise<TimelineEvent> => {
    if (isTestMode()) {
        const newEvent = { ...eventData, id: Date.now(), groupId, date: new Date().toISOString() };
        MOCK_DATA.timeline.unshift(newEvent);
        return Promise.resolve(newEvent as TimelineEvent);
    }
    const response = await fetch(`${API_BASE_URL}/economic-groups/${groupId}/timeline-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
};

export const createWatchlistEvent = async (groupId: number, eventData: any): Promise<TimelineEvent> => {
     if (isTestMode()) {
        const newEvent = { ...eventData, id: Date.now(), groupId, date: new Date().toISOString(), type: 'watchlist' };
        MOCK_DATA.timeline.unshift(newEvent);
        const group = MOCK_DATA.economicGroups.find(g => g.id === groupId);
        if (group) group.watchlistStatus = eventData.newStatus;
        return Promise.resolve(newEvent as TimelineEvent);
    }
    const response = await fetch(`${API_BASE_URL}/economic-groups/${groupId}/watchlist-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
};

export const fetchReviews = async (): Promise<Review[]> => {
    if (isTestMode()) return getMockData('reviews') as Promise<Review[]>;
    const response = await fetch(`${API_BASE_URL}/reviews`);
    return handleResponse(response);
}

export const fetchVisits = async (): Promise<Visit[]> => {
    if (isTestMode()) return getMockData('visits') as Promise<Visit[]>;
    const response = await fetch(`${API_BASE_URL}/visits`);
    return handleResponse(response);
}

export const fetchInsurances = async (): Promise<Insurance[]> => {
    if (isTestMode()) return getMockData('insurances') as Promise<Insurance[]>;
    const response = await fetch(`${API_BASE_URL}/insurances`);
    return handleResponse(response);
}

export const fetchAppraisals = async (): Promise<Appraisal[]> => {
    if (isTestMode()) return getMockData('appraisals') as Promise<Appraisal[]>;
    const response = await fetch(`${API_BASE_URL}/appraisals`);
    return handleResponse(response);
}

export const fetchWatchlistSummary = async () => {
    if (isTestMode()) return getMockData('watchlistSummary');
    const response = await fetch(`${API_BASE_URL}/watchlist/summary`);
    return handleResponse(response);
}

export const fetchWatchlistGroups = async () => {
    if (isTestMode()) return getMockData('watchlistGroups');
    const response = await fetch(`${API_BASE_URL}/watchlist`);
    return handleResponse(response);
}

export const fetchDashboardData = async () => {
    if (isTestMode()) return getMockData('dashboard');
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    return handleResponse(response);
}

export const fetchEventsAndTasks = async () => {
    if (isTestMode()) return getMockData('events');
    const response = await fetch(`${API_BASE_URL}/events`);
    return handleResponse(response);
}

export const createTask = async (taskData: any) => {
    if (isTestMode()) {
         const newEvent = { ...taskData, id: `task-${Date.now()}`, type: 'Tarefa', icon: ICONS.task };
         MOCK_DATA.events.push(newEvent);
         return Promise.resolve(newEvent);
    }
    const response = await fetch(`${API_BASE_URL}/events/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
    return handleResponse(response);
}

export const fetchRules = async (): Promise<Rule[]> => {
    if (isTestMode()) return getMockData('rules') as Promise<Rule[]>;
    const response = await fetch(`${API_BASE_URL}/rules`);
    return handleResponse(response);
}

export const performGlobalSearch = async (term: string): Promise<SearchResults> => {
    if (isTestMode()) {
        const lowerCaseTerm = term.toLowerCase();
        const results: SearchResults = {
            groups: [],
            events: [],
        };

        MOCK_DATA.economicGroups.forEach(group => {
            if (group.name.toLowerCase().includes(lowerCaseTerm) || group.description.toLowerCase().includes(lowerCaseTerm)) {
                results.groups.push({
                    id: group.id,
                    type: 'Grupo Econômico',
                    title: group.name,
                    snippet: group.description,
                    groupId: group.id,
                });
            }
        });

        MOCK_DATA.timeline.forEach(event => {
            if (event.title.toLowerCase().includes(lowerCaseTerm) || event.summary.toLowerCase().includes(lowerCaseTerm)) {
                const group = MOCK_DATA.economicGroups.find(g => g.id === event.groupId);
                results.events.push({
                    id: event.id,
                    type: 'Evento',
                    title: event.title,
                    snippet: group ? group.name : 'Grupo desconhecido',
                    groupId: event.groupId,
                });
            }
        });
        
        return getMockData('search', 300, results) as Promise<SearchResults>;
    }
    const response = await fetch(`${API_BASE_URL}/search?term=${encodeURIComponent(term)}`);
    return handleResponse(response);
};

export const fetchReportsData = async () => {
    // Relatórios são sempre buscados do backend, pois não faz sentido mockar uma query analítica.
    const response = await fetch(`${API_BASE_URL}/reports/volume-by-rating`);
    return handleResponse(response);
};