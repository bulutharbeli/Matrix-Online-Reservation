import React from 'react';
import { Hotel, Professional, Course } from '../types';

interface SelectorsProps {
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

const Selector: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div className="flex flex-col gap-2">
        <label className="font-medium text-[#0c4b83] text-sm">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full p-3 border-2 border-gray-200 rounded-md text-sm bg-white cursor-pointer transition focus:outline-none focus:border-[#0c4b83] text-gray-800"
        >
            {children}
        </select>
    </div>
);

const Selectors: React.FC<SelectorsProps> = ({ hotels, courses, professionals, selectedHotelId, selectedCourseId, selectedProId, onHotelChange, onCourseChange, onProChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 selectors-container">
            <Selector label="Select Hotel" value={selectedHotelId} onChange={(e) => onHotelChange(e.target.value)}>
                {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                ))}
            </Selector>
            <Selector label="Select Golf Course" value={selectedCourseId} onChange={(e) => onCourseChange(e.target.value)}>
                {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                ))}
            </Selector>
            <Selector label="Select Teaching Professional" value={selectedProId} onChange={(e) => onProChange(e.target.value)}>
                {professionals.map(pro => (
                    <option key={pro.id} value={pro.id}>{pro.name} - {pro.title}</option>
                ))}
            </Selector>
        </div>
    );
};

export default Selectors;