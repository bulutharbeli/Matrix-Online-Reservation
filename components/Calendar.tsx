import React, { useState, useEffect, useRef } from 'react';
import { Schedule } from '../types';

interface CalendarProps {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    selectedDate: string | null;
    onDateSelect: (date: string) => void;
    schedule: Schedule;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, setCurrentDate, selectedDate, onDateSelect, schedule }) => {
    
    const getInitialFocusedDate = () => {
        const initialDate = selectedDate ? new Date(selectedDate) : currentDate;
        initialDate.setHours(0, 0, 0, 0); // Normalize time
        return initialDate;
    };

    const [focusedDate, setFocusedDate] = useState<Date>(getInitialFocusedDate);
    const gridRef = useRef<HTMLDivElement>(null);
    
    // Sync focused date with external changes
    useEffect(() => {
        setFocusedDate(getInitialFocusedDate());
    }, [selectedDate, currentDate]);

    // Programmatically focus the cell when focusedDate changes
     useEffect(() => {
        if (gridRef.current) {
            const focusedDateStr = `${focusedDate.getFullYear()}-${String(focusedDate.getMonth() + 1).padStart(2, '0')}-${String(focusedDate.getDate()).padStart(2, '0')}`;
            // The querySelector might fail if the focused date is not in the current month view
            const cell = gridRef.current.querySelector(`[data-date="${focusedDateStr}"]`) as HTMLDivElement;
            if (cell) {
                cell.focus();
            }
        }
    }, [focusedDate]);


    const navigateMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(1); // Avoid month skipping issues
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };
    
    const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        let newDate = new Date(focusedDate);
        let keyHandled = true;

        switch (event.key) {
            case 'ArrowRight':
                newDate.setDate(newDate.getDate() + 1);
                break;
            case 'ArrowLeft':
                newDate.setDate(newDate.getDate() - 1);
                break;
            case 'ArrowUp':
                newDate.setDate(newDate.getDate() - 7);
                break;
            case 'ArrowDown':
                newDate.setDate(newDate.getDate() + 7);
                break;
            case 'Enter':
            case ' ': {
                event.preventDefault();
                const dateStr = `${focusedDate.getFullYear()}-${String(focusedDate.getMonth() + 1).padStart(2, '0')}-${String(focusedDate.getDate()).padStart(2, '0')}`;
                
                const dayOfWeek = focusedDate.getDay();
                const today = new Date();
                const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const isPast = focusedDate < todayDateOnly;

                const daySchedule = schedule[dayOfWeek];
                const isAvailable = !!daySchedule && !isPast;

                if(isAvailable) {
                    onDateSelect(dateStr);
                }
                break;
            }
            default:
                keyHandled = false;
        }

        if (keyHandled) {
             event.preventDefault();
             // Don't change focus or month on selection keys, that's handled by state update
             if (event.key !== 'Enter' && event.key !== ' ') {
                if (newDate.getMonth() !== currentDate.getMonth() || newDate.getFullYear() !== currentDate.getFullYear()) {
                    setCurrentDate(newDate);
                }
                setFocusedDate(newDate);
             }
        }
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
                <h3 id="month-year-heading" className="text-lg font-semibold text-[#0c4b83]">{monthYear}</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigateMonth(-1)} 
                        className="bg-[#0c4b83] text-white w-8 h-8 rounded-md hover:bg-[#1a6aaf] transition"
                        aria-label="Previous month"
                    >
                        ‹
                    </button>
                    <button 
                        onClick={() => navigateMonth(1)} 
                        className="bg-[#0c4b83] text-white w-8 h-8 rounded-md hover:bg-[#1a6aaf] transition"
                        aria-label="Next month"
                    >
                        ›
                    </button>
                </div>
            </div>
            <div 
                ref={gridRef}
                className="grid grid-cols-7 gap-1"
                onKeyDown={handleGridKeyDown}
                role="grid"
                aria-labelledby="month-year-heading"
            >
                {dayHeaders.map(day => (
                    <div key={day} role="columnheader" aria-label={day} className="text-center text-xs font-bold text-gray-500 py-2">{day}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} role="presentation"></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const dayNumber = day + 1;
                    const dateInLoop = new Date(year, month, dayNumber);
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                    const dayOfWeek = dateInLoop.getDay();
                    
                    const isToday = year === today.getFullYear() && month === today.getMonth() && dayNumber === today.getDate();
                    const isPast = dateInLoop < todayDateOnly;

                    const daySchedule = schedule[dayOfWeek];
                    
                    const isAvailable = !!daySchedule && !isPast;
                    const isSelected = selectedDate === dateStr;
                    const isFocused = focusedDate.getTime() === dateInLoop.getTime();


                    let classes = "aspect-square flex items-center justify-center rounded-lg text-sm transition outline-none ";
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
                        classes += " ring-2 ring-offset-1 ring-[#0c4b83] ring-inset";
                    }
                    if(isFocused) {
                        classes += " ring-2 ring-offset-2 ring-blue-500";
                    }

                    const fullDate = new Date(year, month, dayNumber);
                    const dateForLabel = fullDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    let ariaLabel = dateForLabel;
                    if (isPast) {
                        ariaLabel += ", Past date, not available";
                    } else if (isAvailable) {
                        ariaLabel += ", Available";
                    } else {
                        ariaLabel += ", Not available";
                    }
                    
                    return (
                        <div 
                            key={dayNumber} 
                            className={classes} 
                            onClick={() => isAvailable && onDateSelect(dateStr)}
                            data-date={dateStr}
                            role="gridcell"
                            tabIndex={isFocused ? 0 : -1}
                            aria-selected={isSelected}
                            aria-disabled={!isAvailable}
                            aria-label={ariaLabel}
                        >
                            <span aria-hidden="true">{dayNumber}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
