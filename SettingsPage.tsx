import React, { useState } from 'react';
import { Card } from './components';

export default function SettingsPage() {
    // Default to 'complete' if nothing is set.
    const [currentMode, setCurrentMode] = useState(() => localStorage.getItem('appMode') || 'complete');

    const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMode = event.target.value;
        setCurrentMode(newMode);
        localStorage.setItem('appMode', newMode);
        // Reload to apply changes globally
        window.location.reload();
    };

    return (
        <div className="p-6">
            <Card>
                <h2 className="text-2xl font-bold text-white mb-4">Configurações</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Modo de Operação</h3>
                        <p className="text-gray-400 mb-4">
                            Selecione o modo de operação da aplicação. A página será recarregada após a alteração.
                        </p>
                        <fieldset className="space-y-3">
                            <legend className="sr-only">Modo de Operação</legend>
                            <div className="flex items-center gap-4 p-4 rounded-md bg-gray-700/50 border border-gray-700">
                                <input
                                    id="complete-mode"
                                    name="operation-mode"
                                    type="radio"
                                    value="complete"
                                    checked={currentMode === 'complete'}
                                    onChange={handleModeChange}
                                    className="h-4 w-4 text-blue-600 bg-gray-900 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                                />
                                <label htmlFor="complete-mode" className="text-white cursor-pointer">
                                    <span className="font-medium">Versão Completa</span>
                                    <span className="block text-sm text-gray-400">Conecta ao backend de produção (kineacrm.azurewebsites.net).</span>
                                </label>
                            </div>
                             <div className="flex items-center gap-4 p-4 rounded-md bg-gray-700/50 border border-gray-700">
                                <input
                                    id="test-mode"
                                    name="operation-mode"
                                    type="radio"
                                    value="frontend-test"
                                    checked={currentMode === 'frontend-test'}
                                    onChange={handleModeChange}
                                    className="h-4 w-4 text-blue-600 bg-gray-900 border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                                />
                                <label htmlFor="test-mode" className="text-white cursor-pointer">
                                    <span className="font-medium">Teste Frontend</span>
                                    <span className="block text-sm text-gray-400">Usa dados locais (mock) para testar a interface sem o backend.</span>
                                </label>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </Card>
        </div>
    );
}