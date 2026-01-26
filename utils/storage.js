// utils/storage.js
// Centralized local storage helpers for Whisk
// Uses AsyncStorage to persist detected pet data

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "WHISK_DETECTED_PETS";

/**
 * Save a detected pet record
 * @param {Object} pet
 */
export const saveDetectedPet = async (pet) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const pets = existing ? JSON.parse(existing) : [];

    pets.unshift(pet); // newest first
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
  } catch (error) {
    console.error("❌ Error saving detected pet:", error);
  }
};

/**
 * Get all detected pets
 * @returns {Array}
 */
export const getDetectedPets = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Error loading detected pets:", error);
    return [];
  }
};

/**
 * Clear all detected pets (DEV / DEBUG only)
 */
export const clearDetectedPets = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("❌ Error clearing detected pets:", error);
  }
};
