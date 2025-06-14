
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler } from 'lucide-react';

interface HeightStepProps {
  value: number;
  onChange: (height: number) => void;
  gender?: 'male' | 'female';
}

export const HeightStep: React.FC<HeightStepProps> = ({ value, onChange, gender = 'female' }) => {
  const [availableHeights, setAvailableHeights] = useState<{title: string, value: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHeights() {
      try {
        // Generate a comprehensive list of heights from 140cm to 210cm
        const heights: {title: string, value: number}[] = [];
        for (let i = 140; i <= 210; i++) {
          heights.push({
            title: `${i}cm`,
            value: i
          });
        }
        setAvailableHeights(heights);
      } catch (error) {
        console.error('Error loading height options:', error);
        // Fallback heights
        const fallbackHeights: {title: string, value: number}[] = [];
        for (let i = 150; i <= 200; i += 5) {
          fallbackHeights.push({
            title: `${i}cm`,
            value: i
          });
        }
        setAvailableHeights(fallbackHeights);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadHeights();
  }, [gender]);

  return (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-lg">
          <Ruler className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your height?</h2>
        <p className="text-gray-600">This helps us find clothes that fit your proportions perfectly.</p>
      </div>

      <div className="max-w-xs mx-auto">
        <Label htmlFor="height" className="text-base font-medium text-gray-700 block mb-3">
          Height
        </Label>
        <Select 
          value={value ? value.toString() : ""} 
          onValueChange={(val) => onChange(parseInt(val))}
          disabled={isLoading}
        >
          <SelectTrigger className="text-center text-lg py-6 border-2 bg-white/10 backdrop-blur-md border-white/20 hover:border-coral-200/40 rounded-full shadow-lg focus:ring-0 focus:ring-offset-0 focus:border-coral-300/60">
            <SelectValue placeholder={isLoading ? "Loading..." : "Select your height"} />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white/90 backdrop-blur-md border border-white/30 shadow-lg">
            {availableHeights.map((height) => (
              <SelectItem key={height.value} value={height.value.toString()} className="text-center hover:bg-coral-100/20">
                {height.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
