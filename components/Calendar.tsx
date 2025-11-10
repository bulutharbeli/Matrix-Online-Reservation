import React from 'react';
import { Schedule } from '../types';

interface CalendarProps {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    selectedDate: string | null;
    onDateSelect: (date: string) => void;
    schedule: Schedule;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, setCurrentDate, selectedDate, onDateSelect, schedule }) => {
    
    const navigateMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-[#0c4b83]">{monthYear}</h3>
                <div className="flex gap-2">
                    <button onClick={() => navigateMonth(-1)} className="bg-[#0c4b83] text-white w-8 h-8 rounded-md hover:bg-[#1a6aaf] transition">‹</button>
                    <button onClick={() => navigateMonth(1)} className="bg-[#0c4b83] text-white w-8 h-8 rounded-md hover:bg-[#1a6aaf] transition">›</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {dayHeaders.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">{day}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const dayNumber = day + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                    const dayOfWeek = new Date(year, month, dayNumber).getDay();
                    
                    const isToday = year === today.getFullYear() && month === today.getMonth() && dayNumber === today.getDate();
                    const currentDateInLoop = new Date(year, month, dayNumber);
                    const isPast = currentDateInLoop < todayDateOnly;

                    const daySchedule = schedule[dayOfWeek];
                    
                    const isAvailable = !!daySchedule && !isPast;
                    const isSelected = selectedDate === dateStr;

                    let classes = "aspect-square flex items-center justify-center rounded-lg text-sm transition ";
                    if (isAvailable) {
                        classes += "cursor-pointer ";
                        if (isSelected) {
                            classes += "bg-[#0c4b83] text-white font-bold";
                        } else {
                            classes += "bg-blue-100/60 text-[#0c4b83] font-semibold hover:bg-blue-200/80";
                        }
                    } else {
                        classes += "text-gray-300 cursor-not-allowed";
                    }

                    if(isToday && !isSelected) {
                        classes += " ring-2 ring-[#0c4b83] ring-inset";
                    }

                    return (
                        <div key={dayNumber} className={classes} onClick={() => isAvailable && onDateSelect(dateStr)}>
                            {dayNumber}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;