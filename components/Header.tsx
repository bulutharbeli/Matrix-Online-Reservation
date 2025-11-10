import React from 'react';
import { Professional } from '../types';

interface HeaderProps {
    professional: Professional;
    logoSrc: string;
}

const Header: React.FC<HeaderProps> = ({ professional, logoSrc }) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="relative bg-gradient-to-br from-[#0c4b83] to-[#1a6aaf] text-white p-6 md:p-8 text-center flex items-center justify-center">
            <img 
                src={logoSrc} 
                alt="Company Logo" 
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-10 md:h-12 w-auto object-contain"
            />
            <div>
                <h1 className="text-2xl md:text-3xl font-semibold mb-1">{professional.name} - {professional.title}</h1>
                <p className="text-base opacity-90">{formattedDate}</p>
            </div>
        </div>
    );
};

export default Header;