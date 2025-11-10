import React from 'react';
import { SessionType } from '../types';

interface SessionTypeSelectorProps {
    sessions: SessionType[];
    selectedSession: SessionType;
    onSessionChange: (session: SessionType) => void;
}

const SessionTypeSelector: React.FC<SessionTypeSelectorProps> = ({ sessions, selectedSession, onSessionChange }) => {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [price, duration] = e.target.value.split('|');
        const session = sessions.find(s => s.price === +price && s.duration === +duration);
        if (session) {
            onSessionChange(session);
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#0c4b83] mb-3">Session Type</h3>
            <select
                value={`${selectedSession.price}|${selectedSession.duration}`}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 rounded-md text-sm bg-white cursor-pointer transition focus:outline-none focus:border-[#0c4b83] text-gray-800"
            >
                {sessions.map(session => (
                    <option key={session.name} value={`${session.price}|${session.duration}`}>
                        {session.name} - €{session.price} ({session.duration} min)
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SessionTypeSelector;