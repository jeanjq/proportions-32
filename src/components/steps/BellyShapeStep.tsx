
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
        <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-lg">
          <span className="text-2xl">🤰</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your belly shape?</h2>
        <p className="text-gray-600">Choose the shape that best describes you!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onChange(shape.id)}
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-coral-200/40 backdrop-blur-md shadow-lg hover:shadow-xl",
              value === shape.id
                ? "border-coral-300/60 bg-gradient-to-r from-coral-200/30 to-peach-200/30 shadow-xl ring-2 ring-coral-300/50"
                : "border-white/20 bg-white/10 hover:border-coral-200/40 hover:bg-gradient-to-r hover:from-coral-100/20 hover:to-peach-100/20"
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
