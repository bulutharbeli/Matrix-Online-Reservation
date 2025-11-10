import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { HOTELS, PROFESSIONALS, COURSES, INITIAL_BOOKED_SLOTS } from './constants';
import { Hotel, Professional, SessionType, BookedSlot, Course } from './types';
import Header from './components/Header';
import Selectors from './components/Selectors';
import ProInfo from './components/ProInfo';
import Calendar from './components/Calendar';
import WeeklySchedule from './components/WeeklySchedule';
import TimeSlots from './components/TimeSlots';
import SessionTypeSelector from './components/SessionTypeSelector';
import BookingSummary from './components/BookingSummary';
import BookingForm from './components/BookingForm';
import Map from './components/Map';
import ConfirmationDialog from './components/ConfirmationDialog';

const App: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedHotelId, setSelectedHotelId] = useState<string>(HOTELS[0].id);
    const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[0].id);
    const [selectedProId, setSelectedProId] = useState<string>(PROFESSIONALS[0].id);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);
    const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>(INITIAL_BOOKED_SLOTS);
    const [bookingDetails, setBookingDetails] = useState({ name: '', email: '', phone: '', notes: '' });
    const [bookingStatus, setBookingStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false); // State for dialog visibility
    const [logoSrc, setLogoSrc] = useState<string>('/logo.png');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const pro = PROFESSIONALS.find(p => p.id === selectedProId);
        if (pro && pro.sessionTypes.length > 0) {
            setSelectedSession(pro.sessionTypes[0]);
        } else {
            setSelectedSession(null);
        }
        setSelectedDate(null);
        setSelectedTime(null);
    }, [selectedProId]);

    const selectedHotel = useMemo<Hotel | undefined>(() => HOTELS.find(h => h.id === selectedHotelId), [selectedHotelId]);
    const selectedCourse = useMemo<Course | undefined>(() => COURSES.find(c => c.id === selectedCourseId), [selectedCourseId]);
    const selectedPro = useMemo<Professional | undefined>(() => PROFESSIONALS.find(p => p.id === selectedProId), [selectedProId]);

    const handleHotelChange = useCallback((hotelId: string) => {
        setSelectedHotelId(hotelId);
    }, []);

    const handleCourseChange = useCallback((courseId: string) => {
        setSelectedCourseId(courseId);
    }, []);

    const handleProChange = useCallback((proId: string) => {
        setSelectedProId(proId);
    }, []);
    
    const handleDateSelect = useCallback((date: string) => {
        setSelectedDate(date);
        setSelectedTime(null);
    }, []);

    const handleTimeSelect = useCallback((time: string) => {
        setSelectedTime(time);
    }, []);

    const handleSessionChange = useCallback((session: SessionType) => {
        setSelectedSession(session);
    }, []);
    
    const handleBookingDetailsChange = useCallback((details: Partial<typeof bookingDetails>) => {
        setBookingDetails(prev => ({ ...prev, ...details }));
    }, []);

    const handleBooking = useCallback(() => {
        // This function now opens the confirmation dialog
        if (!selectedDate || !selectedTime || !bookingDetails.name || !bookingDetails.email) return;
        setIsConfirming(true);
    }, [selectedDate, selectedTime, bookingDetails.name, bookingDetails.email]);

    const handleCancelBooking = useCallback(() => {
        setIsConfirming(false);
    }, []);

    const handleConfirmBooking = useCallback(() => {
        // This function contains the actual booking logic
        if (!selectedDate || !selectedTime || !selectedProId || !bookingDetails.name || !bookingDetails.email) return;

        setIsBooking(true);
        setBookingStatus(null);
        
        setTimeout(() => {
            const newBooking: BookedSlot = { date: selectedDate, time: selectedTime, proId: selectedProId };
            setBookedSlots(prev => [...prev, newBooking]);
            
            setBookingStatus({
                message: `✅ Booking confirmed! ${bookingDetails.name}, your lesson with ${selectedPro?.name} at ${selectedCourse?.name} is scheduled for ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}.`,
                type: 'success'
            });

            setIsBooking(false);
            setIsConfirming(false); // Close dialog

            setTimeout(() => {
                // Reset form
                setSelectedDate(null);
                setSelectedTime(null);
                setBookingDetails({ name: '', email: '', phone: '', notes: '' });
                setBookingStatus(null);
            }, 5000);

        }, 1500);

    }, [selectedDate, selectedTime, selectedProId, bookingDetails, selectedPro?.name, selectedHotel?.name, selectedCourse?.name]);

    const handleLogoUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if(e.target?.result) {
                    setLogoSrc(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const canBook = !!(selectedDate && selectedTime && bookingDetails.name && bookingDetails.email);

    return (
        <div className="p-4 md:p-5 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                {selectedPro && <Header professional={selectedPro} logoSrc={logoSrc} />}
                
                <div className="px-4 md:px-8 pt-4 border-b border-gray-100">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/gif, image/svg+xml"
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={handleLogoUploadClick}
                        className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                        Upload Your Logo
                    </button>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] gap-8 p-4 md:p-8">
                    {/* Main Panel */}
                    <div className="bg-gray-50/50 rounded-xl p-6 flex flex-col gap-6">
                       <Selectors
                            hotels={HOTELS}
                            courses={COURSES}
                            professionals={PROFESSIONALS}
                            selectedHotelId={selectedHotelId}
                            selectedCourseId={selectedCourseId}
                            selectedProId={selectedProId}
                            onHotelChange={handleHotelChange}
                            onCourseChange={handleCourseChange}
                            onProChange={handleProChange}
                        />
                        {selectedHotel && selectedCourse && selectedPro && (
                            <ProInfo 
                                hotel={selectedHotel} 
                                course={selectedCourse} 
                                professional={selectedPro} 
                            />
                        )}
                        {selectedHotel && (
                            <Map
                                latitude={selectedHotel.latitude}
                                longitude={selectedHotel.longitude}
                                hotelName={selectedHotel.name}
                            />
                        )}
                        {selectedPro && (
                            <>
                                <Calendar 
                                    currentDate={currentDate}
                                    setCurrentDate={setCurrentDate}
                                    selectedDate={selectedDate}
                                    onDateSelect={handleDateSelect}
                                    schedule={selectedPro.schedule}
                                />
                                <WeeklySchedule schedule={selectedPro.schedule} />
                                <TimeSlots
                                    selectedDate={selectedDate}
                                    schedule={selectedPro.schedule}
                                    bookedSlots={bookedSlots}
                                    proId={selectedPro.id}
                                    selectedTime={selectedTime}
                                    onTimeSelect={handleTimeSelect}
                                />
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-5">
                       {selectedPro && selectedSession && (
                            <>
                                <SessionTypeSelector
                                    sessions={selectedPro.sessionTypes}
                                    selectedSession={selectedSession}
                                    onSessionChange={handleSessionChange}
                                />
                                <BookingSummary
                                    session={selectedSession}
                                    date={selectedDate}
                                    time={selectedTime}
                                    hotel={selectedHotel}
                                    course={selectedCourse}
                                    professional={selectedPro}
                                />
                                <BookingForm
                                    details={bookingDetails}
                                    onDetailsChange={handleBookingDetailsChange}
                                    onBook={handleBooking}
                                    isBooking={isBooking}
                                    bookingStatus={bookingStatus}
                                    canBook={canBook}
                                />
                            </>
                       )}
                    </div>
                </div>
            </div>

            {/* Render Confirmation Dialog */}
            {selectedPro && selectedSession && (
                <ConfirmationDialog 
                    isOpen={isConfirming}
                    onConfirm={handleConfirmBooking}
                    onCancel={handleCancelBooking}
                    isBooking={isBooking}
                    session={selectedSession}
                    date={selectedDate}
                    time={selectedTime}
                    hotel={selectedHotel}
                    course={selectedCourse}
                    professional={selectedPro}
                />
            )}
        </div>
    );
};

export default App;