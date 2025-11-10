import React from 'react';
import { Hotel, Course, Professional } from '../types';

interface ProInfoProps {
    hotel: Hotel;
    course: Course;
    professional: Professional;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const InfoCard: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
    <div className="bg-white p-4 rounded-lg border-l-4 border-[#0c4b83] flex items-start gap-4 shadow-sm">
        <div className="text-[#0c4b83] mt-1 flex-shrink-0">{icon}</div>
        <div>
            <h3 className="text-[#0c4b83] text-md font-semibold leading-tight">{title}</h3>
            <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
    </div>
);


const ProInfo: React.FC<ProInfoProps> = ({ hotel, course, professional }) => {
    const hotelIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v-4a2 2 0 012-2h6a2 2 0 012 2v4m-6 0h-2" />
        </svg>
    );

    const courseIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
    );

    const proIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InfoCard title={hotel.name} subtitle={hotel.address} icon={hotelIcon} />
            <InfoCard title={course.name} subtitle={course.address} icon={courseIcon} />
            <InfoCard title={professional.name} subtitle={professional.title} icon={proIcon} />
        </div>
    );
};

export default ProInfo;