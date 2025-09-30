import { useLocalStorage } from "./hooks/useLocalStorage";
import SymptomForm from "./components/SymptomForm";
import SymptomList from "./components/SymptomList";
import type{ SymptomEntry } from "./types/entry.data";

function App() {
  const [entries, setEntries] = useLocalStorage<SymptomEntry[]>("symptom-entries", []);

  const handleAdd = (entry: SymptomEntry) => {
    setEntries([...entries, entry]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Symptom Tracker</h1>
      <SymptomForm onAdd={handleAdd} />
      <SymptomList entries={entries} />
    </div>
  );
}

export default App;
