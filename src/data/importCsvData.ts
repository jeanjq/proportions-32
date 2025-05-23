import { AvatarData } from "../utils/avatarMatching";

// Firebase storage URLs
export const FIREBASE_STORAGE_BASE_URL = "https://storage.googleapis.com/proportions-b1093.firebasestorage.app";
export const JSON_DATA_URL = `${FIREBASE_STORAGE_BASE_URL}/csvjson%20(1).json`;

// Function to fetch the avatar data from the Firebase JSON
export async function fetchAvatarData(): Promise<AvatarData[]> {
  try {
    const response = await fetch(JSON_DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the data to match our AvatarData interface
    return data.map((item: any) => ({
      fileName: item["File Name"] || "",
      stature: parseFloat(item["Stature"]) || 0,
      weight: parseFloat(item["Weight"]) || 0,
      waistCirc: parseFloat(item["WaistCirc"]) || 0,
      chestCirc: parseFloat(item["ChestCirc"]) || 0,
      hipCirc: parseFloat(item["HipCirc"]) || 0,
      crotchHeight: parseFloat(item["CrotchHeight"]) || 0,
      underBustCirc: parseFloat(item["UnderBustCirc"]) || 0,
      bellyShape: item["Shape1"] || "flat",
      hipShape: item["Shape2"] || "regular",
    }));
  } catch (error) {
    console.error("Error fetching or processing avatar data:", error);
    return exampleAvatarData; // Fall back to example data
  }
}

// For demonstration, keep the example entries
export const exampleAvatarData: AvatarData[] = [
  {
    fileName: "avatar_1.png",
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
    fileName: "avatar_2.png",
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
    fileName: "avatar_3.png",
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
