
// Define types for the CSV data structure
export interface AvatarData {
  fileName: string;
  stature: number;
  weight: number;
  waistCirc: number;
  chestCirc: number;
  hipCirc: number;
  crotchHeight: number;
  underBustCirc: number;
  bellyShape: 'flat' | 'round' | 'curvy';
  hipShape: 'slim' | 'regular' | 'full';
}

// Define type for the output.js data structure
export interface OutputData {
  Weight: number;
  Stature: number;
  Shape1: string;
  Shape2: string;
  image_number: number;
}

// Import our example data and Firebase storage URL
import exampleAvatarData, { FIREBASE_STORAGE_BASE_URL } from '../data/importCsvData';

// Use the example data for fallback
export const avatarData: AvatarData[] = exampleAvatarData;

// Fallback data for when the fetch fails
const fallbackOutputData: OutputData[] = [
  { Weight: 60, Stature: 1600, Shape1: 'flat', Shape2: 'slim', image_number: 101 },
  { Weight: 65, Stature: 1650, Shape1: 'flat', Shape2: 'regular', image_number: 102 },
  { Weight: 70, Stature: 1700, Shape1: 'flat', Shape2: 'full', image_number: 103 },
  { Weight: 60, Stature: 1600, Shape1: 'round', Shape2: 'slim', image_number: 104 },
  { Weight: 65, Stature: 1650, Shape1: 'round', Shape2: 'regular', image_number: 105 },
  { Weight: 70, Stature: 1700, Shape1: 'round', Shape2: 'full', image_number: 106 },
  { Weight: 60, Stature: 1600, Shape1: 'curvy', Shape2: 'slim', image_number: 107 },
  { Weight: 65, Stature: 1650, Shape1: 'curvy', Shape2: 'regular', image_number: 108 },
  { Weight: 70, Stature: 1700, Shape1: 'curvy', Shape2: 'full', image_number: 109 }
];

/**
 * Find the closest matching avatar based on user measurements using output.js data
 */
export async function findClosestAvatar(
  height: number,
  weight: number,
  bellyShape: 'flat' | 'round' | 'curvy' | null,
  hipShape: 'slim' | 'regular' | 'full' | null,
  gender: 'women' | 'men'
): Promise<number | null> {
  if (!bellyShape || !hipShape) return null;

  try {
    // Try to fetch the output.js data with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(
      "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/output.js?alt=media&token=8f21da12-fe5c-4475-9888-60a85db4cfb9",
      { signal: controller.signal }
    ).finally(() => clearTimeout(timeoutId));
    
    let outputData: OutputData[];
    
    if (response.ok) {
      const text = await response.text();
      
      // Parse the JavaScript file content
      const dataMatch = text.match(/const\s+data\s*=\s*(\[[\s\S]*?\]);/);
      if (dataMatch && dataMatch[1]) {
        outputData = JSON.parse(dataMatch[1]);
        console.log(`Loaded ${outputData.length} entries from output.js`);
      } else {
        console.log("Could not parse output.js file format, using fallback data");
        outputData = fallbackOutputData;
      }
    } else {
      console.log("Failed to fetch output.js, using fallback data");
      outputData = fallbackOutputData;
    }
    
    // Convert height from cm to mm
    const heightInMm = height * 10;
    
    // Filter by belly shape and hip shape first (exact match required)
    const filteredData = outputData.filter(
      (entry) => 
        entry.Shape1 === bellyShape && 
        entry.Shape2 === hipShape
    );
    
    if (filteredData.length === 0) {
      console.log('No matching avatars found for the given shapes, using default image number');
      // Return a default image number based on the bellyShape and hipShape
      const shapeMapping: Record<string, Record<string, number>> = {
        'flat': { 'slim': 101, 'regular': 102, 'full': 103 },
        'round': { 'slim': 104, 'regular': 105, 'full': 106 },
        'curvy': { 'slim': 107, 'regular': 108, 'full': 109 }
      };
      
      return shapeMapping[bellyShape]?.[hipShape] || 105; // Default to 105 if no match
    }
    
    // Find the closest match based on height and weight
    let closestMatch = filteredData[0];
    let smallestDifference = Math.abs(closestMatch.Stature - heightInMm) + Math.abs(closestMatch.Weight - weight);
    
    for (const entry of filteredData) {
      const difference = Math.abs(entry.Stature - heightInMm) + Math.abs(entry.Weight - weight);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestMatch = entry;
      }
    }
    
    console.log(`Found closest match with image number: ${closestMatch.image_number}`);
    return closestMatch.image_number;
  } catch (error) {
    console.error("Error finding closest avatar:", error);
    
    // Use fallback logic when fetch fails
    const shapeMapping: Record<string, Record<string, number>> = {
      'flat': { 'slim': 101, 'regular': 102, 'full': 103 },
      'round': { 'slim': 104, 'regular': 105, 'full': 106 },
      'curvy': { 'slim': 107, 'regular': 108, 'full': 109 }
    };
    
    const fallbackNumber = shapeMapping[bellyShape || 'round']?.[hipShape || 'regular'] || 105;
    console.log(`Using fallback image number: ${fallbackNumber}`);
    return fallbackNumber;
  }
}

/**
 * Calculate size based on BMI
 */
export function calculateSize(height: number, weight: number): string {
  const bmi = weight / ((height / 100) ** 2);
  
  if (bmi < 18.5) return 'S';
  if (bmi < 24.9) return 'M';
  if (bmi < 29.9) return 'L';
  if (bmi < 34.9) return 'XL';
  return 'XXL';
}

/**
 * Get the path to the avatar image using Firebase Storage with the new format
 */
export function getAvatarPath(imageNumber: number | null, size: string, gender: 'women' | 'men'): string {
  if (imageNumber === null) {
    return '/placeholder-avatar.png'; // Fallback image
  }
  
  // Format the gender string for URL (capitalize first letter)
  const formattedGender = gender === 'women' ? 'Women' : 'Men';
  
  // Generate the appropriate filename based on size
  let filename;
  if (size === 'S') {
    filename = `Default_Modelist_${imageNumber}`;
  } else { // M, L, XL
    filename = `YANGGE RPET MM _9810046199_B_${imageNumber}`;
  }
  
  // Create the path that will go after /o/ in the Firebase Storage URL
  // and encode it properly for the URL
  const storagePath = encodeURIComponent(`${formattedGender}/${size}/${filename}.png`);
  
  // Format the full Firebase Storage URL
  const avatarUrl = `${FIREBASE_STORAGE_BASE_URL}/${storagePath}?alt=media`;
  
  console.log(`Creating avatar path: ${avatarUrl}`);
  
  return avatarUrl;
}
