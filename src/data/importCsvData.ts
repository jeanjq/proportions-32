import { AvatarData } from "../utils/avatarMatching";
import femaleAvatarsData from './femaleAvatars.json';

// Firebase storage URLs for the new JS files
export const FIREBASE_STORAGE_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o";
export const MALE_JS_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Male.js?alt=media&token=edc4f39e-bec4-40ea-bb99-a8b0b62ca555";
export const FEMALE_JS_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Female.js?alt=media&token=0f53fa79-bcc2-4799-bf2e-6dae29d004e7";

// Function to fetch avatar data for a specific gender
export async function fetchGenderSpecificData(gender: 'male' | 'female'): Promise<AvatarData[]> {
  try {
    console.log(`Loading ${gender} data from Firebase JavaScript file`);
    
    const jsUrl = gender === 'male' ? MALE_JS_URL : FEMALE_JS_URL;
    
    // Fetch the JavaScript file
    const response = await fetch(jsUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${gender} data: ${response.status}`);
    }
    
    // Get the JavaScript code as text
    const jsCode = await response.text();
    console.log(`${gender} JS code loaded, length:`, jsCode.length);
    
    // Execute the JavaScript code to get the data
    // The JS file should contain: const data = [...]; (or similar)
    const dataMatch = jsCode.match(/(?:const|var|let)\s+\w+\s*=\s*(\[[\s\S]*\]);?/);
    if (!dataMatch) {
      throw new Error(`Could not parse ${gender} data from JavaScript file`);
    }
    
    // Parse the JSON array from the matched code
    const jsonData = JSON.parse(dataMatch[1]);
    console.log(`${gender} data loaded successfully, total entries:`, jsonData.length);
    console.log(`Sample ${gender} entries:`, jsonData.slice(0, 3));
    
    // Process and cast the data to AvatarData[]
    const processedData = jsonData.map((entry: any) => ({
      fileName: entry.fileName || `adidas_${entry.image_number || 105}`,
      stature: Number(entry.stature || entry.Stature || 170),
      weight: Number(entry.weight || entry.Weight || 70),
      waistCirc: Number(entry.waistCirc || entry['Waist Circ'] || 80),
      chestCirc: Number(entry.chestCirc || entry['Chest Circ'] || 95),
      hipCirc: Number(entry.hipCirc || entry['Hip Circ'] || 90),
      crotchHeight: Number(entry.crotchHeight || entry['Crotch Height'] || 80),
      underBustCirc: Number(entry.underBustCirc || entry['Under Bust Circ'] || (gender === 'male' ? 0 : 75)),
      bellyShape: entry.bellyShape || entry.Shape1 || entry['Shape1 (Belly)'] || 'flat',
      hipShape: gender === 'female' ? (entry.hipShape || entry.Shape2 || entry['Shape2 (Hip)'] || 'regular') : undefined,
      shoulderWidth: gender === 'male' ? (entry.shoulderWidth || entry.Shape2 || entry['Shape2 (Chest)'] || '2') : undefined,
      recommendedSize: entry.recommendedSize || entry['Recommended Size'] || 'M'
    })) as AvatarData[];
    
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
