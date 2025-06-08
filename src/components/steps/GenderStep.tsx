
import React from 'react';
import { cn } from "@/lib/utils";
import { User } from 'lucide-react';

interface GenderStepProps {
  value: 'male' | 'female' | 'non-binary' | null;
  onChange: (gender: 'male' | 'female' | 'non-binary') => void;
}

export const GenderStep: React.FC<GenderStepProps> = ({ value, onChange }) => {
  const genders = [
    {
      id: 'female' as const,
      label: 'Female',
      icon: '👩'
    },
    {
      id: 'male' as const,
      label: 'Male',
      icon: '👨'
    },
    {
      id: 'non-binary' as const,
      label: 'Non-binary / Other',
      icon: '🧑'
    }
  ];

  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">How do you identify?</h2>
        <p className="text-gray-600">This helps us provide the most accurate fit recommendations.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {genders.map((gender) => (
          <button
            key={gender.id}
            onClick={() => onChange(gender.id)}
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-coral-200/40 backdrop-blur-md shadow-lg hover:shadow-xl",
              value === gender.id
                ? "border-coral-300/60 bg-gradient-to-r from-coral-200/30 to-peach-200/30 shadow-xl ring-2 ring-coral-300/50"
                : "border-white/20 bg-white/10 hover:border-coral-200/40 hover:bg-gradient-to-r hover:from-coral-100/20 hover:to-peach-100/20"
            )}
          >
            <div className="text-4xl mb-3">{gender.icon}</div>
            <h3 className="font-semibold text-gray-800">{gender.label}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};
