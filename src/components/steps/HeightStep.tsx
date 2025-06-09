
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ruler } from 'lucide-react';
import { getAvailableRanges } from '@/data/importCsvData';

interface HeightStepProps {
  value: string;
  onChange: (height: string) => void;
  gender?: 'male' | 'female';
}

export const HeightStep: React.FC<HeightStepProps> = ({ value, onChange, gender = 'female' }) => {
  const [availableRanges, setAvailableRanges] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRanges() {
      try {
        const { heightRanges } = await getAvailableRanges(gender);
        setAvailableRanges(heightRanges);
      } catch (error) {
        console.error('Error loading height ranges:', error);
        // Fallback ranges
        setAvailableRanges(['140cm - 152cm', '153cm - 165cm', '166cm - 178cm', '179cm - 191cm', '192cm - 200cm']);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadRanges();
  }, [gender]);

  return (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-lg">
          <Ruler className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your height?</h2>
        <p className="text-gray-600">Choose the range that best fits you!</p>
      </div>

      <div className="max-w-xs mx-auto">
        <Label htmlFor="height" className="text-base font-medium text-gray-700 block mb-3">
          Height range
        </Label>
        <Select 
          value={value || ""} 
          onValueChange={onChange}
          disabled={isLoading}
        >
          <SelectTrigger className="text-center text-lg py-6 border-2 bg-white/10 backdrop-blur-md border-white/20 hover:border-coral-200/40 rounded-full shadow-lg focus:ring-0 focus:ring-offset-0 focus:border-coral-300/60">
            <SelectValue placeholder={isLoading ? "Loading..." : "Select your height range"} />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
            {availableRanges.map((range) => (
              <SelectItem key={range} value={range} className="text-center hover:bg-coral-100/20">
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
