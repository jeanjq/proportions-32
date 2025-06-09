import { AvatarData } from "../utils/avatarMatching";
import maleAvatarsData from './maleAvatars.json';
import femaleAvatarsData from './femaleAvatars.json';

// Firebase storage URLs for the new CSV files (kept for reference)
export const FIREBASE_STORAGE_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o";
export const MALE_CSV_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Male%20(2).csv?alt=media&token=9ee2e53e-a258-45d8-aea5-39eb91cf4521";
export const FEMALE_CSV_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Female%20(2).csv?alt=media&token=44dfd6d2-be91-4920-97f0-cde218d3903e";

// Function to fetch avatar data for a specific gender from local JSON files
export async function fetchGenderSpecificData(gender: 'male' | 'female'): Promise<AvatarData[]> {
  try {
    console.log(`Loading ${gender} data from local JSON file`);
    
    // Use local JSON data instead of fetching from Firebase
    const jsonData = gender === 'male' ? maleAvatarsData : femaleAvatarsData;
    
    console.log(`${gender} data loaded successfully, total entries:`, jsonData.length);
    console.log('Sample entries:', jsonData.slice(0, 3));
    
    // Cast the data to AvatarData[] since it's already in the correct format
    const processedData = jsonData as AvatarData[];
    
    return processedData;
  } catch (error) {
    console.error(`Error loading ${gender} avatar data:`, error);
    return exampleAvatarData; // Fall back to example data
  }
}

// Legacy function for backward compatibility
export async function fetchAvatarData(): Promise<AvatarData[]> {
  // Default to female data for backward compatibility
  return fetchGenderSpecificData('female');
}

// For demonstration, keep the example entries
export const exampleAvatarData: AvatarData[] = [
  {
    fileName: "adidas_428",
    stature: 165,
    weight: 60,
    waistCirc: 70,
    chestCirc: 90,
    hipCirc: 95,
    crotchHeight: 75,
    underBustCirc: 75,
    bellyShape: "flat",
    hipShape: "regular"
  },
  {
    fileName: "adidas_105",
    stature: 170,
    weight: 75,
    waistCirc: 80,
    chestCirc: 100,
    hipCirc: 100,
    crotchHeight: 80,
    underBustCirc: 80,
    bellyShape: "round",
    hipShape: "full"
  },
  {
    fileName: "adidas_201",
    stature: 160,
    weight: 55,
    waistCirc: 65,
    chestCirc: 85,
    hipCirc: 90,
    crotchHeight: 70,
    underBustCirc: 70,
    bellyShape: "curvy",
    hipShape: "slim"
  }
];

// Export the example data for testing purposes
export default exampleAvatarData;
