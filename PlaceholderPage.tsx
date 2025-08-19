import React from 'react';
import { Card } from './components';

export default function PlaceholderPage({ title }) {
    return (
        <div className="p-6">
            <Card>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-gray-400 mt-2">Esta página está em construção.</p>
            </Card>
        </div>
    );
};
