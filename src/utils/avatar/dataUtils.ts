
import { fetchGenderSpecificData } from '@/data/importCsvData';

export interface AvailableMeasurements {
  heights: number[];
  weights: number[];
}

/**
 * Get available height and weight values from the avatar data for a specific gender
 */
export async function getAvailableMeasurements(gender: 'male' | 'female'): Promise<AvailableMeasurements> {
  try {
    const genderData = await fetchGenderSpecificData(gender);
    
    // Extract unique heights and weights, then sort them
    const heights = [...new Set(genderData.map(entry => entry.stature))].sort((a, b) => a - b);
    const weights = [...new Set(genderData.map(entry => entry.weight))].sort((a, b) => a - b);
    
    console.log(`📊 Available measurements for ${gender}:`, {
      heights: heights.length,
      weights: weights.length,
      heightRange: `${Math.min(...heights)} - ${Math.max(...heights)}cm`,
      weightRange: `${Math.min(...weights)} - ${Math.max(...weights)}kg`
    });
    
    return { heights, weights };
  } catch (error) {
    console.error(`❌ Error loading measurements for ${gender}:`, error);
    
    // Fallback to default ranges if data loading fails
    const fallbackHeights = [];
    for (let i = 150; i <= 190; i += 5) {
      fallbackHeights.push(i);
    }
    
    const fallbackWeights = [];
    for (let i = 50; i <= 100; i += 5) {
      fallbackWeights.push(i);
    }
    
    return {
      heights: fallbackHeights,
      weights: fallbackWeights
    };
  }
}
