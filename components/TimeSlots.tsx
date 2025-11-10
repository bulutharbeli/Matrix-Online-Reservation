import React from 'react';
import { Schedule, BookedSlot } from '../types';

interface TimeSlotsProps {
    selectedDate: string | null;
    schedule: Schedule;
    bookedSlots: BookedSlot[];
    proId: string;
    selectedTime: string | null;
    onTimeSelect: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedDate, schedule, bookedSlots, proId, selectedTime, onTimeSelect }) => {
    if (!selectedDate) {
        return (
            <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-[#0c4b83] mb-4">Available Time Slots</h3>
                <div className="text-gray-500 text-center py-5">Please select a date to see available times.</div>
            </div>
        );
    }

    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const daySchedule = schedule[dayOfWeek];

    if (!daySchedule) {
        return (
            <div className="bg-white p-5 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-[#0c4b83] mb-4">Available Time Slots</h3>
                <div className="text-gray-500 text-center py-5">The professional is not available on this day.</div>
            </div>
        );
    }

    const slots: string[] = [];
    for (let hour = daySchedule.start; hour < daySchedule.end; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
        }
    }

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#0c4b83] mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {slots.map(time => {
                    const isBooked = bookedSlots.some(slot => slot.date === selectedDate && slot.time === time && slot.proId === proId);
                    const isSelected = selectedTime === time;

                    let classes = "p-3 rounded-md text-center text-sm font-medium transition ";
                    if (isBooked) {
                        classes += "bg-gray-100 text-gray-400 line-through cursor-not-allowed";
                    } else if (isSelected) {
                        classes += "bg-[#0c4b83] text-white ring-2 ring-[#0c4b83]";
                    } else {
                        classes += "bg-blue-100/60 text-[#0c4b83] hover:bg-blue-200/80 cursor-pointer";
                    }

                    return (
                        <div key={time} className={classes} onClick={() => !isBooked && onTimeSelect(time)}>
                            {time}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimeSlots;