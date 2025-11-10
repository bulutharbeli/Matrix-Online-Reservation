import React from 'react';
import { Schedule } from '../types';

interface WeeklyScheduleProps {
    schedule: Schedule;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ schedule }) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="text-base font-semibold text-[#0c4b83] mb-2">Weekly Schedule</h3>
            <div className="space-y-1">
                {dayNames.map((dayName, index) => {
                    const daySchedule = schedule[index];
                    const isUnavailable = !daySchedule;
                    return (
                        <div key={dayName} className={`flex justify-between items-center text-sm py-3 border-b border-gray-100 last:border-b-0 ${isUnavailable ? 'text-gray-400' : 'text-gray-700'}`}>
                            <span className="font-medium">{dayName}</span>
                            <span className={`${isUnavailable ? 'text-gray-500' : 'text-gray-600 font-medium'}`}>
                                {daySchedule ? `${String(daySchedule.start).padStart(2, '0')}:00 - ${String(daySchedule.end).padStart(2, '0')}:00` : 'Unavailable'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeeklySchedule;