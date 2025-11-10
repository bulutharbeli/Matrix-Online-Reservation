import { Hotel, Professional, BookedSlot, Course } from './types';

export const HOTELS: Hotel[] = [
    {
        id: 'cornelia-diamond',
        name: 'Cornelia Diamond Golf Resort & Spa',
        address: 'Belek, Antalya, Turkey',
        latitude: 36.8532,
        longitude: 31.0650
    },
    {
        id: 'regnum-carya',
        name: 'Regnum Carya',
        address: 'Belek, Antalya, Turkey',
        latitude: 36.8507,
        longitude: 31.0252
    },
    {
        id: 'maxx-royal',
        name: 'Maxx Royal Belek Golf Resort',
        address: 'Belek, Antalya, Turkey',
        latitude: 36.8605,
        longitude: 31.0818
    },
    {
        id: 'sueno-golf',
        name: 'Sueno Hotels Golf Belek',
        address: 'Belek, Antalya, Turkey',
        latitude: 36.8580,
        longitude: 31.0326
    },
    {
        id: 'kempinski-dome',
        name: 'Kempinski Hotel The Dome Belek',
        address: 'Belek, Antalya, Turkey',
        latitude: 36.8557,
        longitude: 31.0175
    }
];

export const COURSES: Course[] = [
    { id: 'carya-golf', name: 'Carya Golf Club', address: 'Belek, Antalya, Turkey' },
    { id: 'montgomerie-maxx', name: 'Montgomerie Maxx Royal', address: 'Belek, Antalya, Turkey' },
    { id: 'national-golf', name: 'National Golf Club', address: 'Belek, Antalya, Turkey' },
    { id: 'gloria-golf', name: 'Gloria Golf Club', address: 'Belek, Antalya, Turkey' },
    { id: 'kaya-palazzo', name: 'Kaya Palazzo Golf Club', address: 'Belek, Antalya, Turkey' }
];

const allDaysAvailableSchedule = {
    0: { start: 9, end: 17 },
    1: { start: 9, end: 17 },
    2: { start: 9, end: 17 },
    3: { start: 9, end: 17 },
    4: { start: 9, end: 17 },
    5: { start: 9, end: 17 },
    6: { start: 9, end: 17 }
};

export const PROFESSIONALS: Professional[] = [
    {
        id: 'ahmet-yilmaz',
        name: 'Ahmet Yılmaz',
        title: 'Senior PGA Professional',
        schedule: allDaysAvailableSchedule,
        sessionTypes: [
            { name: "30 Minute Lesson", price: 40, duration: 30 },
            { name: "60 Minute Lesson", price: 75, duration: 60 },
            { name: "On-Course Lesson (9 Holes)", price: 150, duration: 120 }
        ]
    },
    {
        id: 'mehmet-kaya',
        name: 'Mehmet Kaya',
        title: 'PGA Teaching Professional',
        schedule: allDaysAvailableSchedule,
        sessionTypes: [
            { name: "30 Minute Lesson", price: 35, duration: 30 },
            { name: "60 Minute Lesson", price: 65, duration: 60 },
            { name: "Video Analysis", price: 90, duration: 60 }
        ]
    },
    {
        id: 'elif-demir',
        name: 'Elif Demir',
        title: 'PGA Junior Coach',
        schedule: allDaysAvailableSchedule,
        sessionTypes: [
            { name: "30 Minute Junior Lesson", price: 30, duration: 30 },
            { name: "60 Minute Junior Lesson", price: 50, duration: 60 },
        ]
    },
    {
        id: 'can-ozturk',
        name: 'Can Öztürk',
        title: 'Head PGA Professional',
        schedule: allDaysAvailableSchedule,
        sessionTypes: [
            { name: "60 Minute Lesson", price: 80, duration: 60 },
            { name: "Game Improvement Package", price: 220, duration: 180 },
            { name: "On-Course Lesson (18 Holes)", price: 300, duration: 240 }
        ]
    },
    {
        id: 'zeynep-celik',
        name: 'Zeynep Çelik',
        title: 'Ladies European Tour Player',
        schedule: allDaysAvailableSchedule,
        sessionTypes: [
            { name: "Ladies Special Lesson", price: 70, duration: 60 },
            { name: "Short Game Clinic", price: 100, duration: 90 }
        ]
    },
    {
        id: 'burak-arslan',
        name: 'Burak Arslan',
        title: 'PGA Advanced Professional',
        schedule: allDaysAvailableSchedule,
        sessionTypes: [
            { name: "60 Minute Lesson", price: 90, duration: 60 },
            { name: "Technology-Assisted Analysis", price: 150, duration: 90 },
        ]
    },
    {
        id: 'serkan-sahin',
        name: 'Serkan Şahin',
        title: 'PGA Master Professional',
        schedule: allDaysAvailableSchedule,
        sessionTypes: [
            { name: "Elite Level Lesson", price: 120, duration: 60 },
            { name: "Professional Consultation", price: 250, duration: 120 }
        ]
    }
];


export const INITIAL_BOOKED_SLOTS: BookedSlot[] = [
    { bookingId: 'booking-1721466000000', date: "2025-07-20", time: "10:00", proId: "ahmet-yilmaz", hotelId: 'cornelia-diamond', courseId: 'carya-golf', sessionName: "60 Minute Lesson", price: 75 },
    { bookingId: 'booking-1721569800000', date: "2025-07-21", time: "14:30", proId: "mehmet-kaya", hotelId: 'regnum-carya', courseId: 'national-golf', sessionName: "Video Analysis", price: 90 },
    { bookingId: 'booking-1721642400000', date: "2025-07-22", time: "11:00", proId: "can-ozturk", hotelId: 'maxx-royal', courseId: 'montgomerie-maxx', sessionName: "On-Course Lesson (18 Holes)", price: 300 }
];