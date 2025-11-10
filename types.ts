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
  date: string;
  time: string;
  proId: string;
}
