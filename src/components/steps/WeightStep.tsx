
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale } from 'lucide-react';

interface WeightStepProps {
  value: number;
  onChange: (weight: number) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({ value, onChange }) => {
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
        <div className="relative">
          <Input
            id="weight"
            type="number"
            placeholder="e.g., 65"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            className="text-center text-lg py-4 border-2 border-gray-200 focus:border-coral-400 rounded-full"
            min="40"
            max="150"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            kg
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">We keep this private & secure</p>
      </div>
    </div>
  );
};
