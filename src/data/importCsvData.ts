
import { AvatarData } from "../utils/avatarMatching";
import femaleAvatarsData from './femaleAvatars.json';
import maleAvatarsData from './maleAvatars.json';

// Function to fetch avatar data for a specific gender
export async function fetchGenderSpecificData(gender: 'male' | 'female'): Promise<AvatarData[]> {
  try {
    console.log(`🔄 Loading ${gender} data from local JSON file`);
    
    // Use the imported JSON data directly
    const jsonData = gender === 'male' ? maleAvatarsData : femaleAvatarsData;
    console.log(`✅ ${gender} data loaded successfully, total entries:`, jsonData.length);
    console.log(`📊 Sample ${gender} raw entries:`, jsonData.slice(0, 3));
    
    return processAvatarData(jsonData, gender);
    
  } catch (error) {
    console.error(`❌ Error loading ${gender} avatar data:`, error);
    throw new Error(`Failed to load ${gender} data from local JSON file`);
  }
}

// Parse range string (e.g., "140cm - 152cm" or "40kg - 44kg") to get min and max values
function parseRange(rangeStr: string): { min: number; max: number; midpoint: number } {
  const match = rangeStr.match(/(\d+)(?:cm|kg)?\s*-\s*(\d+)(?:cm|kg)?/);
  if (match) {
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);
    const midpoint = Math.round((min + max) / 2);
    return { min, max, midpoint };
  }
  // Fallback for non-range values
  const singleValue = parseInt(rangeStr.replace(/[^\d]/g, ''));
  return { min: singleValue, max: singleValue, midpoint: singleValue };
}

// Process the raw JSON data to match our AvatarData interface
function processAvatarData(jsonData: any[], gender: 'male' | 'female'): AvatarData[] {
  console.log(`🔄 Processing ${jsonData.length} ${gender} entries...`);
  
  const processedData = jsonData.map((entry: any, index: number) => {
    // Log the first few entries to see the structure
    if (index < 3) {
      console.log(`📋 Raw entry ${index + 1} structure:`, Object.keys(entry));
      console.log(`📋 Raw entry ${index + 1} data:`, entry);
    }
    
    // Parse height and weight ranges
    const heightRange = parseRange(entry.stature || '170cm');
    const weightRange = parseRange(entry.weight || '70kg');
    
    const processed = {
      fileName: entry.fileName || `adidas_${index + 1}`,
      stature: heightRange.midpoint * 10, // Convert cm to mm for compatibility
      weight: weightRange.midpoint,
      waistCirc: Number(entry['Waist Circ']) || 80,
      chestCirc: Number(entry['Chest Circ']) || 95,
      hipCirc: Number(entry['Hip Circ']) || 90,
      crotchHeight: Number(entry['Crotch Height']) || 80,
      underBustCirc: Number(entry['Under Bust Circ']) || (gender === 'male' ? 0 : 75),
      bellyShape: entry.bellyShape || 'round',
      hipShape: gender === 'female' ? (entry.hipShape || 'regular') : undefined,
      shoulderWidth: gender === 'male' ? (entry.shoulderWidth || '2') : undefined,
      recommendedSize: entry.recommendedSize || 'M',
      // Store original range data for matching
      heightRange: entry.stature,
      weightRange: entry.weight
    } as AvatarData & { heightRange?: string; weightRange?: string };
    
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

// Function to get available ranges for the questionnaire - now returns individual values
export async function getAvailableRanges(gender: 'male' | 'female'): Promise<{
  heightRanges: string[];
  weightRanges: string[];
}> {
  try {
    // Generate comprehensive individual value lists instead of ranges
    const heightRanges: string[] = [];
    for (let i = 140; i <= 200; i++) {
      heightRanges.push(`${i}cm`);
    }
    
    const weightRanges: string[] = [];
    for (let i = 40; i <= 120; i++) {
      weightRanges.push(`${i}kg`);
    }
    
    console.log(`📊 Available individual values for ${gender}:`, { 
      heightCount: heightRanges.length, 
      weightCount: weightRanges.length 
    });
    
    return { heightRanges, weightRanges };
  } catch (error) {
    console.error(`❌ Error generating ranges for ${gender}:`, error);
    return { heightRanges: [], weightRanges: [] };
  }
}

// Legacy function for backward compatibility
export async function fetchAvatarData(): Promise<AvatarData[]> {
  // Default to female data for backward compatibility
  return fetchGenderSpecificData('female');
}

// Export default as female data for compatibility
export default femaleAvatarsData;
