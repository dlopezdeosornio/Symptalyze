import { useState } from "react";
import type{ SymptomEntry } from "../types/entry.data";

interface Props {
  entries: SymptomEntry[];
}

export default function SymptomList({ entries }: Props) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const getSleepQuality = (hours: number) => {
    if (hours >= 8) return { quality: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (hours >= 7) return { quality: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (hours >= 6) return { quality: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { quality: "Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  const getDietQuality = (quality: number) => {
    const qualities = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    const colors = ["", "text-red-600", "text-orange-600", "text-yellow-600", "text-blue-600", "text-green-600"];
    const bgs = ["", "bg-red-100", "bg-orange-100", "bg-yellow-100", "bg-blue-100", "bg-green-100"];
    return {
      quality: qualities[quality],
      color: colors[quality],
      bg: bgs[quality]
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No entries yet</h3>
        <p className="text-gray-500">Start tracking your symptoms and daily habits to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Health Journal</h2>
        <p className="text-gray-600 mb-4">{entries.length} {entries.length === 1 ? 'entry' : 'entries'} recorded</p>
      </div>

      <div className="space-y-3">
        {entries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((entry) => {
            const isExpanded = expandedEntry === entry.id;
            const sleepQuality = getSleepQuality(entry.sleepHours);
            const dietQuality = getDietQuality(entry.dietQuality);

            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {formatDate(entry.date)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Array.isArray(entry.symptoms) ? entry.symptoms.slice(0, 3).map((symptom: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                          >
                            {symptom}
                          </span>
                        )) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            {entry.symptoms}
                          </span>
                        )}
                        {Array.isArray(entry.symptoms) && entry.symptoms.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{entry.symptoms.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <span>😴</span>
                          <span className={sleepQuality.color}>{entry.sleepHours}h</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>🍎</span>
                          <span className={dietQuality.color}>{entry.dietQuality}/5</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>🏃</span>
                          <span className="text-gray-600">{entry.exerciseMinutes}min</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Symptoms */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          🩺 Symptoms
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(entry.symptoms) ? entry.symptoms.map((symptom: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                            >
                              {symptom}
                            </span>
                          )) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              {entry.symptoms}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Medications */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          💊 Medications
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {entry.medications.length > 0 ? (
                            entry.medications.map((med, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {med}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">None recorded</span>
                          )}
                        </div>
                      </div>

                      {/* Sleep Quality */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          😴 Sleep Quality
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${sleepQuality.bg} ${sleepQuality.color}`}>
                            {sleepQuality.quality}
                          </span>
                          <span className="text-gray-600">{entry.sleepHours} hours</span>
                        </div>
                      </div>

                      {/* Diet Quality */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          🍎 Diet Quality
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${dietQuality.bg} ${dietQuality.color}`}>
                            {dietQuality.quality}
                          </span>
                          <span className="text-gray-600">{entry.dietQuality}/5</span>
                        </div>
                      </div>

                      {/* Exercise */}
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          🏃 Exercise
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((entry.exerciseMinutes / 60) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-600 text-sm">{entry.exerciseMinutes} minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}