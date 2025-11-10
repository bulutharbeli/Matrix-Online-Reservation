import React from 'react';

interface AIAssistantButtonProps {
    onClick: () => void;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 bg-gradient-to-br from-[#0c4b83] to-[#1a6aaf] text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-200 ease-in-out z-40"
            aria-label="Open AI Assistant"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.455 19L2 22.5V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5.455zM13 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm-5 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm7 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"/>
            </svg>
        </button>
    );
};

export default AIAssistantButton;
