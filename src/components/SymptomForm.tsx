import { useState } from "react";
import type { SymptomEntry } from "../types/entry.data";

interface Props {
  onAdd: (entry: SymptomEntry) => void;
}

export default function SymptomForm({ onAdd }: Props) {
  const [symptoms, setSymptoms] = useState("");
  const [sleepHours, setSleepHours] = useState(8);
  const [dietQuality, setDietQuality] = useState(3);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [medications, setMedications] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: SymptomEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      symptoms: symptoms.split(",").map(s => s.trim()).filter(Boolean),
      sleepHours,
      dietQuality,
      exerciseMinutes,
      medications: medications.split(",").map(m => m.trim()).filter(Boolean),
    };
    onAdd(newEntry);
    setSymptoms("");
    setSleepHours(8);
    setDietQuality(3);
    setExerciseMinutes(0);
    setMedications("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <div>
        <label className="block font-semibold">Symptoms (comma separated)</label>
        <input
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Sleep Hours</label>
        <input
          type="number"
          value={sleepHours}
          onChange={(e) => setSleepHours(Number(e.target.value))}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Diet Quality (1–5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={dietQuality}
          onChange={(e) => setDietQuality(Number(e.target.value))}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Exercise Minutes</label>
        <input
          type="number"
          value={exerciseMinutes}
          onChange={(e) => setExerciseMinutes(Number(e.target.value))}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label className="block font-semibold">Medications (comma separated)</label>
        <input
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Entry
      </button>
    </form>
  );
}