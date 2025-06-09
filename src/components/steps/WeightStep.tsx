
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale } from 'lucide-react';
import { getAvailableMeasurements } from '@/utils/avatar/dataUtils';

interface WeightStepProps {
  value: number;
  onChange: (weight: number) => void;
  gender: 'male' | 'female' | 'non-binary' | null;
}

export const WeightStep: React.FC<WeightStepProps> = ({ value, onChange, gender }) => {
  const [availableWeights, setAvailableWeights] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvailableWeights = async () => {
      if (!gender || gender === 'non-binary') {
        // For non-binary, we'll use female data as default
        const effectiveGender = 'female';
        setIsLoading(true);
        try {
          const measurements = await getAvailableMeasurements(effectiveGender);
          setAvailableWeights(measurements.weights);
        } catch (error) {
          console.error('Failed to load weights:', error);
          // Fallback to default range
          const fallback = [];
          for (let i = 50; i <= 100; i += 5) {
            fallback.push(i);
          }
          setAvailableWeights(fallback);
        }
        setIsLoading(false);
      } else {
        setIsLoading(true);
        try {
          const measurements = await getAvailableMeasurements(gender);
          setAvailableWeights(measurements.weights);
        } catch (error) {
          console.error('Failed to load weights:', error);
          // Fallback to default range
          const fallback = [];
          for (let i = 50; i <= 100; i += 5) {
            fallback.push(i);
          }
          setAvailableWeights(fallback);
        }
        setIsLoading(false);
      }
    };

    loadAvailableWeights();
  }, [gender]);

  const getDefaultWeight = () => {
    if (availableWeights.length === 0) return 70;
    
    // Find the weight closest to average (70kg)
    const target = 70;
    return availableWeights.reduce((prev, curr) => 
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
  };

  return (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-lg">
          <Scale className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your weight?</h2>
        <p className="text-gray-600">Choose from available measurements in our avatar database</p>
      </div>

      <div className="max-w-xs mx-auto">
        <Label htmlFor="weight" className="text-base font-medium text-gray-700 block mb-3">
          Weight in kilograms
        </Label>
        {isLoading ? (
          <div className="text-center py-6 text-gray-500">Loading available weights...</div>
        ) : (
          <Select 
            value={value ? value.toString() : ""} 
            onValueChange={(val) => onChange(Number(val))}
            defaultValue={getDefaultWeight().toString()}
          >
            <SelectTrigger className="text-center text-lg py-6 border-2 bg-white/10 backdrop-blur-md border-white/20 hover:border-coral-200/40 rounded-full shadow-lg focus:ring-0 focus:ring-offset-0 focus:border-coral-300/60">
              <SelectValue placeholder="Select your weight" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white/90 backdrop-blur-md border border-white/30 shadow-lg">
              {availableWeights.map((weight) => (
                <SelectItem key={weight} value={weight.toString()} className="text-center hover:bg-coral-100/20">
                  {weight} kg
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
