import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Modal, Icon, PageLink } from './components';
import { ICONS } from './iconPaths';
import { fetchEventsAndTasks, createTask, fetchEconomicGroups } from './api';
import type { EconomicGroup } from './types';

export default function EventsAndTasksPage({ onViewGroup }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('Todos');
    const [isModalOpen, setModalOpen] = useState(false);
    const [allEvents, setAllEvents] = useState([]);
    const [groups, setGroups] = useState<EconomicGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const loadEvents = async () => {
        try {
            setLoading(true);
             const [eventsData, groupsData] = await Promise.all([
                fetchEventsAndTasks(),
                fetchEconomicGroups()
            ]);
            setAllEvents(eventsData);
            setGroups(groupsData);
        } catch (err) {
            setError('Falha ao carregar eventos e tarefas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);
    
    const eventsByDate = useMemo(() => {
        return allEvents.reduce((acc, event) => {
            const dateStr = event.date.split('T')[0];
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(event);
            return acc;
        }, {});
    }, [allEvents]);

    const filteredEvents = useMemo(() => {
        let events = allEvents;
        if (selectedDate) {
            events = events.filter(e => e.date.split('T')[0] === selectedDate);
        }
        if (filterType !== 'Todos') {
            events = events.filter(e => e.type === filterType);
        }
        return events;
    }, [allEvents, selectedDate, filterType]);
    
    const handleAddTask = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        
        try {
            await createTask(data);
            setModalOpen(false);
            loadEvents(); // Recarrega os eventos para incluir a nova tarefa
        } catch (err) {
            console.error(err);
            alert('Falha ao criar a tarefa.');
        }
    }

    const changeMonth = (offset) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const FullCalendar = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
        const today = new Date();
        
        const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
        const emptyDays = Array.from({length: firstDayOfMonth});

        return (
             <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-700"><Icon path={ICONS.chevronLeft}/></button>
                    <h4 className="font-semibold text-white text-lg capitalize">{monthName} {year}</h4>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-700"><Icon path={ICONS.chevronRight}/></button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2 font-medium">
                    <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
                </div>
                <div className="grid grid-cols-7">
                    {emptyDays.map((_, i) => <div key={`empty-${i}`}></div>)}
                    {days.map(day => {
                        const date = new Date(year, month, day);
                        
                        const y = date.getFullYear();
                        const m = String(date.getMonth() + 1).padStart(2, '0');
                        const d = String(date.getDate()).padStart(2, '0');
                        const dateStr = `${y}-${m}-${d}`;

                        const hasEvent = !!eventsByDate[dateStr];
                        const isToday = date.toDateString() === today.toDateString();
                        const isSelected = dateStr === selectedDate;
                        
                        const dayClasses = `
                            flex items-center justify-center h-12 w-12 rounded-full cursor-pointer transition-colors relative
                            ${isSelected ? 'bg-blue-600 text-white' : ''}
                            ${!isSelected && isToday ? 'bg-gray-600 text-white' : ''}
                            ${!isSelected && !isToday ? 'hover:bg-gray-700' : ''}
                        `;
                        
                        return (
                            <div key={day} className="flex justify-center items-center py-1" onClick={() => setSelectedDate(isSelected ? null : dateStr)}>
                                <div className={dayClasses}>
                                    {day}
                                    {hasEvent && <span className="absolute bottom-2 h-1.5 w-1.5 bg-yellow-400 rounded-full"></span>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
    
    return (
        <>
            <Modal show={isModalOpen} onClose={() => setModalOpen(false)} title="Adicionar Nova Tarefa">
                <form onSubmit={handleAddTask} className="space-y-4">
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Data</label>
                        <input type="date" name="date" id="date" required className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label htmlFor="groupId" className="block text-sm font-medium text-gray-300 mb-1">Grupo Econômico</label>
                        <select name="groupId" id="groupId" required className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                           <option value="">Selecione um grupo</option>
                           {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">Prioridade</label>
                            <select name="priority" id="priority" required className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                                <option>Baixa</option>
                                <option>Média</option>
                                <option>Alta</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
                            <select name="type" id="type" required className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                                <option>Reunião</option>
                                <option>Documento</option>
                                <option>Visita</option>
                                <option>Outros</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="responsible" className="block text-sm font-medium text-gray-300 mb-1">Responsável</label>
                        <input type="text" name="responsible" id="responsible" placeholder="Nome do responsável" required className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Título/Descrição</label>
                        <textarea name="title" id="title" rows={3} placeholder="Descreva a tarefa..." required className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div className="pt-2">
                        <Button type="submit" className="w-full">Salvar Tarefa</Button>
                    </div>
                </form>
            </Modal>
            <div className="p-6 grid grid-cols-1 xl:grid-cols-5 gap-6 h-full">
                <Card className="xl:col-span-3">
                    {loading ? <div className="text-center p-10">Carregando calendário...</div> : <FullCalendar/>}
                </Card>
                <div className="xl:col-span-2 flex flex-col gap-6">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-semibold text-white">Filtros</h3>
                             <Button onClick={() => setModalOpen(true)} size="sm"><Icon path={ICONS.plus} className="w-4 h-4 mr-2"/> Adicionar Tarefa</Button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {['Todos', 'Revisão', 'Visita', 'Regra', 'Tarefa'].map(type => (
                                <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1 text-sm rounded-full ${filterType === type ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{type}</button>
                            ))}
                        </div>
                    </Card>
                    <Card className="flex-grow overflow-y-auto">
                        <h3 className="text-lg font-semibold text-white mb-4">{selectedDate ? `Eventos para ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}` : 'Próximos Eventos'}</h3>
                        <div className="space-y-3">
                        {loading ? <p className="text-gray-400">Carregando eventos...</p> : 
                         error ? <p className="text-red-400">{error}</p> :
                         filteredEvents.length > 0 ? filteredEvents.map(event => (
                            <div key={event.id} className="p-3 bg-gray-700/50 rounded-md flex items-start gap-4">
                                <Icon path={event.icon} className="w-6 h-6 text-blue-400 mt-1"/>
                                <div>
                                    <p className="font-semibold text-white">{event.title}</p>
                                    {event.groupId ? (
                                        <PageLink onClick={(e) => { e.preventDefault(); onViewGroup(event.groupId); }}>{event.groupName}</PageLink>
                                    ) : (
                                        <p className="text-sm text-gray-400">{event.groupName}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">{new Date(event.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-400">Nenhum evento encontrado para a seleção atual.</p>
                        )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};
