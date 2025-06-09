
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
  
  // Height matching (most important) - score 0-40
  const heightDiff = Math.abs(entry.stature - targetHeight);
  const heightScore = Math.max(0, 40 - (heightDiff / 10)); // Penalty increases with height difference
  score += heightScore;
  
  // Weight matching (second most important) - score 0-30
  const weightDiff = Math.abs(entry.weight - targetWeight);
  const weightScore = Math.max(0, 30 - weightDiff); // Penalty of 1 point per kg difference
  score += weightScore;
  
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
    heightScore: heightScore.toFixed(1),
    weightScore: weightScore.toFixed(1),
    bellyMatch: entry.bellyShape === targetBellyShape,
    secondShapeMatch: entrySecondShape === targetSecondShape,
    totalScore: score.toFixed(1)
  });
  
  return score;
}

/**
 * Find the closest matching avatar and return both image number and recommended size
 * Updated with improved matching algorithm that handles partial matches
 */
export async function findClosestAvatarWithSizeOld(
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
    
    console.log('📊 Sample entries from JSON data:', genderData.slice(0, 5).map(entry => ({
      fileName: entry.fileName,
      stature: entry.stature,
      weight: entry.weight,
      bellyShape: entry.bellyShape,
      hipShape: entry.hipShape,
      shoulderWidth: entry.shoulderWidth,
      recommendedSize: entry.recommendedSize
    })));
    
    // First, try to find exact matches for shapes
    let exactMatches;
    console.log({genderData})
    if (gender === 'male') {
      exactMatches = genderData.filter((entry) => {
        return entry.bellyShape === bellyShape && entry.shoulderWidth === hipShapeOrShoulderWidth;
      });
    } else {
      exactMatches = genderData.filter((entry) => {
        return entry.bellyShape === bellyShape && entry.hipShape === hipShapeOrShoulderWidth;
      });
    }
    
    console.log(`🎯 Found ${exactMatches.length} exact shape matches`);
    
    // If we have exact shape matches, find the best one by height/weight
    if (exactMatches.length > 0) {
      console.log('✅ Using exact shape matches for final selection');
      let bestMatch = exactMatches[0];
      let smallestHeightDiff = Math.abs(bestMatch.stature - height);
      let smallestWeightDiff = Math.abs(bestMatch.weight - weight);
      
      for (const entry of exactMatches) {
        const heightDiff = Math.abs(entry.stature - height);
        const weightDiff = Math.abs(entry.weight - weight);
        
        if (heightDiff < smallestHeightDiff || 
            (heightDiff === smallestHeightDiff && weightDiff < smallestWeightDiff)) {
          smallestHeightDiff = heightDiff;
          smallestWeightDiff = weightDiff;
          bestMatch = entry;
        }
      }
      
      const imageNumber = extractImageNumber(bestMatch.fileName);
      const recommendedSize = bestMatch.recommendedSize || calculateSize(height, weight);
      
      console.log('✅ EXACT MATCH RESULT:', {
        closestMatch: bestMatch.fileName,
        imageNumber,
        recommendedSize,
        heightDiff: smallestHeightDiff,
        weightDiff: smallestWeightDiff
      });
      console.log('=== AVATAR MATCHING DEBUG END ===');
      
      return { imageNumber, recommendedSize };
    }
    
    // If no exact shape matches, use similarity scoring for all entries
    console.log('⚠️ No exact shape matches found, using similarity scoring for all entries');
    
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
    
    console.log('✅ SIMILARITY MATCH RESULT:', {
      closestMatch: bestMatch.fileName,
      imageNumber,
      recommendedSize,
      finalScore: bestScore.toFixed(1),
      matchDetails: {
        height: bestMatch.stature,
        weight: bestMatch.weight,
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

export async function findClosestAvatarWithSize(
  height: number,
  weight: number,
  bellyShape: 'flat' | 'round' | 'curvy' | null,
  hipShapeOrShoulderWidth: 'slim' | 'regular' | 'full' | '1' | '2' | '3' | null,
  gender: 'male' | 'female'
): Promise<{ imageNumber: number | null; recommendedSize: string }> {
  console.log('=== AVATAR MATCHING DEBUG START ===');
  console.log({bellyShape})
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
    
    console.log('📊 Sample entries from JSON data:', genderData.slice(0, 5).map(entry => ({
      fileName: entry.fileName,
      stature: entry.stature,
      weight: entry.weight,
      bellyShape: entry.bellyShape,
      hipShape: entry.hipShape,
      shoulderWidth: entry.shoulderWidth,
      recommendedSize: entry.recommendedSize
    })));
    
    let closestMatches: AvatarData[] = [];
    const statures = genderData.map(entry => entry.stature);
    const closestStature = statures.reduce((prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
    );

    console.log("✅ Closest stature found:", closestStature);

    closestMatches = genderData.filter(entry => entry.stature === closestStature);
    const closestWeight = genderData.reduce((prev, curr) =>
      Math.abs(curr.weight - weight) < Math.abs(prev.weight - weight)
      ? curr
      : prev
    ).weight;

    console.log("✅ Closest weight found:", closestWeight);

    closestMatches = closestMatches.filter(entry => entry.weight === closestWeight);
    closestMatches = closestMatches.filter(entry => entry.bellyShape === bellyShape);
    
    if (gender === 'male') {
      closestMatches = closestMatches.sort((a, b) => {
        const aMatch = a.shoulderWidth != null && a.shoulderWidth === hipShapeOrShoulderWidth ? 0 : 1;
        const bMatch = b.shoulderWidth != null && b.shoulderWidth === hipShapeOrShoulderWidth ? 0 : 1;
        return aMatch - bMatch;
      });
    } else {
      closestMatches = closestMatches.filter((entry) => {
        return entry.hipShape === hipShapeOrShoulderWidth;
      });
      console.log({closestMatches})
    }

    const bestMatch = closestMatches[0];
    const imageNumber = extractImageNumber(bestMatch.fileName);
    const recommendedSize = bestMatch.recommendedSize || calculateSize(height, weight);

    console.log({bestMatch, imageNumber, recommendedSize})
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
