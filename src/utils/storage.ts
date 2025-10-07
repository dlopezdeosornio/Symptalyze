/**
 * Utility functions for user-specific localStorage operations
 */

/**
 * Get a user-specific localStorage key
 */
export const getUserStorageKey = (baseKey: string, userEmail: string): string => {
  return `${baseKey}-${userEmail}`;
};

/**
 * Get user-specific data from localStorage
 */
export const getUserStorage = <T>(baseKey: string, userEmail: string): T | null => {
  try {
    const key = getUserStorageKey(baseKey, userEmail);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error parsing user storage data:', error);
    return null;
  }
};

/**
 * Set user-specific data in localStorage
 */
export const setUserStorage = <T>(baseKey: string, userEmail: string, data: T): void => {
  try {
    const key = getUserStorageKey(baseKey, userEmail);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user storage data:', error);
  }
};

/**
 * Remove user-specific data from localStorage
 */
export const removeUserStorage = (baseKey: string, userEmail: string): void => {
  const key = getUserStorageKey(baseKey, userEmail);
  localStorage.removeItem(key);
};

/**
 * Storage keys for different types of user data
 */
export const STORAGE_KEYS = {
  SYMPTOM_ENTRIES: 'symptom-entries',
  MEDICATIONS: 'medications',
} as const;
