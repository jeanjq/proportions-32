
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
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">How do you identify?</h2>
        <p className="text-gray-600">This helps us provide the most accurate fit recommendations.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {genders.map((gender) => (
          <button
            key={gender.id}
            onClick={() => onChange(gender.id)}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-coral-200",
              value === gender.id
                ? "border-coral-400 bg-coral-50 shadow-lg"
                : "border-gray-200 hover:border-coral-300 hover:bg-coral-25"
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
