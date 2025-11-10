import React from 'react';
import { SessionType, Hotel, Course, Professional } from '../types';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isBooking: boolean;
    session: SessionType | null;
    date: string | null;
    time: string | null;
    hotel: Hotel | undefined;
    course: Course | undefined;
    professional: Professional | undefined;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-2">
        <span className="text-gray-500 text-sm">{label}:</span>
        <span className="font-semibold text-gray-800 text-sm text-right">{value}</span>
    </div>
);


const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    isBooking,
    session,
    date,
    time,
    hotel,
    course,
    professional,
}) => {
    if (!isOpen) {
        return null;
    }

    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        : '-';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all scale-95 opacity-0 animate-fade-in-scale">
                <style>{`
                    @keyframes fade-in-scale {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in-scale {
                        animation: fade-in-scale 0.2s ease-out forwards;
                    }
                `}</style>
                <div className="p-6">
                    <h2 id="dialog-title" className="text-xl font-bold text-center text-[#0c4b83] mb-4">Confirm Your Booking</h2>
                    <p className="text-center text-gray-600 text-sm mb-6">Please review your lesson details below before confirming.</p>
                    
                    <div className="bg-gray-50/70 rounded-lg p-4 space-y-1 mb-6 border border-gray-200">
                        <DetailItem label="Hotel" value={hotel?.name || '-'} />
                        <DetailItem label="Course" value={course?.name || '-'} />
                        <DetailItem label="Professional" value={professional?.name || '-'} />
                        <DetailItem label="Session" value={session ? `${session.name} (${session.duration} min)` : '-'} />
                        <DetailItem label="Date" value={formattedDate} />
                        <DetailItem label="Time" value={time || '-'} />
                    </div>

                    <div className="text-center mb-6">
                        <span className="text-gray-600 font-medium">Total Price:</span>
                        <span className="text-2xl font-bold text-[#0c4b83] ml-2">€{session?.price || 0}</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            disabled={isBooking}
                            className="w-full p-3 bg-gray-200 text-gray-800 font-semibold rounded-lg transition hover:bg-gray-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isBooking}
                            className="w-full p-3 bg-gradient-to-br from-[#0c4b83] to-[#1a6aaf] text-white font-semibold rounded-lg transition-transform transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:transform-none"
                        >
                            {isBooking ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;