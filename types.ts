export interface Hotel {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Course {
  id: string;
  name: string;
  address: string;
}

export interface SessionType {
  name: string;
  price: number;
  duration: number;
}

export interface Schedule {
  [key: number]: { start: number; end: number } | null;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  schedule: Schedule;
  sessionTypes: SessionType[];
}

export interface BookedSlot {
  bookingId: string;
  date: string;
  time: string;
  proId: string;
  hotelId: string;
  courseId: string;
  sessionName: string;
  price: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
}