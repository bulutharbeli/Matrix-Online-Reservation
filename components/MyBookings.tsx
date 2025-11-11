import React from 'react';
import { BookedSlot, Professional, Hotel, Course } from '../types';

interface MyBookingsProps {
    isOpen: boolean;
    onClose: () => void;
    bookings: BookedSlot[];
    professionals: Professional[];
    hotels: Hotel[];
    courses: Course[];
    onCancelBooking: (bookingId: string) => void;
    bookingBeingCancelled: string | null;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const MyBookings: React.FC<MyBookingsProps> = ({
    isOpen,
    onClose,
    bookings,
    professionals,
    hotels,
    courses,
    onCancelBooking,
    bookingBeingCancelled,
}) => {
    if (!isOpen) return null;

    const sortedBookings = [...bookings].sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

    const handleExportToPdf = (booking: BookedSlot) => {
        const pro = professionals.find(p => p.id === booking.proId);
        const hotel = hotels.find(h => h.id === booking.hotelId);
        const course = courses.find(c => c.id === booking.courseId);

        if (!pro || !hotel || !course) {
            console.error("Booking details could not be found for PDF export.");
            return;
        }

        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();

        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        const formattedDate = bookingDateTime.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
        const formattedTime = bookingDateTime.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: true
        });
        
        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('Booking Confirmation', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Matrix Golf Holidays', 105, 28, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35); // Horizontal line

        let yPosition = 45;

        const addDetail = (label: string, value: string) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, 20, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 70, yPosition);
            yPosition += 8;
        };
        
        // Lesson Details
        addDetail('Date:', formattedDate);
        addDetail('Time:', formattedTime);
        addDetail('Session:', booking.sessionName);
        addDetail('Professional:', pro.name);
        addDetail('Price:', `€${booking.price}`);

        yPosition += 5;
        doc.setLineWidth(0.2);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;

        // Location
        addDetail('Hotel:', hotel.name);
        addDetail('Golf Course:', course.name);
        
        yPosition += 5;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
        
        // Client Details
        addDetail('Client Name:', booking.name);
        addDetail('Email:', booking.email);

        // Footer
        yPosition = 270;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 8;
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for booking with Matrix Golf Holidays.', 105, yPosition, { align: 'center' });
        yPosition += 5;
        doc.text('Please arrive 15 minutes before your lesson. Cancellations are permitted up to 24 hours in advance.', 105, yPosition, { align: 'center', maxWidth: 180 });

        doc.save(`BookingConfirmation_${booking.name.replace(/\s/g, '_')}_${booking.date}.pdf`);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="bookings-title"
            onClick={onClose}
        >
            <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.2s ease-out forwards;
                }
                @keyframes fade-out-shrink {
                    from { 
                        opacity: 1; 
                        transform: scaleY(1); 
                        max-height: 300px; 
                        margin-bottom: 1rem;
                    }
                    to { 
                        opacity: 0; 
                        transform: scaleY(0.9); 
                        max-height: 0; 
                        margin-bottom: 0;
                        padding-top: 0;
                        padding-bottom: 0;
                        border-width: 0;
                    }
                }
                .animate-fade-out-shrink {
                    animation: fade-out-shrink 0.5s ease-out forwards;
                    transform-origin: top;
                    overflow: hidden;
                }
            `}</style>
            <div 
                className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col transform opacity-0 scale-95 animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
                style={{maxHeight: '90vh'}}
            >
                <div className="p-5 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                    <h2 id="bookings-title" className="text-xl font-bold text-[#0c4b83]">My Bookings</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close my bookings">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {sortedBookings.length > 0 ? (
                        <div className="space-y-4">
                            {sortedBookings.map(booking => {
                                const pro = professionals.find(p => p.id === booking.proId);
                                const hotel = hotels.find(h => h.id === booking.hotelId);
                                const course = courses.find(c => c.id === booking.courseId);

                                const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
                                const now = new Date();
                                const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
                                const canCancel = hoursUntilBooking > 24;
                                const isPast = bookingDateTime < now;

                                const formattedDate = bookingDateTime.toLocaleDateString('en-US', {
                                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                });
                                const formattedTime = bookingDateTime.toLocaleTimeString('en-US', {
                                    hour: '2-digit', minute: '2-digit', hour12: true
                                });

                                return (
                                    <div 
                                        key={booking.bookingId} 
                                        className={`bg-white p-4 rounded-lg shadow-md border-l-4 transition-all duration-500 ${isPast ? 'border-gray-300 opacity-70' : 'border-[#0c4b83]'} ${booking.bookingId === bookingBeingCancelled ? 'animate-fade-out-shrink' : ''}`}
                                    >
                                        <div className="flex justify-between items-start flex-wrap gap-2">
                                            <div>
                                                <p className="font-bold text-lg text-[#0c4b83]">{formattedDate}</p>
                                                <p className="text-gray-600 font-medium">{formattedTime}</p>
                                            </div>
                                            <p className="font-bold text-xl text-[#0c4b83]">€{booking.price}</p>
                                        </div>
                                        <div className="border-t border-gray-100 my-3"></div>
                                        <div className="text-sm space-y-2 text-gray-700">
                                            <p><span className="font-semibold">Professional:</span> {pro?.name || 'N/A'}</p>
                                            <p><span className="font-semibold">Lesson:</span> {booking.sessionName}</p>
                                            <p><span className="font-semibold">Location:</span> {course?.name || 'N/A'} at {hotel?.name || 'N/A'}</p>
                                        </div>
                                        <div className="border-t border-gray-100 my-3"></div>
                                        <div className="text-sm space-y-2 text-gray-700">
                                            <p className="font-semibold text-gray-800">Client Details:</p>
                                            <p><span className="font-semibold">Name:</span> {booking.name}</p>
                                            <p><span className="font-semibold">Email:</span> {booking.email}</p>
                                        </div>
                                        
                                        <div className="mt-4 flex flex-wrap justify-end items-center gap-3">
                                            <button
                                                onClick={() => handleExportToPdf(booking)}
                                                title="Export to PDF"
                                                className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
                                            >
                                                <DownloadIcon />
                                                <span>Export to PDF</span>
                                            </button>
                                            {!isPast && (
                                                <>
                                                    {canCancel ? (
                                                        <button
                                                            onClick={() => onCancelBooking(booking.bookingId)}
                                                            title="Cancel this booking"
                                                            className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                                                        >
                                                            Cancel Booking
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2 p-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md text-xs">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                            </svg>
                                                            <span>Cannot cancel within 24 hours of the lesson.</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">You have no upcoming lessons booked.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;