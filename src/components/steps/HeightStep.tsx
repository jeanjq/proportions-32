
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler } from 'lucide-react';
import { getAvailableMeasurements } from '@/utils/avatar/dataUtils';

interface HeightStepProps {
  value: number;
  onChange: (height: number) => void;
  gender: 'male' | 'female' | 'non-binary' | null;
}

export const HeightStep: React.FC<HeightStepProps> = ({ value, onChange, gender }) => {
  const [availableHeights, setAvailableHeights] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvailableHeights = async () => {
      if (!gender || gender === 'non-binary') {
        // For non-binary, we'll use female data as default
        const effectiveGender = 'female';
        setIsLoading(true);
        try {
          const measurements = await getAvailableMeasurements(effectiveGender);
          setAvailableHeights(measurements.heights);
        } catch (error) {
          console.error('Failed to load heights:', error);
          // Fallback to default range
          const fallback = [];
          for (let i = 150; i <= 190; i += 5) {
            fallback.push(i);
          }
          setAvailableHeights(fallback);
        }
        setIsLoading(false);
      } else {
        setIsLoading(true);
        try {
          const measurements = await getAvailableMeasurements(gender);
          setAvailableHeights(measurements.heights);
        } catch (error) {
          console.error('Failed to load heights:', error);
          // Fallback to default range
          const fallback = [];
          for (let i = 150; i <= 190; i += 5) {
            fallback.push(i);
          }
          setAvailableHeights(fallback);
        }
        setIsLoading(false);
      }
    };

    loadAvailableHeights();
  }, [gender]);

  const getDefaultHeight = () => {
    if (availableHeights.length === 0) return 170;
    
    // Find the height closest to average (170cm)
    const target = 170;
    return availableHeights.reduce((prev, curr) => 
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
  };

  return (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-lg">
          <Ruler className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your height?</h2>
        <p className="text-gray-600">Choose from available measurements in our avatar database</p>
      </div>

      <div className="max-w-xs mx-auto">
        <Label htmlFor="height" className="text-base font-medium text-gray-700 block mb-3">
          Height in centimeters
        </Label>
        {isLoading ? (
          <div className="text-center py-6 text-gray-500">Loading available heights...</div>
        ) : (
          <Select 
            value={value ? value.toString() : ""} 
            onValueChange={(val) => onChange(Number(val))}
            defaultValue={getDefaultHeight().toString()}
          >
            <SelectTrigger className="text-center text-lg py-6 border-2 bg-white/10 backdrop-blur-md border-white/20 hover:border-coral-200/40 rounded-full shadow-lg focus:ring-0 focus:ring-offset-0 focus:border-coral-300/60">
              <SelectValue placeholder="Select your height" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white/90 backdrop-blur-md border border-white/30 shadow-lg">
              {availableHeights.map((height) => (
                <SelectItem key={height} value={height.toString()} className="text-center hover:bg-coral-100/20">
                  {height} cm
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
