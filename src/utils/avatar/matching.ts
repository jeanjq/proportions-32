
import { AvatarData, OutputData } from '@/types/avatar';
import { fetchGenderSpecificData } from '@/data/importCsvData';
import { mapShapeToNumber, mapHipShapeToNumber, mapShoulderWidthToNumber } from './mappingUtils';
import { calculateSize } from './sizing';
import { extractImageNumber, getFallbackImageNumber } from './imageUtils';

// Helper function to parse range and check if a value falls within it
function parseRangeAndCheck(rangeStr: string, targetValue: number): { isInRange: boolean; midpoint: number } {
  const match = rangeStr.match(/(\d+)(?:cm|kg)?\s*-\s*(\d+)(?:cm|kg)?/);
  if (match) {
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);
    const midpoint = Math.round((min + max) / 2);
    const isInRange = targetValue >= min && targetValue <= max;
    return { isInRange, midpoint };
  }
  // Fallback for non-range values
  const singleValue = parseInt(rangeStr.replace(/[^\d]/g, ''));
  return { isInRange: targetValue === singleValue, midpoint: singleValue };
}

// Helper function to convert height/weight strings to numbers for AvatarDisplay compatibility
export function convertMeasurementToNumber(measurement: string): number {
  // If it's already a number, return it
  if (!isNaN(Number(measurement))) {
    return Number(measurement);
  }
  
  // If it's a range, parse and return midpoint
  const match = measurement.match(/(\d+)(?:cm|kg)?\s*-\s*(\d+)(?:cm|kg)?/);
  if (match) {
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);
    return Math.round((min + max) / 2);
  }
  
  // Fallback: extract first number found
  const numberMatch = measurement.match(/\d+/);
  return numberMatch ? parseInt(numberMatch[0]) : 170; // Default fallback
}

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
 * Calculate similarity score between user measurements and avatar entry
 */
function calculateSimilarityScore(
  entry: AvatarData,
  targetHeight: number,
  targetWeight: number,
  targetBellyShape: string,
  targetSecondShape: string,
  gender: 'male' | 'female'
): number {
  let score = 0;

  // Parse height and weight ranges from the entry
  const heightCheck = parseRangeAndCheck(entry.heightRange || '170cm', targetHeight);
  const weightCheck = parseRangeAndCheck(entry.weightRange || '70kg', targetWeight);
  
  // Height matching (most important) - score 0-40
  if (heightCheck.isInRange) {
    score += 40; // Perfect match if within range
  } else {
    const heightDiff = Math.abs(heightCheck.midpoint - targetHeight);
    const heightScore = Math.max(0, 40 - (heightDiff / 2)); // Reduced penalty for close matches
    score += heightScore;
  }
  
  // Weight matching (second most important) - score 0-30
  if (weightCheck.isInRange) {
    score += 30; // Perfect match if within range
  } else {
    const weightDiff = Math.abs(weightCheck.midpoint - targetWeight);
    const weightScore = Math.max(0, 30 - weightDiff); // Penalty of 1 point per kg difference
    score += weightScore;
  }
  
  // Belly shape matching - score 0-20
  if (entry.bellyShape === targetBellyShape) {
    score += 20;
  } else {
    // Partial score for similar shapes
    const shapeMapping = { 'flat': 1, 'round': 2, 'curvy': 3 };
    const entryShapeNum = shapeMapping[entry.bellyShape as keyof typeof shapeMapping] || 2;
    const targetShapeNum = shapeMapping[targetBellyShape as keyof typeof shapeMapping] || 2;
    const shapeDiff = Math.abs(entryShapeNum - targetShapeNum);
    score += Math.max(0, 20 - (shapeDiff * 8)); // Reduce score for different shapes
  }
  
  // Second shape matching (hip/shoulder) - score 0-10
  const entrySecondShape = gender === 'male' ? entry.shoulderWidth : entry.hipShape;
  if (entrySecondShape === targetSecondShape) {
    score += 10;
  } else {
    // Partial score for similar second shapes
    const secondShapeMapping = gender === 'male' 
      ? { '1': 1, '2': 2, '3': 3 }
      : { 'slim': 1, 'regular': 2, 'full': 3 };
    const entrySecondNum = secondShapeMapping[entrySecondShape as keyof typeof secondShapeMapping] || 2;
    const targetSecondNum = secondShapeMapping[targetSecondShape as keyof typeof secondShapeMapping] || 2;
    const secondDiff = Math.abs(entrySecondNum - targetSecondNum);
    score += Math.max(0, 10 - (secondDiff * 4)); // Reduce score for different second shapes
  }
  
  console.log(`📊 Similarity score for ${entry.fileName}:`, {
    heightInRange: heightCheck.isInRange,
    weightInRange: weightCheck.isInRange,
    bellyMatch: entry.bellyShape === targetBellyShape,
    secondShapeMatch: entrySecondShape === targetSecondShape,
    totalScore: score.toFixed(1)
  });
  
  return score;
}

/**
 * Find the closest matching avatar and return both image number and recommended size
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
    const genderData = await fetchGenderSpecificData(gender);
    console.log(`✅ Successfully loaded ${genderData.length} ${gender} entries from JSON`);
    
    if (genderData.length === 0) {
      console.log('❌ No data found, using fallback logic');
      return { 
        imageNumber: getFallbackImageNumber(bellyShape, hipShapeOrShoulderWidth, gender), 
        recommendedSize: calculateSize(height, weight) 
      };
    }
    
    // Use similarity scoring for all entries
    let bestMatch = genderData[0];
    let bestScore = calculateSimilarityScore(
      bestMatch, 
      height, 
      weight, 
      bellyShape, 
      hipShapeOrShoulderWidth, 
      gender
    );
    
    console.log(`Initial best candidate: ${bestMatch.fileName} with score: ${bestScore.toFixed(1)}`);
    
    for (let i = 1; i < genderData.length; i++) {
      const entry = genderData[i];
      const score = calculateSimilarityScore(
        entry, 
        height, 
        weight, 
        bellyShape, 
        hipShapeOrShoulderWidth, 
        gender
      );
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
        console.log(`🏆 New best match: ${entry.fileName} with score: ${score.toFixed(1)}`);
      }
    }
    
    const imageNumber = extractImageNumber(bestMatch.fileName);
    const recommendedSize = bestMatch.recommendedSize || calculateSize(height, weight);
    
    console.log('✅ FINAL MATCH RESULT:', {
      closestMatch: bestMatch.fileName,
      imageNumber,
      recommendedSize,
      finalScore: bestScore.toFixed(1),
      matchDetails: {
        heightRange: bestMatch.heightRange,
        weightRange: bestMatch.weightRange,
        bellyShape: bestMatch.bellyShape,
        secondShape: gender === 'male' ? bestMatch.shoulderWidth : bestMatch.hipShape
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
