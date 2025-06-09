
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
import exampleAvatarData, { fetchGenderSpecificData } from '../data/importCsvData';

// Use the example data for fallback
export const avatarData: AvatarData[] = exampleAvatarData;

// Available view angles for rotation
export const AVAILABLE_VIEWS = ['Front', 'Back'] as const;
export type ViewAngle = typeof AVAILABLE_VIEWS[number];

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
 * Map UI text values to numeric values that match the JavaScript files
 */
function mapShapeToNumber(shape: 'flat' | 'round' | 'curvy'): string {
  switch (shape) {
    case 'flat': return '1';
    case 'round': return '2'; 
    case 'curvy': return '3';
    default: return '2';
  }
}

function mapHipShapeToNumber(shape: 'slim' | 'regular' | 'full'): string {
  switch (shape) {
    case 'slim': return '1';
    case 'regular': return '2';
    case 'full': return '3';
    default: return '2';
  }
}

function mapShoulderWidthToNumber(width: '1' | '2' | '3'): string {
  // The shoulder width values are already numbers from the UI
  return width;
}

/**
 * Find the closest matching avatar and return both image number and recommended size
 * Updated to handle shoulder width for men and hip shape for women
 * TESTING MODE: For men, ignore shape matching and only use height/weight
 */
export async function findClosestAvatarWithSize(
  height: number,
  weight: number,
  bellyShape: 'flat' | 'round' | 'curvy' | null,
  hipShapeOrShoulderWidth: 'slim' | 'regular' | 'full' | '1' | '2' | '3' | null,
  gender: 'male' | 'female'
): Promise<{ imageNumber: number | null; recommendedSize: string }> {
  console.log('=== AVATAR MATCHING DEBUG START (TEST MODE FOR MEN) ===');
  console.log('Input parameters:', {
    height,
    weight,
    bellyShape,
    hipShapeOrShoulderWidth,
    gender
  });

  if (!bellyShape || !hipShapeOrShoulderWidth) {
    console.log('Missing required parameters, returning fallback');
    return { imageNumber: null, recommendedSize: calculateSize(height, weight) };
  }

  try {
    console.log(`Fetching ${gender} data from Firebase...`);
    // Fetch gender-specific data from the new CSV files
    const genderData = await fetchGenderSpecificData(gender);
    console.log(`✅ Successfully loaded ${genderData.length} ${gender} entries from Firebase`);
    
    if (genderData.length === 0) {
      console.log('❌ No data found, using fallback logic');
      return { 
        imageNumber: getFallbackImageNumber(bellyShape, hipShapeOrShoulderWidth, gender), 
        recommendedSize: calculateSize(height, weight) 
      };
    }
    
    // Debug: Show first few entries with detailed structure
    console.log('📊 Sample entries from Firebase data:', genderData.slice(0, 5).map(entry => ({
      fileName: entry.fileName,
      stature: entry.stature,
      weight: entry.weight,
      bellyShape: entry.bellyShape,
      hipShape: entry.hipShape,
      shoulderWidth: entry.shoulderWidth,
      recommendedSize: entry.recommendedSize
    })));
    
    let filteredData;
    
    if (gender === 'male') {
      // TEST MODE: For men, ignore shape matching - use all data
      console.log('🧪 TEST MODE: Ignoring shape matching for men, using all data');
      filteredData = genderData;
    } else {
      // For women, keep the original shape filtering logic
      const bellyShapeNumber = mapShapeToNumber(bellyShape);
      const secondShapeNumber = mapHipShapeToNumber(hipShapeOrShoulderWidth as 'slim' | 'regular' | 'full');
      
      console.log('🔢 Mapped values for matching:', {
        bellyShapeNumber,
        secondShapeNumber,
        originalBellyShape: bellyShape,
        originalSecondShape: hipShapeOrShoulderWidth
      });
      
      // Filter by belly shape and hip shape for women
      console.log(`🔍 Filtering data for ${gender}...`);
      filteredData = genderData.filter((entry) => {
        const bellyMatch = entry.bellyShape === bellyShapeNumber;
        const hipMatch = entry.hipShape === secondShapeNumber;
        const overallMatch = bellyMatch && hipMatch;
        
        console.log(`🔎 Female entry check:`, {
          fileName: entry.fileName,
          entryBelly: entry.bellyShape,
          targetBelly: bellyShapeNumber,
          bellyMatch,
          entryHip: entry.hipShape,
          targetHip: secondShapeNumber,
          hipMatch,
          overallMatch
        });
        
        return overallMatch;
      });
    }
    
    console.log(`📋 Filtered results: Found ${filteredData.length} matching entries`);
    console.log('🎯 All matching entries:', filteredData.map(entry => ({
      fileName: entry.fileName,
      bellyShape: entry.bellyShape,
      secondShape: gender === 'male' ? entry.shoulderWidth : entry.hipShape,
      height: entry.stature,
      weight: entry.weight
    })));
    
    if (filteredData.length === 0) {
      console.log('❌ No matching avatars found for the given shapes, using fallback');
      return { 
        imageNumber: getFallbackImageNumber(bellyShape, hipShapeOrShoulderWidth, gender), 
        recommendedSize: calculateSize(height, weight) 
      };
    }
    
    // Find the closest match based on height and weight
    console.log('🎯 Finding closest match by height and weight...');
    let closestMatch = filteredData[0];
    let smallestDifference = Math.abs(closestMatch.stature - height) + Math.abs(closestMatch.weight - weight);

    console.log(`Weight: ${height} | Match: ${smallestDifference} | smallest difference: ${smallestDifference}`)
    
    console.log(`Initial candidate: ${closestMatch.fileName} with difference: ${smallestDifference}`);
    
    for (const entry of filteredData) {
      const heightDiff = Math.abs(entry.stature - height);
      const weightDiff = Math.abs(entry.weight - weight);
      const totalDifference = heightDiff + weightDiff;
      
      console.log(`📏 Evaluating ${entry.fileName}:`, {
        entryHeight: entry.stature,
        entryWeight: entry.weight,
        heightDiff,
        weightDiff,
        totalDifference,
        isBetter: totalDifference < smallestDifference
      });
      
      if (totalDifference < smallestDifference) {
        smallestDifference = totalDifference;
        closestMatch = entry;
        console.log(`🏆 New best match: ${entry.fileName}`);
      }
    }
    
    // Extract image number from fileName and get recommended size from CSV
    const imageNumber = extractImageNumber(closestMatch.fileName);
    const recommendedSize = closestMatch.recommendedSize || calculateSize(height, weight);
    
    console.log('✅ FINAL RESULT:', {
      closestMatch: closestMatch.fileName,
      imageNumber,
      recommendedSize,
      matchDetails: {
        height: closestMatch.stature,
        weight: closestMatch.weight,
        bellyShape: closestMatch.bellyShape,
        secondShape: gender === 'male' ? closestMatch.shoulderWidth : closestMatch.hipShape
      }
    });
    console.log('=== AVATAR MATCHING DEBUG END ===');
    
    return { imageNumber, recommendedSize };
    
  } catch (error) {
    console.error("❌ Error finding closest avatar:", error);
    console.log('=== AVATAR MATCHING DEBUG END (ERROR) ===');
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
 * Extract image number from filename - FIXED VERSION
 */
function extractImageNumber(fileName: string): number {
  console.log(`🔍 Extracting image number from fileName: "${fileName}"`);
  
  // Handle different filename formats
  if (!fileName) {
    console.log('❌ Empty fileName, using fallback 105');
    return 105;
  }
  
  // Try to extract number from various formats: "adidas_428", "428", "image_428", etc.
  const match = fileName.match(/(\d+)/);
  if (match) {
    const imageNumber = parseInt(match[1], 10);
    console.log(`✅ Extracted image number: ${imageNumber} from "${fileName}"`);
    return imageNumber;
  }
  
  console.log(`❌ Could not extract image number from "${fileName}", using fallback 105`);
  return 105; // Default fallback
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
export function getAvatarPath(imageNumber: number | null, size: string, gender: 'male' | 'female', view: ViewAngle = 'Front'): string {
  if (imageNumber === null) {
    return '/placeholder-avatar.png'; // Fallback image
  }
  
  // Format the gender string for URL (capitalize first letter)
  const formattedGender = gender === 'female' ? 'Women' : 'Men';
  
  // Use the adidas naming convention
  const filename = `adidas_${imageNumber}`;
  
  // Create the path that will go after /o/ in the Firebase Storage URL
  // Format: Gender/View/Size/filename.png
  const storagePath = encodeURIComponent(`${formattedGender}/${view}/${size}/${filename}.png`);
  
  // Format the full Firebase Storage URL
  const avatarUrl = `${FIREBASE_STORAGE_BASE_URL}/${storagePath}?alt=media`;
  
  console.log(`Creating avatar path: ${avatarUrl}`);
  
  return avatarUrl;
}

/**
 * Get all available views for a specific avatar
 */
export function getAvatarViews(imageNumber: number | null, size: string, gender: 'male' | 'female'): string[] {
  if (imageNumber === null) return ['/placeholder-avatar.png'];
  
  return AVAILABLE_VIEWS.map(view => getAvatarPath(imageNumber, size, gender, view));
}
