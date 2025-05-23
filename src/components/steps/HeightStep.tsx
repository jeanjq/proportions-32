
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler } from 'lucide-react';

interface HeightStepProps {
  value: number;
  onChange: (height: number) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({ value, onChange }) => {
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
        <div className="relative">
          <Input
            id="height"
            type="number"
            placeholder="e.g., 165"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            className="text-center text-lg py-4 border-2 border-gray-200 focus:border-coral-400 rounded-full"
            min="120"
            max="220"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            cm
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Usually between 150-190 cm</p>
      </div>
    </div>
  );
};
