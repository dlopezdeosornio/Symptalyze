import { useState, useEffect } from "react";
import type { Medication } from "../types/medications";

export default function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMed, setNewMed] = useState({ name: "", time: "" });

  // Load meds from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("medications");
    if (saved) {
      const parsedMedications = JSON.parse(saved);
      // Ensure all medications have weeklyStatus property
      const medicationsWithWeeklyStatus = parsedMedications.map((med: Medication) => ({
        ...med,
        weeklyStatus: med.weeklyStatus || {}
      }));
      setMedications(medicationsWithWeeklyStatus);
    }
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
      weeklyStatus: {},
    };
    setMedications([...medications, med]);
    setNewMed({ name: "", time: "" });
  };

  const toggleTaken = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setMedications(
      medications.map((m) =>
        m.id === id 
          ? { 
              ...m, 
              takenToday: !m.takenToday,
              weeklyStatus: {
                ...m.weeklyStatus,
                [today]: !m.takenToday
              }
            } 
          : m
      )
    );
  };

  const markNotTaken = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setMedications(
      medications.map((m) =>
        m.id === id 
          ? { 
              ...m, 
              takenToday: false,
              weeklyStatus: {
                ...m.weeklyStatus,
                [today]: false
              }
            } 
          : m
      )
    );
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  // Helper function to get day initials
  const getDayInitials = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = new Date().getDay();
    return { days, today };
  };

  // Helper function to get dates for the current week
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  // Helper function to get status color for a day
  const getStatusColor = (medication: Medication, date: string) => {
    const status = medication.weeklyStatus[date];
    if (status === true) return 'bg-green-500';
    if (status === false) return 'bg-red-500';
    return 'bg-gray-300';
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
                  : m.weeklyStatus[new Date().toISOString().split('T')[0]] === false
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="space-y-4">
                {/* Header with medication name and status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-semibold text-gray-800">{m.name}</h4>
                    {m.takenToday && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        ✅ Taken Today
                      </span>
                    )}
                    {!m.takenToday && m.weeklyStatus[new Date().toISOString().split('T')[0]] === false && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        ❌ Not Taken Today
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeMedication(m.id)}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* Time and weekly tracking */}
                <div className="space-y-3">
                  <p className="text-gray-600 flex items-center">
                    <span className="mr-2">🕐</span>
                    Take at {m.time}
                  </p>
                  
                  {/* Weekly tracking dots */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 mr-2">This week:</span>
                    <div className="flex space-x-1">
                      {getDayInitials().days.map((day, index) => {
                        const weekDates = getWeekDates();
                        const date = weekDates[index];
                        const isToday = index === getDayInitials().today;
                        const statusColor = getStatusColor(m, date);
                        
                        return (
                          <div key={day} className="flex flex-col items-center">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white transition-all duration-200 ${
                                statusColor
                              } ${
                                isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                              }`}
                              title={`${day} - ${date}`}
                            >
                              {day}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => toggleTaken(m.id)}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      m.takenToday
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {m.takenToday ? "✓ Marked" : "Mark Taken"}
                  </button>
                  <button
                    onClick={() => markNotTaken(m.id)}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                      m.weeklyStatus[new Date().toISOString().split('T')[0]] === false
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {m.weeklyStatus[new Date().toISOString().split('T')[0]] === false ? "✗ Not Taken" : "Mark Not Taken"}
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