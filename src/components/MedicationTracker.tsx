import { useState, useEffect } from "react";
import type { Medication } from "../types/medications";

export default function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMed, setNewMed] = useState({ name: "", time: "" });

  // Load meds from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("medications");
    if (saved) setMedications(JSON.parse(saved));
  }, []);

  // Save meds when updated
  useEffect(() => {
    localStorage.setItem("medications", JSON.stringify(medications));
  }, [medications]);

  const addMedication = () => {
    if (!newMed.name || !newMed.time) return;
    const med: Medication = {
      id: Date.now().toString(),
      name: newMed.name,
      time: newMed.time,
      takenToday: false,
    };
    setMedications([...medications, med]);
    setNewMed({ name: "", time: "" });
  };

  const toggleTaken = (id: string) => {
    setMedications(
      medications.map((m) =>
        m.id === id ? { ...m, takenToday: !m.takenToday } : m
      )
    );
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">💊 Medication Tracker</h2>
        <p className="text-gray-600">Track your daily medications and mark when taken</p>
      </div>

      {/* Add form */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Medication</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medication Name
            </label>
            <input
              type="text"
              placeholder="e.g., Metformin, Vitamin D"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time to Take
            </label>
            <input
              type="time"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={newMed.time}
              onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addMedication}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              ✨ Add Medication
            </button>
          </div>
        </div>
      </div>

      {/* Medications list */}
      {medications.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No medications added yet</h3>
          <p className="text-gray-500">Add your medications above to start tracking them</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Medications</h3>
          {medications.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                m.takenToday
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">{m.name}</h4>
                    {m.takenToday && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        ✅ Taken Today
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 flex items-center">
                    <span className="mr-2">🕐</span>
                    Take at {m.time}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleTaken(m.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      m.takenToday
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {m.takenToday ? "✓ Marked" : "Mark Taken"}
                  </button>
                  <button
                    onClick={() => removeMedication(m.id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}