import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  getUserStorageKey, 
  getUserStorage, 
  setUserStorage, 
  removeUserStorage, 
  STORAGE_KEYS 
} from '../storage'

describe('Storage Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('getUserStorageKey', () => {
    it('should generate correct user-specific storage key', () => {
      const baseKey = 'test-key'
      const userEmail = 'user@example.com'
      const expected = 'test-key-user@example.com'
      
      expect(getUserStorageKey(baseKey, userEmail)).toBe(expected)
    })

    it('should handle special characters in email', () => {
      const baseKey = 'symptom-entries'
      const userEmail = 'user+test@example.co.uk'
      const expected = 'symptom-entries-user+test@example.co.uk'
      
      expect(getUserStorageKey(baseKey, userEmail)).toBe(expected)
    })
  })

  describe('getUserStorage', () => {
    it('should return null when no data exists', () => {
      const result = getUserStorage('non-existent-key', 'user@example.com')
      expect(result).toBeNull()
    })

    it('should return parsed data when it exists', () => {
      const testData = { test: 'value', number: 123 }
      const userEmail = 'user@example.com'
      const key = getUserStorageKey('test-key', userEmail)
      
      localStorage.setItem(key, JSON.stringify(testData))
      
      const result = getUserStorage('test-key', userEmail)
      expect(result).toEqual(testData)
    })

    it('should return null and log error when JSON parsing fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const userEmail = 'user@example.com'
      const key = getUserStorageKey('test-key', userEmail)
      
      localStorage.setItem(key, 'invalid-json{')
      
      const result = getUserStorage('test-key', userEmail)
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Error parsing user storage data:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('setUserStorage', () => {
    it('should store data with correct key', () => {
      const testData = { symptoms: ['headache'], date: '2024-01-01' }
      const userEmail = 'user@example.com'
      const baseKey = 'test-key'
      
      setUserStorage(baseKey, userEmail, testData)
      
      const key = getUserStorageKey(baseKey, userEmail)
      const stored = localStorage.getItem(key)
      expect(stored).toBe(JSON.stringify(testData))
    })

    it('should handle complex data structures', () => {
      const testData = {
        entries: [
          { id: '1', symptoms: ['headache'], sleepHours: 8 },
          { id: '2', symptoms: ['fatigue'], sleepHours: 6 }
        ],
        metadata: { lastUpdated: '2024-01-01T00:00:00Z' }
      }
      const userEmail = 'user@example.com'
      
      setUserStorage('complex-data', userEmail, testData)
      
      const result = getUserStorage('complex-data', userEmail)
      expect(result).toEqual(testData)
    })

    it('should log error when storage fails', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      setUserStorage('test-key', 'user@example.com', { test: 'data' })
      
      expect(consoleSpy).toHaveBeenCalledWith('Error saving user storage data:', expect.any(Error))
      
      // Restore original function
      localStorage.setItem = originalSetItem
      consoleSpy.mockRestore()
    })
  })

  describe('removeUserStorage', () => {
    it('should remove data from localStorage', () => {
      const userEmail = 'user@example.com'
      const baseKey = 'test-key'
      const key = getUserStorageKey(baseKey, userEmail)
      
      // First set some data
      localStorage.setItem(key, JSON.stringify({ test: 'data' }))
      expect(localStorage.getItem(key)).not.toBeNull()
      
      // Then remove it
      removeUserStorage(baseKey, userEmail)
      expect(localStorage.getItem(key)).toBeNull()
    })

    it('should not throw error when removing non-existent data', () => {
      expect(() => {
        removeUserStorage('non-existent-key', 'user@example.com')
      }).not.toThrow()
    })
  })

  describe('STORAGE_KEYS', () => {
    it('should have correct constant values', () => {
      expect(STORAGE_KEYS.SYMPTOM_ENTRIES).toBe('symptom-entries')
      expect(STORAGE_KEYS.MEDICATIONS).toBe('medications')
    })

    it('should be immutable', () => {
      expect(() => {
        // @ts-expect-error - Testing immutability
        STORAGE_KEYS.SYMPTOM_ENTRIES = 'modified'
      }).toThrow()
    })
  })

  describe('Integration tests', () => {
    it('should work with real SymptomEntry data', () => {
      const userEmail = 'test@example.com'
      const symptomEntries = [
        {
          id: '1',
          date: '2024-01-01T00:00:00.000Z',
          symptoms: ['headache', 'fatigue'],
          sleepHours: 8,
          dietQuality: 4,
          exerciseMinutes: 30,
          medications: ['ibuprofen']
        },
        {
          id: '2',
          date: '2024-01-02T00:00:00.000Z',
          symptoms: ['dizziness'],
          sleepHours: 6,
          dietQuality: 2,
          exerciseMinutes: 0,
          medications: []
        }
      ]

      // Store the data
      setUserStorage(STORAGE_KEYS.SYMPTOM_ENTRIES, userEmail, symptomEntries)

      // Retrieve the data
      const retrieved = getUserStorage(STORAGE_KEYS.SYMPTOM_ENTRIES, userEmail)
      expect(retrieved).toEqual(symptomEntries)

      // Remove the data
      removeUserStorage(STORAGE_KEYS.SYMPTOM_ENTRIES, userEmail)
      const afterRemoval = getUserStorage(STORAGE_KEYS.SYMPTOM_ENTRIES, userEmail)
      expect(afterRemoval).toBeNull()
    })
  })
})
