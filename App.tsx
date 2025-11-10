import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { HOTELS, PROFESSIONALS, COURSES } from './constants';
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
import MyBookings from './components/MyBookings';
import CancellationConfirmationDialog from './components/CancellationConfirmationDialog';

const App: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedHotelId, setSelectedHotelId] = useState<string>(HOTELS[0].id);
    const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[0].id);
    const [selectedProId, setSelectedProId] = useState<string>(PROFESSIONALS[0].id);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);
    
    const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>(() => {
        try {
            const storedBookings = window.localStorage.getItem('userBookings');
            return storedBookings ? JSON.parse(storedBookings) : [];
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return [];
        }
    });

    const [bookingDetails, setBookingDetails] = useState({ name: '', email: '', phone: '', notes: '' });
    const [bookingStatus, setBookingStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isBooking, setIsBooking] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
    const [bookingToCancelId, setBookingToCancelId] = useState<string | null>(null);

    useEffect(() => {
        try {
            window.localStorage.setItem('userBookings', JSON.stringify(bookedSlots));
        } catch (error) {
            console.error("Error saving to localStorage", error);
        }
    }, [bookedSlots]);

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
        if (!selectedDate || !selectedTime || !bookingDetails.name || !bookingDetails.email) return;
        setIsConfirming(true);
    }, [selectedDate, selectedTime, bookingDetails.name, bookingDetails.email]);

    const handleCancelConfirmation = useCallback(() => {
        setIsConfirming(false);
    }, []);

    const handleConfirmBooking = useCallback(() => {
        if (!selectedDate || !selectedTime || !selectedProId || !selectedSession || !bookingDetails.name || !bookingDetails.email) return;

        setIsBooking(true);
        setBookingStatus(null);
        
        setTimeout(() => {
            const newBooking: BookedSlot = {
                bookingId: `booking-${Date.now()}`,
                date: selectedDate,
                time: selectedTime,
                proId: selectedProId,
                hotelId: selectedHotelId,
                courseId: selectedCourseId,
                sessionName: selectedSession.name,
                price: selectedSession.price
            };
            setBookedSlots(prev => [...prev, newBooking]);
            
            setBookingStatus({
                message: `✅ Booking confirmed! ${bookingDetails.name}, your lesson with ${selectedPro?.name} is scheduled.`,
                type: 'success'
            });

            setIsBooking(false);
            setIsConfirming(false);

            setTimeout(() => {
                setSelectedDate(null);
                setSelectedTime(null);
                setBookingDetails({ name: '', email: '', phone: '', notes: '' });
                setBookingStatus(null);
            }, 5000);

        }, 1500);

    }, [selectedDate, selectedTime, selectedProId, selectedSession, bookingDetails, selectedPro?.name, selectedHotelId, selectedCourseId]);
    
    const handleInitiateCancelBooking = useCallback((bookingId: string) => {
        setBookingToCancelId(bookingId);
    }, []);
    
    const handleCloseCancelDialog = useCallback(() => {
        setBookingToCancelId(null);
    }, []);

    const handleConfirmCancelBooking = useCallback(() => {
        if (bookingToCancelId) {
            setBookedSlots(prev => prev.filter(b => b.bookingId !== bookingToCancelId));
            setBookingToCancelId(null);
        }
    }, [bookingToCancelId]);
    
    const bookingToCancel = useMemo(() => 
        bookingToCancelId ? bookedSlots.find(b => b.bookingId === bookingToCancelId) || null : null,
    [bookingToCancelId, bookedSlots]);

    const canBook = !!(selectedDate && selectedTime && bookingDetails.name && bookingDetails.email);

    return (
        <div className="p-4 md:p-5 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                {selectedPro && <Header professional={selectedPro} onShowBookings={() => setIsMyBookingsOpen(true)} />}

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
                            <ProInfo hotel={selectedHotel} course={selectedCourse} professional={selectedPro} />
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

            {selectedPro && selectedSession && (
                <ConfirmationDialog 
                    isOpen={isConfirming}
                    onConfirm={handleConfirmBooking}
                    onCancel={handleCancelConfirmation}
                    isBooking={isBooking}
                    session={selectedSession}
                    date={selectedDate}
                    time={selectedTime}
                    hotel={selectedHotel}
                    course={selectedCourse}
                    professional={selectedPro}
                />
            )}
            
            <MyBookings
                isOpen={isMyBookingsOpen}
                onClose={() => setIsMyBookingsOpen(false)}
                bookings={bookedSlots}
                professionals={PROFESSIONALS}
                hotels={HOTELS}
                courses={COURSES}
                onCancelBooking={handleInitiateCancelBooking}
            />
            
            <CancellationConfirmationDialog
                isOpen={!!bookingToCancelId}
                onConfirm={handleConfirmCancelBooking}
                onCancel={handleCloseCancelDialog}
                booking={bookingToCancel}
                professionals={PROFESSIONALS}
                hotels={HOTELS}
                courses={COURSES}
            />
        </div>
    );
};

export default App;