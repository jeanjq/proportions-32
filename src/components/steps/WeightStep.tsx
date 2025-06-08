
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
        <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-lg">
          <Scale className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your weight?</h2>
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
          <SelectTrigger className="text-center text-lg py-6 border-2 bg-white/10 backdrop-blur-md border-white/20 hover:border-coral-200/40 rounded-full shadow-lg focus:ring-0 focus:ring-offset-0 focus:border-coral-300/60">
            <SelectValue placeholder="Select your weight" />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
            {weightOptions.map((weight) => (
              <SelectItem key={weight} value={weight.toString()} className="text-center hover:bg-coral-100/20">
                {weight} kg
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
