export interface Medication {
    id: string;
    name: string;
    time: string; // "08:00", "21:00", etc.
    takenToday: boolean;
    weeklyStatus: {
      [date: string]: boolean | null; // null = not logged, true = taken, false = not taken
    };
  }