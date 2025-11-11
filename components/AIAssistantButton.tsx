import React from 'react';

interface AIAssistantButtonProps {
    onClick: () => void;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onClick }) => {
    return (
        <>
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(2deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.3); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes text-glow-pulse {
                    0%, 100% {
                        transform: scale(1);
                        text-shadow: 0 0 5px rgba(96, 165, 250, 0.5), 0 0 10px rgba(96, 165, 250, 0.3);
                    }
                    50% {
                        transform: scale(1.05);
                        text-shadow: 0 0 10px rgba(96, 165, 250, 0.8), 0 0 20px rgba(96, 165, 250, 0.6);
                    }
                }
                .robot-float {
                    animation: float 4s ease-in-out infinite;
                }
                .antenna-pulse {
                    animation: pulse 2s ease-in-out infinite;
                    transform-origin: center;
                }
                .text-pulse {
                    animation: text-glow-pulse 3s ease-in-out infinite;
                }
            `}</style>
            <div className="fixed bottom-6 right-6 flex flex-col items-center gap-2 z-40">
                 <div 
                    className="text-blue-400 font-bold text-xs tracking-wider uppercase text-pulse pointer-events-none"
                    aria-hidden="true"
                >
                    Matrix AI Agent
                </div>
                <button
                    onClick={onClick}
                    className="bg-gradient-to-br from-[#0c4b83] to-[#1a6aaf] text-white rounded-full p-3 shadow-lg hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform duration-200 ease-in-out robot-float"
                    aria-label="Open AI Assistant"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-9 w-9" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        {/* Head */}
                        <rect x="5" y="11" width="14" height="9" rx="2"></rect>
                        {/* Neck */}
                        <line x1="9" y1="20" x2="15" y2="20"></line>
                        {/* Eyes */}
                        <line x1="9" y1="15" x2="9.01" y2="15"></line>
                        <line x1="15" y1="15" x2="15.01" y2="15"></line>
                        {/* Antenna Base */}
                        <path d="M12 11V5"></path>
                        {/* Antenna Light */}
                        <circle cx="12" cy="4" r="1.5" fill="currentColor" className="antenna-pulse"></circle>
                    </svg>
                </button>
            </div>
        </>
    );
};

export default AIAssistantButton;