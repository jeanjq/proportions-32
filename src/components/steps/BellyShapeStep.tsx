
import React from 'react';
import { cn } from "@/lib/utils";

interface BellyShapeStepProps {
  value: 'flat' | 'round' | 'curvy' | null;
  onChange: (shape: 'flat' | 'round' | 'curvy') => void;
}

export const BellyShapeStep: React.FC<BellyShapeStepProps> = ({ value, onChange }) => {
  const shapes = [
    {
      id: 'flat' as const,
      label: 'Flat',
      description: 'Minimal curve',
      icon: '⬜'
    },
    {
      id: 'round' as const,
      label: 'Round',
      description: 'Gentle curve',
      icon: '🔵'
    },
    {
      id: 'curvy' as const,
      label: 'Curvy',
      description: 'Pronounced curve',
      icon: '🌙'
    }
  ];

  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl">🤰</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What's your belly shape?</h2>
        <p className="text-gray-600">Choose the shape that best describes you!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onChange(shape.id)}
            className={cn(
              "p-6 rounded-2xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-coral-200",
              value === shape.id
                ? "border-coral-400 bg-coral-50 shadow-lg"
                : "border-gray-200 hover:border-coral-300 hover:bg-coral-25"
            )}
          >
            <div className="text-4xl mb-3">{shape.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{shape.label}</h3>
            <p className="text-sm text-gray-600">{shape.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
