import React from 'react';
import { Professional } from '../types';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    professional: Professional;
    onShowBookingsRequest: () => void;
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ professional, onShowBookingsRequest, onLoginClick }) => {
    const { user, logout } = useAuth();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleMyBookingsClick = () => {
        if (user) {
            onShowBookingsRequest();
        } else {
            onLoginClick();
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#083358] to-[#0c4b83] text-white p-4 md:p-6 flex items-center justify-between flex-wrap gap-4">
            <Logo />
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleMyBookingsClick}
                    className="bg-white/10 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white/20 transition-colors"
                    aria-label="View my bookings"
                >
                    My Bookings
                </button>
                {user ? (
                    <div className="flex items-center gap-3">
                         <span className="text-sm text-gray-200 hidden sm:block truncate" title={user.email}>{user.name || user.email}</span>
                         <button onClick={logout} className="bg-red-500/80 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-red-500 transition-colors">
                             Logout
                         </button>
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="bg-white/20 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white/30 transition-colors">
                        Login
                    </button>
                )}
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