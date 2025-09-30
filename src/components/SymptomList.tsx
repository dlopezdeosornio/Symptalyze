import type{ SymptomEntry } from "../types/entry.data";

interface Props {
  entries: SymptomEntry[];
}

export default function SymptomList({ entries }: Props) {
  return (
    <div className="mt-6 space-y-3">
      {entries.map(entry => (
        <div key={entry.id} className="p-3 border rounded bg-gray-50">
          <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
          <p><strong>Symptoms:</strong> {entry.symptoms.join(", ")}</p>
          <p><strong>Sleep:</strong> {entry.sleepHours}h</p>
          <p><strong>Diet Quality:</strong> {entry.dietQuality}/5</p>
          <p><strong>Exercise:</strong> {entry.exerciseMinutes} min</p>
          <p><strong>Medications:</strong> {entry.medications.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}