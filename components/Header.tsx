import React from 'react';
import { Professional } from '../types';
import Logo from './Logo';

interface HeaderProps {
    professional: Professional;
    onShowBookings: () => void;
}

const Header: React.FC<HeaderProps> = ({ professional, onShowBookings }) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-gradient-to-r from-[#083358] to-[#0c4b83] text-white p-4 md:p-6 flex items-center justify-between flex-wrap gap-4">
            <Logo />
            <div className="flex items-center gap-4">
                <button 
                    onClick={onShowBookings}
                    className="bg-white/10 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition-colors"
                    aria-label="View my bookings"
                >
                    My Bookings
                </button>
                <div className="text-right flex-shrink-0">
                    <h1 className="text-xl md:text-2xl font-semibold text-white">{professional.name}</h1>
                    <p className="text-base text-gray-200">{professional.title}</p>
                    <p className="text-xs text-gray-300 mt-2">{formattedDate}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;