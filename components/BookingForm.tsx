import React from 'react';

interface BookingFormProps {
    details: { name: string; email: string; phone: string; notes: string };
    onDetailsChange: (details: Partial<BookingFormProps['details']>) => void;
    onBook: () => void;
    isBooking: boolean;
    bookingStatus: { message: string; type: 'success' | 'error' } | null;
    canBook: boolean;
}

const InputField: React.FC<{ id: string; type?: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, type = 'text', placeholder, value, onChange }) => (
    <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 border-2 border-gray-200 rounded-md text-sm transition focus:outline-none focus:border-[#0c4b83]"
    />
);

const BookingForm: React.FC<BookingFormProps> = ({ details, onDetailsChange, onBook, isBooking, bookingStatus, canBook }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onDetailsChange({ [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#0c4b83] mb-4">Your Details</h3>
            <div className="space-y-3">
                <InputField id="name" placeholder="Full Name" value={details.name} onChange={handleChange} />
                <InputField id="email" type="email" placeholder="Email Address" value={details.email} onChange={handleChange} />
                <InputField id="phone" type="tel" placeholder="Phone Number" value={details.phone} onChange={handleChange} />
                <textarea
                    id="notes"
                    name="notes"
                    placeholder="Special requests or notes (optional)"
                    value={details.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-md text-sm transition focus:outline-none focus:border-[#0c4b83] resize-none"
                />
            </div>
            <button
                onClick={onBook}
                disabled={!canBook || isBooking}
                className="w-full mt-4 p-3.5 bg-gradient-to-br from-[#0c4b83] to-[#1a6aaf] text-white font-semibold rounded-lg transition-transform transform hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isBooking ? 'Processing...' : 'Book Lesson'}
            </button>
            {bookingStatus && (
                <div className={`mt-4 p-3 rounded-md text-sm text-center ${
                    bookingStatus.type === 'success' ? 'bg-blue-100 text-blue-900' : 'bg-red-100 text-red-900'
                }`}>
                    {bookingStatus.message}
                </div>
            )}
        </div>
    );
};

export default BookingForm;