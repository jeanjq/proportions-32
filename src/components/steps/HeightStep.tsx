
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler } from 'lucide-react';

interface HeightStepProps {
  value: number;
  onChange: (height: number) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({ value, onChange }) => {
  // Generate height options from 140cm to 200cm
  const heightOptions = [];
  for (let i = 140; i <= 200; i++) {
    heightOptions.push(i);
  }

  // Average heights: European women ~165cm, European men ~178cm
  const getDefaultHeight = () => {
    return 170; // A middle ground between average male and female heights
  };

  return (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Ruler className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What's your height?</h2>
        <p className="text-gray-600">Help us get the proportions just right!</p>
      </div>

      <div className="max-w-xs mx-auto">
        <Label htmlFor="height" className="text-base font-medium text-gray-700 block mb-3">
          Height in centimeters
        </Label>
        <Select 
          value={value ? value.toString() : ""} 
          onValueChange={(val) => onChange(Number(val))}
          defaultValue={getDefaultHeight().toString()}
        >
          <SelectTrigger className="text-center text-lg py-6 border-2 border-gray-200 focus:border-coral-400 rounded-full">
            <SelectValue placeholder="Select your height" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg">
            {heightOptions.map((height) => (
              <SelectItem key={height} value={height.toString()} className="text-center">
                {height} cm
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
