import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import { useState } from "react";
  import type { SymptomEntry } from "../types/entry.data";
  
  interface Props {
    entries: SymptomEntry[];
  }
  
  const variables = [
    { key: "sleepHours", label: "Sleep Hours" },
    { key: "symptom", label: "Symptom (yes=1)" },
    { key: "exerciseMinutes", label: "Exercise Minutes" },
    { key: "dietQuality", label: "Diet Quality (1-5)" },
  ];
  
  export default function ComparisonChart({ entries }: Props) {
    const [var1, setVar1] = useState("sleepHours");
    const [var2, setVar2] = useState("exerciseMinutes");
  
    const chartData = entries.map((e) => ({
      date: new Date(e.date).toLocaleDateString(),
      sleepHours: Number(e.sleepHours) || 0,
      exerciseMinutes: Number(e.exerciseMinutes) || 0,
      dietQuality: Number(e.dietQuality) || 0,
      symptom: Array.isArray(e.symptoms) 
        ? e.symptoms.some(s => s.toLowerCase().includes("fatigue")) ? 1 : 0
        : e.symptoms.toLowerCase().includes("fatigue") ? 1 : 0, // example mapping
    }));
  
  const getVariableLabel = (key: string) => {
    return variables.find(v => v.key === key)?.label || key;
  };

  const getVariableIcon = (key: string) => {
    const icons: { [key: string]: string } = {
      sleepHours: "😴",
      symptom: "🩺",
      exerciseMinutes: "🏃",
      dietQuality: "🍎"
    };
    return icons[key] || "📊";
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No data to compare</h3>
        <p className="text-gray-500">Add some entries to see variable comparisons!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Variable Comparison</h2>
        <p className="text-gray-600">Compare different health metrics to identify patterns and correlations</p>
      </div>

      {/* Variable Selection */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Variables to Compare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Variable
            </label>
            <div className="relative">
              <select
                value={var1}
                onChange={(e) => setVar1(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {variables.map((v) => (
                  <option key={v.key} value={v.key}>
                    {getVariableIcon(v.key)} {v.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Second Variable
            </label>
            <div className="relative">
              <select
                value={var2}
                onChange={(e) => setVar2(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {variables.map((v) => (
                  <option key={v.key} value={v.key}>
                    {getVariableIcon(v.key)} {v.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {getVariableIcon(var1)} {getVariableLabel(var1)} vs {getVariableIcon(var2)} {getVariableLabel(var2)}
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">{getVariableLabel(var1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">{getVariableLabel(var2)}</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#666' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={var1} 
              stroke="#3b82f6" 
              strokeWidth={3}
              name={getVariableLabel(var1)}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey={var2} 
              stroke="#ef4444" 
              strokeWidth={3}
              name={getVariableLabel(var2)}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  }
  