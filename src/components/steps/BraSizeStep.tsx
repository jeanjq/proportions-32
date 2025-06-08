
import React from 'react';
import { cn } from "@/lib/utils";
import { Heart } from 'lucide-react';

interface BraSizeStepProps {
  value: string | null;
  onChange: (size: string) => void;
}

export const BraSizeStep: React.FC<BraSizeStepProps> = ({ value, onChange }) => {
  const sizes = ['A', 'B', 'C', 'D', 'DD', 'E', 'F', 'G'];

  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What's your bra cup size?</h2>
        <p className="text-gray-600">This helps us ensure the perfect fit around your bust area.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-coral-200 font-semibold",
              value === size
                ? "border-coral-400 bg-coral-50 shadow-lg text-coral-600"
                : "border-gray-200 hover:border-coral-300 hover:bg-coral-25 text-gray-700"
            )}
          >
            {size}
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-4">Your information is kept private and secure</p>
    </div>
  );
};
