
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale } from 'lucide-react';

interface WeightStepProps {
  value: number;
  onChange: (weight: number) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({ value, onChange }) => {
  // Generate weight options from 40kg to 120kg
  const weightOptions = [];
  for (let i = 40; i <= 120; i++) {
    weightOptions.push(i);
  }

  // Average weights: European women ~65kg, European men ~82kg
  const getDefaultWeight = () => {
    return 70; // A middle ground between average male and female weights
  };

  return (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Scale className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What's your weight?</h2>
        <p className="text-gray-600">Almost there! This helps us choose the right size.</p>
      </div>

      <div className="max-w-xs mx-auto">
        <Label htmlFor="weight" className="text-base font-medium text-gray-700 block mb-3">
          Weight in kilograms
        </Label>
        <Select 
          value={value ? value.toString() : ""} 
          onValueChange={(val) => onChange(Number(val))}
          defaultValue={getDefaultWeight().toString()}
        >
          <SelectTrigger className="text-center text-lg py-6 border-2 border-gray-200 focus:border-coral-400 rounded-full">
            <SelectValue placeholder="Select your weight" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white border border-gray-200 shadow-lg">
            {weightOptions.map((weight) => (
              <SelectItem key={weight} value={weight.toString()} className="text-center">
                {weight} kg
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
