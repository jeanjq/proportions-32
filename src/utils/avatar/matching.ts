
import { AvatarData, OutputData } from '@/types/avatar';
import { fetchGenderSpecificData } from '@/data/importCsvData';
import { mapShapeToNumber, mapHipShapeToNumber, mapShoulderWidthToNumber } from './mappingUtils';
import { calculateSize } from './sizing';
import { extractImageNumber, getFallbackImageNumber } from './imageUtils';

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
 * Prioritizes height matching first, then weight matching
 */
export async function findClosestAvatarWithSize(
  height: number,
  weight: number,
  bellyShape: 'flat' | 'round' | 'curvy' | null,
  hipShapeOrShoulderWidth: 'slim' | 'regular' | 'full' | '1' | '2' | '3' | null,
  gender: 'male' | 'female'
): Promise<{ imageNumber: number | null; recommendedSize: string }> {
  console.log('=== AVATAR MATCHING DEBUG START ===');
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
    console.log(`Fetching ${gender} data from local JSON...`);
    // Fetch gender-specific data from the JSON files
    const genderData = await fetchGenderSpecificData(gender);
    console.log(`✅ Successfully loaded ${genderData.length} ${gender} entries from JSON`);
    
    if (genderData.length === 0) {
      console.log('❌ No data found, using fallback logic');
      return { 
        imageNumber: getFallbackImageNumber(bellyShape, hipShapeOrShoulderWidth, gender), 
        recommendedSize: calculateSize(height, weight) 
      };
    }
    
    // Debug: Show first few entries with detailed structure
    console.log('📊 Sample entries from JSON data:', genderData.slice(0, 5).map(entry => ({
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
      // For men, filter by belly shape and shoulder width
      const bellyShapeNumber = mapShapeToNumber(bellyShape);
      const shoulderWidthNumber = mapShoulderWidthToNumber(hipShapeOrShoulderWidth as '1' | '2' | '3');
      
      console.log('🔢 Mapped values for male matching:', {
        bellyShapeNumber,
        shoulderWidthNumber,
        originalBellyShape: bellyShape,
        originalShoulderWidth: hipShapeOrShoulderWidth
      });
      
      filteredData = genderData.filter((entry) => {
        const bellyMatch = entry.bellyShape === bellyShape;
        const shoulderMatch = entry.shoulderWidth === shoulderWidthNumber;
        const overallMatch = bellyMatch && shoulderMatch;
        
        console.log(`🔎 Male entry check:`, {
          fileName: entry.fileName,
          entryBelly: entry.bellyShape,
          targetBelly: bellyShape,
          bellyMatch,
          entryShoulder: entry.shoulderWidth,
          targetShoulder: shoulderWidthNumber,
          shoulderMatch,
          overallMatch
        });
        
        return overallMatch;
      });
    } else {
      // For women, filter by belly shape and hip shape
      const bellyShapeNumber = mapShapeToNumber(bellyShape);
      const hipShapeNumber = mapHipShapeToNumber(hipShapeOrShoulderWidth as 'slim' | 'regular' | 'full');
      
      console.log('🔢 Mapped values for female matching:', {
        bellyShapeNumber,
        hipShapeNumber,
        originalBellyShape: bellyShape,
        originalHipShape: hipShapeOrShoulderWidth
      });
      
      filteredData = genderData.filter((entry) => {
        const bellyMatch = entry.bellyShape === bellyShape;
        const hipMatch = entry.hipShape === (hipShapeOrShoulderWidth as 'slim' | 'regular' | 'full');
        const overallMatch = bellyMatch && hipMatch;
        
        console.log(`🔎 Female entry check:`, {
          fileName: entry.fileName,
          entryBelly: entry.bellyShape,
          targetBelly: bellyShape,
          bellyMatch,
          entryHip: entry.hipShape,
          targetHip: hipShapeOrShoulderWidth,
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
    
    // Find the closest match prioritizing height first, then weight
    console.log('🎯 Finding closest match prioritizing height first, then weight...');
    let closestMatch = filteredData[0];
    let smallestHeightDiff = Math.abs(closestMatch.stature - height);
    let smallestWeightDiff = Math.abs(closestMatch.weight - weight);
    
    console.log(`Initial candidate: ${closestMatch.fileName} with height diff: ${smallestHeightDiff}, weight diff: ${smallestWeightDiff}`);
    
    for (const entry of filteredData) {
      const heightDiff = Math.abs(entry.stature - height);
      const weightDiff = Math.abs(entry.weight - weight);
      
      console.log(`📏 Evaluating ${entry.fileName}:`, {
        entryHeight: entry.stature,
        entryWeight: entry.weight,
        heightDiff,
        weightDiff
      });
      
      // Prioritize height matching first
      if (heightDiff < smallestHeightDiff || 
          (heightDiff === smallestHeightDiff && weightDiff < smallestWeightDiff)) {
        smallestHeightDiff = heightDiff;
        smallestWeightDiff = weightDiff;
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
