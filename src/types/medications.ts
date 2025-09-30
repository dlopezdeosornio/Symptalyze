export interface Medication {
    id: string;
    name: string;
    time: string; // "08:00", "21:00", etc.
    takenToday: boolean;
  }