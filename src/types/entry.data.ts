export interface SymptomEntry {
    id: string;
    date: string; // ISO date string
    symptoms: string[];
    sleepHours: number;
    dietQuality: number; // 1-5
    exerciseMinutes: number;
    medications: string[];
  }