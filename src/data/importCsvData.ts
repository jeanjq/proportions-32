
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

// Process the raw JSON data to match our AvatarData interface
function processAvatarData(jsonData: any[], gender: 'male' | 'female'): AvatarData[] {
  console.log(`🔄 Processing ${jsonData.length} ${gender} entries...`);
  
  const processedData = jsonData.map((entry: any, index: number) => {
    // Log the first few entries to see the structure
    if (index < 3) {
      console.log(`📋 Raw entry ${index + 1} structure:`, Object.keys(entry));
      console.log(`📋 Raw entry ${index + 1} data:`, entry);
    }
    
    // Map belly shape numbers to text values
    const mapBellyShape = (shapeNum: string | number): 'flat' | 'round' | 'curvy' => {
      const num = typeof shapeNum === 'string' ? shapeNum : String(shapeNum);
      switch (num) {
        case '1': return 'flat';
        case '2': return 'round';
        case '3': return 'curvy';
        default: return 'round';
      }
    };

    // Map hip shape numbers to text values
    const mapHipShape = (shapeNum: string | number): 'slim' | 'regular' | 'full' => {
      const num = typeof shapeNum === 'string' ? shapeNum : String(shapeNum);
      switch (num) {
        case '1': return 'slim';
        case '2': return 'regular';
        case '3': return 'full';
        default: return 'regular';
      }
    };
    
    const processed = {
      fileName: entry['Image number'] ? `adidas_${entry['Image number']}` : `adidas_${index + 1}`,
      stature: Number(entry['Stature (mm)']) || 1700,
      weight: Number(entry['Weight (kg)']) || 70,
      waistCirc: Number(entry['Waist Circ']) || 80,
      chestCirc: Number(entry['Chest Circ']) || 95,
      hipCirc: Number(entry['Hip Circ']) || 90,
      crotchHeight: Number(entry['Crotch Height']) || 80,
      underBustCirc: Number(entry['Under Bust Circ']) || (gender === 'male' ? 0 : 75),
      bellyShape: mapBellyShape(entry['Shape1 (Belly)'] || '1'),
      hipShape: gender === 'female' ? mapHipShape(entry['Shape2 (Hip)'] || '2') : undefined,
      shoulderWidth: gender === 'male' ? String(entry['Shape2 (Chest)'] || '2') as '1' | '2' | '3' : undefined,
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

// Export default as female data for compatibility
export default femaleAvatarsData;
