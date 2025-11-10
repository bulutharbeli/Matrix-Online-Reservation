import React from 'react';
import { SessionType, Hotel, Course, Professional } from '../types';

interface BookingSummaryProps {
    session: SessionType | null;
    date: string | null;
    time: string | null;
    hotel: Hotel | undefined;
    course: Course | undefined;
    professional: Professional | undefined;
}

const SummaryItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-2">
        <span className="text-gray-600">{label}:</span>
        <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
);

const BookingSummary: React.FC<BookingSummaryProps> = ({ session, date, time, hotel, course, professional }) => {
    const formattedDate = date 
        ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
        : '-';

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#0c4b83] mb-2">Booking Summary</h3>
            <div className="space-y-1">
                <SummaryItem label="Hotel" value={hotel ? hotel.name : '-'} />
                <SummaryItem label="Course" value={course ? course.name : '-'} />
                <SummaryItem label="Professional" value={professional ? professional.name : '-'} />
                <SummaryItem label="Session" value={session ? `${session.name} (${session.duration} min)` : '-'} />
                <SummaryItem label="Date" value={formattedDate} />
                <SummaryItem label="Time" value={time || '-'} />
                <div className="!mt-4 pt-4 border-t-2 border-gray-100 flex justify-between items-center text-[#0c4b83]">
                    <span className="text-base font-bold">Total:</span>
                    <span className="text-lg font-bold">€{session ? session.price : 0}</span>
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;