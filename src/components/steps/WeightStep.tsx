
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale } from 'lucide-react';
import { getAvailableRanges } from '@/data/importCsvData';

interface WeightStepProps {
  value: string;
  onChange: (weight: string) => void;
  gender?: 'male' | 'female';
}

export const WeightStep: React.FC<WeightStepProps> = ({ value, onChange, gender = 'female' }) => {
  const [availableRanges, setAvailableRanges] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRanges() {
      try {
        const { weightRanges } = await getAvailableRanges(gender);
        setAvailableRanges(weightRanges);
      } catch (error) {
        console.error('Error loading weight ranges:', error);
        // Fallback ranges
        setAvailableRanges(['40kg - 44kg', '45kg - 54kg', '55kg - 64kg', '65kg - 74kg', '75kg - 84kg', '85kg - 120kg']);
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
          <Scale className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your weight?</h2>
        <p className="text-gray-600">Almost there! Choose the range that fits you best.</p>
      </div>

      <div className="max-w-xs mx-auto">
        <Label htmlFor="weight" className="text-base font-medium text-gray-700 block mb-3">
          Weight range
        </Label>
        <Select 
          value={value || ""} 
          onValueChange={onChange}
          disabled={isLoading}
        >
          <SelectTrigger className="text-center text-lg py-6 border-2 bg-white/10 backdrop-blur-md border-white/20 hover:border-coral-200/40 rounded-full shadow-lg focus:ring-0 focus:ring-offset-0 focus:border-coral-300/60">
            <SelectValue placeholder={isLoading ? "Loading..." : "Select your weight range"} />
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
