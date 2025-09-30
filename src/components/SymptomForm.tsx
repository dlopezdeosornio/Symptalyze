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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Entry</h2>
        <p className="text-gray-600">Record your symptoms and daily habits</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Symptoms */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🩺 Symptoms
          </label>
          <input
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g., headache, fatigue, nausea"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple symptoms with commas</p>
        </div>

        {/* Sleep Hours */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            😴 Sleep Hours
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">hours</span>
          </div>
        </div>

        {/* Diet Quality */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🍎 Diet Quality
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="5"
              value={dietQuality}
              onChange={(e) => setDietQuality(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-lg font-bold text-blue-600 min-w-[2rem] text-center">
              {dietQuality}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Exercise Minutes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏃 Exercise Minutes
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">min</span>
          </div>
        </div>

        {/* Medications */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💊 Medications
          </label>
          <input
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            placeholder="e.g., ibuprofen, vitamin D, allergy meds"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple medications with commas</p>
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
        >
          ✨ Add Entry
        </button>
      </form>
    </div>
  );
}