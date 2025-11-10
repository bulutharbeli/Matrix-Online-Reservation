import React from 'react';

interface SelectionCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onClick: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ title, subtitle, icon, isSelected, onClick }) => {
    const selectedClasses = 'border-[#0c4b83] bg-blue-50 ring-2 ring-[#0c4b83]';
    const baseClasses = 'bg-white border-gray-200 hover:border-[#0c4b83] hover:bg-blue-50/50';

    return (
        <div 
            onClick={onClick}
            className={`p-3 rounded-lg border-2 flex items-center gap-4 shadow-sm cursor-pointer transition-all duration-200 ${isSelected ? selectedClasses : baseClasses}`}
        >
            <div className={`text-[#0c4b83] flex-shrink-0`}>{icon}</div>
            <div>
                <h3 className={`font-semibold leading-tight text-sm ${isSelected ? 'text-[#0c4b83]' : 'text-gray-800'}`}>{title}</h3>
                <p className="text-gray-500 text-xs">{subtitle}</p>
            </div>
        </div>
    );
};

export default SelectionCard;
