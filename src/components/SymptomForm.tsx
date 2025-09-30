import { useState, useRef, useEffect } from "react";
import type { SymptomEntry } from "../types/entry.data";

interface Props {
  onAdd: (entry: SymptomEntry) => void;
}

// Predefined symptom options
const SYMPTOM_OPTIONS = [
  // Physical symptoms
  { id: 'headache', label: 'Headache', category: 'Physical' },
  { id: 'fatigue', label: 'Fatigue', category: 'Physical' },
  { id: 'nausea', label: 'Nausea', category: 'Physical' },
  { id: 'dizziness', label: 'Dizziness', category: 'Physical' },
  { id: 'muscle_pain', label: 'Muscle Pain', category: 'Physical' },
  { id: 'joint_pain', label: 'Joint Pain', category: 'Physical' },
  { id: 'chest_pain', label: 'Chest Pain', category: 'Physical' },
  { id: 'stomach_pain', label: 'Stomach Pain', category: 'Physical' },
  { id: 'back_pain', label: 'Back Pain', category: 'Physical' },
  { id: 'fever', label: 'Fever', category: 'Physical' },
  { id: 'chills', label: 'Chills', category: 'Physical' },
  { id: 'sweating', label: 'Sweating', category: 'Physical' },
  { id: 'shortness_breath', label: 'Shortness Of Breath', category: 'Physical' },
  { id: 'heart_palpitations', label: 'Heart Palpitations', category: 'Physical' },
  { id: 'bloating', label: 'Bloating', category: 'Physical' },
  { id: 'constipation', label: 'Constipation', category: 'Physical' },
  { id: 'diarrhea', label: 'Diarrhea', category: 'Physical' },
  { id: 'rash', label: 'Rash', category: 'Physical' },
  { id: 'itchiness', label: 'Itchiness', category: 'Physical' },
  { id: 'swelling', label: 'Swelling', category: 'Physical' },
  
  // Mental/Emotional symptoms
  { id: 'anxiety', label: 'Anxiety', category: 'Mental' },
  { id: 'depression', label: 'Depression', category: 'Mental' },
  { id: 'irritability', label: 'Irritability', category: 'Mental' },
  { id: 'mood_swings', label: 'Mood Swings', category: 'Mental' },
  { id: 'confusion', label: 'Confusion', category: 'Mental' },
  { id: 'memory_problems', label: 'Memory Problems', category: 'Mental' },
  { id: 'concentration_issues', label: 'Concentration Issues', category: 'Mental' },
  { id: 'brain_fog', label: 'Brain Fog', category: 'Mental' },
  { id: 'stress', label: 'Stress', category: 'Mental' },
  { id: 'panic', label: 'Panic', category: 'Mental' },
  
  // Sleep-related
  { id: 'insomnia', label: 'Insomnia', category: 'Sleep' },
  { id: 'excessive_sleepiness', label: 'Excessive Sleepiness', category: 'Sleep' },
  { id: 'restless_sleep', label: 'Restless Sleep', category: 'Sleep' },
  { id: 'nightmares', label: 'Nightmares', category: 'Sleep' },
  
  // Appetite/Energy
  { id: 'loss_appetite', label: 'Loss Of Appetite', category: 'Appetite' },
  { id: 'increased_appetite', label: 'Increased Appetite', category: 'Appetite' },
  { id: 'food_cravings', label: 'Food Cravings', category: 'Appetite' },
  { id: 'low_energy', label: 'Low Energy', category: 'Energy' },
  { id: 'high_energy', label: 'High Energy', category: 'Energy' },
  
  // Sensory
  { id: 'sensitivity_light', label: 'Light Sensitivity', category: 'Sensory' },
  { id: 'sensitivity_sound', label: 'Sound Sensitivity', category: 'Sensory' },
  { id: 'blurred_vision', label: 'Blurred Vision', category: 'Sensory' },
  { id: 'ringing_ears', label: 'Ringing In Ears', category: 'Sensory' },
  { id: 'taste_changes', label: 'Taste Changes', category: 'Sensory' },
  { id: 'smell_changes', label: 'Smell Changes', category: 'Sensory' },
  
  // Positive/Neutral states
  { id: 'feeling_good', label: 'Feeling Good', category: 'Positive' },
  { id: 'energized', label: 'Energized', category: 'Positive' },
  { id: 'focused', label: 'Focused', category: 'Positive' },
  { id: 'calm', label: 'Calm', category: 'Positive' },
  { id: 'happy', label: 'Happy', category: 'Positive' },
  { id: 'neutral', label: 'Neutral', category: 'Neutral' },
  { id: 'stable', label: 'Stable', category: 'Neutral' },
];

export default function SymptomForm({ onAdd }: Props) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState(8);
  const [dietQuality, setDietQuality] = useState(3);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [medications, setMedications] = useState("");
  
  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Get unique categories
  const categories = Array.from(new Set(SYMPTOM_OPTIONS.map(s => s.category)));

  // Filter symptoms based on search term and selected category
  const filteredSymptoms = SYMPTOM_OPTIONS.filter(symptom => {
    const matchesSearch = symptom.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || symptom.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm("");
  };

  const handleSymptomSelect = (symptomId: string) => {
    toggleSymptom(symptomId);
    setIsDropdownOpen(false);
    setSelectedCategory("");
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: SymptomEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      symptoms: selectedSymptoms,
      sleepHours,
      dietQuality,
      exerciseMinutes,
      medications: medications.split(",").map(m => m.trim()).filter(Boolean),
    };
    onAdd(newEntry);
    setSelectedSymptoms([]);
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
          
          {/* Selected symptoms display */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSymptoms.map(symptomId => {
                const symptom = SYMPTOM_OPTIONS.find(s => s.id === symptomId);
                return (
                  <span
                    key={symptomId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {symptom?.label}
                    <button
                      type="button"
                      onClick={() => toggleSymptom(symptomId)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Dropdown container */}
          <div className="relative" ref={dropdownRef}>
            {/* Search input and dropdown trigger */}
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Search symptoms or click to browse..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {isDropdownOpen ? '▲' : '▼'}
              </button>
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                {/* Category filter */}
                <div className="p-3 border-b border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={clearSearch}
                      className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                        !selectedCategory
                          ? 'bg-blue-100 border-blue-300 text-blue-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategorySelect(category)}
                        className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category === 'Mental' ? 'Mental/Emotional' : 
                         category === 'Appetite' ? 'Appetite' :
                         category === 'Energy' ? 'Energy' :
                         category === 'Sensory' ? 'Sensory' :
                         category === 'Positive' ? 'Positive States' :
                         category === 'Neutral' ? 'Neutral States' :
                         category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Symptoms list */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredSymptoms.length > 0 ? (
                    <div className="p-2">
                      {filteredSymptoms.map(symptom => (
                        <button
                          key={symptom.id}
                          type="button"
                          onClick={() => handleSymptomSelect(symptom.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                            selectedSymptoms.includes(symptom.id)
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{symptom.label}</span>
                            {selectedSymptoms.includes(symptom.id) && (
                              <span className="text-blue-600">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No symptoms found matching your search
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">Search or browse by category to select symptoms</p>
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