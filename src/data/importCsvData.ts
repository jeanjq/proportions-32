import { AvatarData } from "../utils/avatarMatching";
import femaleAvatarsData from './femaleAvatars.json';
import maleAvatarsData from './maleAvatars.json';

// Firebase storage URLs for the new JS files
export const FIREBASE_STORAGE_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o";
export const MALE_JS_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Male.js?alt=media&token=edc4f39e-bec4-40ea-bb99-a8b0b62ca555";
export const FEMALE_JS_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Female.js?alt=media&token=0f53fa79-bcc2-4799-bf2e-6dae29d004e7";

// Function to fetch avatar data for a specific gender
export async function fetchGenderSpecificData(gender: 'male' | 'female'): Promise<AvatarData[]> {
  try {
    console.log(`🔄 Loading ${gender} data from local JSON file`);
    
    // Use the local JSON data instead of fetching from Firebase
    const jsonData = gender === 'male' ? maleAvatarsData : femaleAvatarsData;
    console.log(`✅ ${gender} data loaded successfully, total entries:`, jsonData.length);
    console.log(`📊 Sample ${gender} raw entries:`, jsonData.slice(0, 3));
    
    return processAvatarData(jsonData, gender);
    
  } catch (error) {
    console.error(`❌ Error loading ${gender} avatar data:`, error);
    console.log(`🔄 Falling back to example data for ${gender}`);
    return exampleAvatarData; // Fall back to example data
  }
}

// Separate function to process the raw data
function processAvatarData(jsonData: any[], gender: 'male' | 'female'): AvatarData[] {
  console.log(`🔄 Processing ${jsonData.length} ${gender} entries...`);
  
  // Process and cast the data to AvatarData[] using the correct field names from your JSON files
  const processedData = jsonData.map((entry: any, index: number) => {
    // Log the first few entries to see the structure
    if (index < 3) {
      console.log(`📋 Raw entry ${index + 1} structure:`, Object.keys(entry));
      console.log(`📋 Raw entry ${index + 1} data:`, entry);
    }
    
    const processed = {
      fileName: entry['Image number'] ? `adidas_${entry['Image number']}` : `adidas_105`,
      stature: Number(entry['Stature (mm)'] || 1700),
      weight: Number(entry['Weight (kg)'] || 70),
      waistCirc: Number(entry['Waist Circ'] || 80),
      chestCirc: Number(entry['Chest Circ'] || 95),
      hipCirc: Number(entry['Hip Circ'] || 90),
      crotchHeight: Number(entry['Crotch Height'] || 80),
      underBustCirc: Number(entry['Under Bust Circ'] || (gender === 'male' ? 0 : 75)),
      bellyShape: entry['Shape1 (Belly)'] || '1',
      hipShape: gender === 'female' ? (entry['Shape2 (Hip)'] || '2') : undefined,
      shoulderWidth: gender === 'male' ? (entry['Shape2 (Chest)'] || '2') : undefined,
      recommendedSize: entry['Size recommendation'] || 'M'
    } as AvatarData;
    
    // Log the first few processed entries
    if (index < 3) {
      console.log(`✅ Processed entry ${index + 1}:`, processed);
    }
    
    return processed;
  });
  
  console.log(`✅ Successfully processed ${processedData.length} ${gender} entries`);
  console.log(`📊 Final processed sample:`, processedData.slice(0, 2));
  
  return processedData;
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
