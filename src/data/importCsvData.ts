
import { AvatarData } from "../utils/avatarMatching";

/**
 * This file is a placeholder for importing and processing your CSV data.
 * In a real implementation, you would:
 * 1. Convert your CSV to JSON
 * 2. Import the JSON file
 * 3. Process the data as needed
 * 
 * Example:
 * import rawAvatarData from './avatar-data.json';
 * 
 * export const processedAvatarData: AvatarData[] = rawAvatarData.map(item => ({
 *   fileName: item["File Name"],
 *   stature: parseFloat(item["Stature"]),
 *   weight: parseFloat(item["Weight"]),
 *   waistCirc: parseFloat(item["WaistCirc"]),
 *   chestCirc: parseFloat(item["ChestCirc"]),
 *   hipCirc: parseFloat(item["HipCirc"]),
 *   crotchHeight: parseFloat(item["CrotchHeight"]),
 *   underBustCirc: parseFloat(item["UnderBustCirc"]),
 *   bellyShape: item["Shape1"],
 *   hipShape: item["Shape2"],
 * }));
 */

// For demonstration, add a few example entries
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
// In a real implementation, you would export your processed data from the CSV
export default exampleAvatarData;
