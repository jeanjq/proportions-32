
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
 * Get the path to the avatar image using Firebase Storage v0 API format
 */
export function getAvatarPath(fileName: string | null, size: string, gender: 'women' | 'men'): string {
  if (!fileName) {
    return '/placeholder-avatar.png'; // Fallback image
  }
  
  // Format the gender string for URL (capitalize first letter)
  const formattedGender = gender === 'women' ? 'Women' : 'Men';
  
  // Special case handling for S size which uses different filenames
  let finalFileName;
  if (size === 'S') {
    // For S size, we use Default_Modelist_X instead of the regular filename
    // Extract the rotation number from the original filename if it exists
    const rotationMatch = fileName.match(/_(\d+)$/);
    const rotationNumber = rotationMatch ? rotationMatch[1] : '0';
    finalFileName = `Default_Modelist_${rotationNumber}`;
  } else {
    // For other sizes, use the provided filename
    finalFileName = fileName;
  }
  
  // Create the path that will go after /o/ in the Firebase Storage URL
  // and encode it properly for the URL
  const storagePath = encodeURIComponent(`${formattedGender}/${size}/${finalFileName}.png`);
  
  // Format the full Firebase Storage URL with the alt=media parameter
  const avatarUrl = `${FIREBASE_STORAGE_BASE_URL}/${storagePath}?alt=media`;
  
  console.log(`Creating avatar path: ${avatarUrl}`);
  
  return avatarUrl;
}
