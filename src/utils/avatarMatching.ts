
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
  shoulderWidth?: '1' | '2' | '3'; // Add shoulder width support
  recommendedSize?: string; // Add recommended size from CSV
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
import exampleAvatarData, { FIREBASE_STORAGE_BASE_URL, fetchGenderSpecificData } from '../data/importCsvData';

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
 * Find the closest matching avatar and return both image number and recommended size
 * Updated to handle shoulder width for men and hip shape for women
 */
export async function findClosestAvatarWithSize(
  height: number,
  weight: number,
  bellyShape: 'flat' | 'round' | 'curvy' | null,
  hipShapeOrShoulderWidth: 'slim' | 'regular' | 'full' | '1' | '2' | '3' | null,
  gender: 'male' | 'female'
): Promise<{ imageNumber: number | null; recommendedSize: string }> {
  if (!bellyShape || !hipShapeOrShoulderWidth) return { imageNumber: null, recommendedSize: calculateSize(height, weight) };

  try {
    // Fetch gender-specific data from the new CSV files
    const genderData = await fetchGenderSpecificData(gender);
    console.log(`Loaded ${genderData.length} ${gender} entries from CSV`);
    
    if (genderData.length === 0) {
      console.log('No data found, using fallback logic');
      return { 
        imageNumber: getFallbackImageNumber(bellyShape, hipShapeOrShoulderWidth, gender), 
        recommendedSize: calculateSize(height, weight) 
      };
    }
    
    // Filter by belly shape and second shape parameter based on gender
    const filteredData = genderData.filter((entry) => {
      if (gender === 'male') {
        // For men, match belly shape and shoulder width (map to hip shape for CSV compatibility)
        const shoulderToHip = mapShoulderWidthToHipShape(hipShapeOrShoulderWidth as '1' | '2' | '3');
        return entry.bellyShape === bellyShape && entry.hipShape === shoulderToHip;
      } else {
        // For women, match belly shape and hip shape directly
        return entry.bellyShape === bellyShape && entry.hipShape === hipShapeOrShoulderWidth;
      }
    });
    
    if (filteredData.length === 0) {
      console.log('No matching avatars found for the given shapes, using fallback');
      return { 
        imageNumber: getFallbackImageNumber(bellyShape, hipShapeOrShoulderWidth, gender), 
        recommendedSize: calculateSize(height, weight) 
      };
    }
    
    // Find the closest match based on height and weight
    let closestMatch = filteredData[0];
    let smallestDifference = Math.abs(closestMatch.stature - height) + Math.abs(closestMatch.weight - weight);
    
    for (const entry of filteredData) {
      const difference = Math.abs(entry.stature - height) + Math.abs(entry.weight - weight);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestMatch = entry;
      }
    }
    
    // Extract image number from fileName and get recommended size from CSV
    const imageNumber = extractImageNumber(closestMatch.fileName);
    const recommendedSize = closestMatch.recommendedSize || calculateSize(height, weight);
    
    console.log(`Found closest match with image number: ${imageNumber} and recommended size: ${recommendedSize}`);
    return { imageNumber, recommendedSize };
    
  } catch (error) {
    console.error("Error finding closest avatar:", error);
    return { 
      imageNumber: getFallbackImageNumber(bellyShape, hipShapeOrShoulderWidth, gender), 
      recommendedSize: calculateSize(height, weight) 
    };
  }
}

/**
 * Map shoulder width values to hip shape values for CSV compatibility
 */
function mapShoulderWidthToHipShape(shoulderWidth: '1' | '2' | '3'): 'slim' | 'regular' | 'full' {
  switch (shoulderWidth) {
    case '1': return 'slim';
    case '2': return 'regular';
    case '3': return 'full';
    default: return 'regular';
  }
}

/**
 * Legacy function for backward compatibility - now uses the new function
 */
export async function findClosestAvatar(
  height: number,
  weight: number,
  bellyShape: 'flat' | 'round' | 'curvy' | null,
  hipShape: 'slim' | 'regular' | 'full' | null,
  gender: 'male' | 'female'
): Promise<number | null> {
  const result = await findClosestAvatarWithSize(height, weight, bellyShape, hipShape, gender);
  return result.imageNumber;
}

/**
 * Extract image number from filename
 */
function extractImageNumber(fileName: string): number {
  // Handle formats like "adidas_428", "428", etc.
  const match = fileName.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 105; // Default fallback
}

/**
 * Get fallback image number based on shapes and gender
 */
function getFallbackImageNumber(bellyShape: string, secondShape: string, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    // For men, map shoulder width to fallback numbers
    const shoulderMapping: Record<string, Record<string, number>> = {
      'flat': { '1': 101, '2': 102, '3': 103 },
      'round': { '1': 104, '2': 105, '3': 106 },
      'curvy': { '1': 107, '2': 108, '3': 109 }
    };
    const fallbackNumber = shoulderMapping[bellyShape]?.[secondShape] || 105;
    console.log(`Using fallback image number for male: ${fallbackNumber}`);
    return fallbackNumber;
  } else {
    // For women, use hip shape mapping
    const shapeMapping: Record<string, Record<string, number>> = {
      'flat': { 'slim': 101, 'regular': 102, 'full': 103 },
      'round': { 'slim': 104, 'regular': 105, 'full': 106 },
      'curvy': { 'slim': 107, 'regular': 108, 'full': 109 }
    };
    const fallbackNumber = shapeMapping[bellyShape]?.[secondShape] || 105;
    console.log(`Using fallback image number for female: ${fallbackNumber}`);
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
 * Get the path to the avatar image using Firebase Storage with the adidas naming format
 */
export function getAvatarPath(imageNumber: number | null, size: string, gender: 'male' | 'female'): string {
  if (imageNumber === null) {
    return '/placeholder-avatar.png'; // Fallback image
  }
  
  // Format the gender string for URL (capitalize first letter)
  const formattedGender = gender === 'female' ? 'Women' : 'Men';
  
  // Use the adidas naming convention
  const filename = `adidas_${imageNumber}`;
  
  // Determine the view folder (using 'Front' as default, can be expanded later)
  const viewFolder = 'Front';
  
  // Create the path that will go after /o/ in the Firebase Storage URL
  // Format: Gender/View/Size/filename.png
  const storagePath = encodeURIComponent(`${formattedGender}/${viewFolder}/${size}/${filename}.png`);
  
  // Format the full Firebase Storage URL
  const avatarUrl = `${FIREBASE_STORAGE_BASE_URL}/${storagePath}?alt=media`;
  
  console.log(`Creating avatar path: ${avatarUrl}`);
  
  return avatarUrl;
}
