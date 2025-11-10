import React from 'react';
import { Hotel, Course, Professional } from '../types';
import SelectionCard from './SelectionCard';

interface SelectionGridProps {
    hotels: Hotel[];
    courses: Course[];
    professionals: Professional[];
    selectedHotelId: string;
    selectedCourseId: string;
    selectedProId: string;
    onHotelChange: (id: string) => void;
    onCourseChange: (id: string) => void;
    onProChange: (id: string) => void;
}

const SummaryBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="font-medium text-sm text-gray-500 border-b-2 border-dashed border-gray-200 pb-2 mb-3 block">{label}</label>
        <div className="w-full p-3 border border-gray-200 rounded-md text-sm bg-white text-gray-800 min-h-[44px] flex items-center">
            {value || '...'}
        </div>
    </div>
);

const SelectionGrid: React.FC<SelectionGridProps> = ({
    hotels, courses, professionals,
    selectedHotelId, selectedCourseId, selectedProId,
    onHotelChange, onCourseChange, onProChange
}) => {
    const selectedHotel = hotels.find(h => h.id === selectedHotelId);
    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const selectedPro = professionals.find(p => p.id === selectedProId);

    const hotelIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4m-6 0h-2" />
        </svg>
    );

    const courseIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
    );

    const proIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
    
    const formatProTitle = (pro: Professional | undefined) => {
      if (!pro) return '';
      return `${pro.name} - ${pro.title}`;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <SummaryBox label="Select Hotel" value={selectedHotel?.name ?? ''} />
                <SummaryBox label="Select Golf Course" value={selectedCourse?.name ?? ''} />
                <SummaryBox label="Select Teaching Professional" value={formatProTitle(selectedPro)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                    {hotels.map(hotel => (
                        <SelectionCard
                            key={hotel.id}
                            title={hotel.name}
                            subtitle={hotel.address}
                            icon={hotelIcon}
                            isSelected={hotel.id === selectedHotelId}
                            onClick={() => onHotelChange(hotel.id)}
                        />
                    ))}
                </div>
                <div className="space-y-3">
                    {courses.map(course => (
                        <SelectionCard
                            key={course.id}
                            title={course.name}
                            subtitle={course.address}
                            icon={courseIcon}
                            isSelected={course.id === selectedCourseId}
                            onClick={() => onCourseChange(course.id)}
                        />
                    ))}
                </div>
                <div className="space-y-3">
                    {professionals.map(pro => (
                        <SelectionCard
                            key={pro.id}
                            title={pro.name}
                            subtitle={pro.title}
                            icon={proIcon}
                            isSelected={pro.id === selectedProId}
                            onClick={() => onProChange(pro.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelectionGrid;
