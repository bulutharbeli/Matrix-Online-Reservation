import React from 'react';
import { BookedSlot, Professional, Hotel, Course } from '../types';

interface CancellationConfirmationDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    booking: BookedSlot | null;
    professionals: Professional[];
    hotels: Hotel[];
    courses: Course[];
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-2">
        <span className="text-gray-500 text-sm">{label}:</span>
        <span className="font-semibold text-gray-800 text-sm text-right">{value}</span>
    </div>
);

const CancellationConfirmationDialog: React.FC<CancellationConfirmationDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    booking,
    professionals,
    hotels,
    courses,
}) => {
    if (!isOpen || !booking) {
        return null;
    }

    const pro = professionals.find(p => p.id === booking.proId);
    const hotel = hotels.find(h => h.id === booking.hotelId);
    const course = courses.find(c => c.id === booking.courseId);

    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    const formattedDate = bookingDateTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const formattedTime = bookingDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title">
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
                    <h2 id="cancel-dialog-title" className="text-xl font-bold text-center text-red-700 mb-4">Confirm Cancellation</h2>
                    <p className="text-center text-gray-600 text-sm mb-6">Are you sure you want to cancel this lesson? This action cannot be undone.</p>
                    
                    <div className="bg-gray-50/70 rounded-lg p-4 space-y-1 mb-6 border border-gray-200">
                        <DetailItem label="Professional" value={pro?.name || '-'} />
                        <DetailItem label="Session" value={booking.sessionName} />
                        <DetailItem label="Date" value={formattedDate} />
                        <DetailItem label="Time" value={formattedTime} />
                        <DetailItem label="Location" value={`${course?.name || '-'} at ${hotel?.name || '-'}`} />
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <p className="text-xs text-blue-800">
                            <strong>Policy Reminder:</strong> Cancellations are permitted up to 24 hours before the scheduled lesson time.
                        </p>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={onCancel}
                            className="w-full p-3 bg-gray-200 text-gray-800 font-semibold rounded-lg transition hover:bg-gray-300"
                        >
                            Keep Booking
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-full p-3 bg-red-600 text-white font-semibold rounded-lg transition-transform transform hover:-translate-y-0.5 hover:bg-red-700"
                        >
                            Yes, Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancellationConfirmationDialog;