// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import SymptomForm from "../components/SymptomForm";
import SymptomList from "../components/SymptomList";
import type{ SymptomEntry } from "../types/entry.data";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);

  // Load saved entries on mount
  useEffect(() => {
    const saved = localStorage.getItem("symptom-entries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save entries whenever they change
  useEffect(() => {
    localStorage.setItem("symptom-entries", JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (entry: SymptomEntry) => {
    setEntries((prev) => [...prev, entry]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {currentUser?.name || "User"}! 👋
              </h1>
              <p className="text-gray-600">
                Track your health and symptoms to better understand your patterns
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptom Form */}
          <div className="lg:sticky lg:top-8">
            <SymptomForm onAdd={handleAddEntry} />
          </div>

          {/* Entries List */}
          <div>
            <SymptomList entries={entries} />
          </div>
        </div>
      </div>
    </div>
  );
}