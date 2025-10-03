import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import type { SymptomEntry } from "../types/entry.data";
  
  interface Props {
    entries: SymptomEntry[];
  }
  
export default function SymptomChart({ entries }: Props) {
  // Prepare data for chart and sort by date
  const chartData = entries
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString(),
      dateValue: new Date(e.date), // Keep original date for sorting
      sleep: Number(e.sleepHours),
      diet: Number(e.dietQuality),
      exercise: Number(e.exerciseMinutes),
      fatigue: Array.isArray(e.symptoms) 
        ? e.symptoms.some(s => s.toLowerCase().includes("fatigue")) ? 1 : 0
        : e.symptoms.toLowerCase().includes("fatigue") ? 1 : 0,
    }))
    .sort((a, b) => a.dateValue.getTime() - b.dateValue.getTime()); // Sort by date ascending

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No data to display</h3>
        <p className="text-gray-500">Add some entries to see your health trends!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Trends 📈</h2>
        <p className="text-gray-600">Track your sleep, diet, and exercise patterns over time</p>
      </div>
      
      <div className="space-y-6">
        {/* Sleep vs Fatigue Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            😴 Sleep vs Fatigue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{ value: 'Date', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#666' } }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{ value: 'Hours / Fatigue (0-1)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666' } }}
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
                dataKey="sleep" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Sleep Hours" 
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="fatigue" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Fatigue" 
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Diet Quality Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            🍎 Diet Quality Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{ value: 'Date', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#666' } }}
              />
              <YAxis 
                domain={[0, 5]}
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{ value: 'Diet Quality (1-5)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666' } }}
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
                dataKey="diet" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Diet Quality" 
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Exercise Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            🏃 Exercise Minutes
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{ value: 'Date', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#666' } }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
                label={{ value: 'Exercise (minutes)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666' } }}
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
                dataKey="exercise" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Exercise (min)" 
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}