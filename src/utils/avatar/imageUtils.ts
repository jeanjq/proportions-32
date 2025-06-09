
import { ViewAngle, AVAILABLE_VIEWS } from '@/types/avatar';

// Firebase Storage base URL - Updated to correct project
const FIREBASE_STORAGE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o';

/**
 * Extract image number from filename - FIXED VERSION
 */
export function extractImageNumber(fileName: string): number {
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
export function getFallbackImageNumber(bellyShape: string, secondShape: string, gender: 'male' | 'female'): number {
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
