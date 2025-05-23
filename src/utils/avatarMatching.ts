
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

// Import our example data and Firebase storage URL
import exampleAvatarData, { FIREBASE_STORAGE_BASE_URL } from '../data/importCsvData';

// Use the example data for now
// In a real implementation, you'd replace this with your CSV data
export const avatarData: AvatarData[] = exampleAvatarData;

/**
 * Find the closest matching avatar based on user measurements
 */
export function findClosestAvatar(
  height: number,
  weight: number,
  bellyShape: 'flat' | 'round' | 'curvy' | null,
  hipShape: 'slim' | 'regular' | 'full' | null,
  gender: 'women' | 'men'
): string | null {
  if (!bellyShape || !hipShape) return null;
  
  // Filter by gender, belly shape, and hip shape first
  const filteredAvatars = avatarData.filter(
    (avatar) => 
      avatar.bellyShape === bellyShape && 
      avatar.hipShape === hipShape
  );
  
  if (filteredAvatars.length === 0) {
    console.log('No matching avatars found for the given shapes');
    return null;
  }
  
  // Find the closest match based on height and weight
  let closestAvatar = filteredAvatars[0];
  let smallestDifference = Math.abs(closestAvatar.stature - height) + Math.abs(closestAvatar.weight - weight);
  
  for (const avatar of filteredAvatars) {
    const difference = Math.abs(avatar.stature - height) + Math.abs(avatar.weight - weight);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestAvatar = avatar;
    }
  }
  
  return closestAvatar.fileName;
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
 * Get the path to the avatar image
 */
export function getAvatarPath(fileName: string | null, size: string, gender: 'women' | 'men'): string {
  if (!fileName) {
    return '/placeholder-avatar.png'; // Fallback image
  }
  
  // Format the gender string for URL (capitalize first letter)
  const formattedGender = gender === 'women' ? 'Women' : 'Men';
  
  // Replace any spaces with %20 for URL compatibility
  const formattedFileName = fileName.replace(/ /g, '%20');
  
  // Check if we need to add a suffix
  const imageFileName = formattedFileName.endsWith('_0') ? formattedFileName : `${formattedFileName}_0`;
  
  console.log(`Creating avatar path: ${FIREBASE_STORAGE_BASE_URL}/${formattedGender}/${size}/${imageFileName}`);
  
  // Return the correct HTTPS URL format for Firebase Storage
  return `${FIREBASE_STORAGE_BASE_URL}/${formattedGender}/${size}/${imageFileName}`;
}
