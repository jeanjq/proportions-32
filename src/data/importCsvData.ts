
import { AvatarData } from "../utils/avatarMatching";

// Firebase storage URLs for the new CSV files
export const FIREBASE_STORAGE_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o";
export const MALE_CSV_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Male%20(2).csv?alt=media&token=9ee2e53e-a258-45d8-aea5-39eb91cf4521";
export const FEMALE_CSV_URL = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Female%20(2).csv?alt=media&token=44dfd6d2-be91-4920-97f0-cde218d3903e";

// Function to parse CSV data
function parseCSV(csvText: string): any[] {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
  }
  
  return data;
}

// Function to fetch CSV data for a specific gender
export async function fetchGenderSpecificData(gender: 'male' | 'female'): Promise<AvatarData[]> {
  try {
    const csvUrl = gender === 'male' ? MALE_CSV_URL : FEMALE_CSV_URL;
    console.log(`Fetching ${gender} data from:`, csvUrl);
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      console.error(`Failed to fetch ${gender} data: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch ${gender} data: ${response.status}`);
    }
    
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);
    console.log(`${gender} data fetched successfully, sample:`, parsedData.slice(0, 2));
    
    // Process the data to match our AvatarData interface
    return parsedData.map((item: any) => ({
      fileName: item["File Name"] || item["image_number"] || "",
      stature: parseFloat(item["Stature"] || item["Height"]) || 0,
      weight: parseFloat(item["Weight"]) || 0,
      waistCirc: parseFloat(item["WaistCirc"] || item["Waist"]) || 0,
      chestCirc: parseFloat(item["ChestCirc"] || item["Chest"]) || 0,
      hipCirc: parseFloat(item["HipCirc"] || item["Hip"]) || 0,
      crotchHeight: parseFloat(item["CrotchHeight"] || item["Crotch"]) || 0,
      underBustCirc: parseFloat(item["UnderBustCirc"] || item["UnderBust"]) || 0,
      bellyShape: item["Shape1"] || item["BellyShape"] || "flat",
      hipShape: item["Shape2"] || item["HipShape"] || "regular",
      recommendedSize: item["Size"] || item["Recommended Size"] || item[Object.keys(item)[Object.keys(item).length - 1]] || "M" // Use last column as fallback
    }));
  } catch (error) {
    console.error(`Error fetching or processing ${gender} avatar data:`, error);
    return exampleAvatarData; // Fall back to example data
  }
}

// Legacy function for backward compatibility
export async function fetchAvatarData(): Promise<AvatarData[]> {
  // Default to female data for backward compatibility
  return fetchGenderSpecificData('female');
}

// For demonstration, keep the example entries
export const exampleAvatarData: AvatarData[] = [
  {
    fileName: "adidas_428",
    stature: 165,
    weight: 60,
    waistCirc: 70,
    chestCirc: 90,
    hipCirc: 95,
    crotchHeight: 75,
    underBustCirc: 75,
    bellyShape: "flat",
    hipShape: "regular"
  },
  {
    fileName: "adidas_105",
    stature: 170,
    weight: 75,
    waistCirc: 80,
    chestCirc: 100,
    hipCirc: 100,
    crotchHeight: 80,
    underBustCirc: 80,
    bellyShape: "round",
    hipShape: "full"
  },
  {
    fileName: "adidas_201",
    stature: 160,
    weight: 55,
    waistCirc: 65,
    chestCirc: 85,
    hipCirc: 90,
    crotchHeight: 70,
    underBustCirc: 70,
    bellyShape: "curvy",
    hipShape: "slim"
  }
];

// Export the example data for testing purposes
export default exampleAvatarData;
