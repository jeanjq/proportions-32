
import React from 'react';
import { cn } from "@/lib/utils";

interface HipShapeStepProps {
  value: 'slim' | 'regular' | 'full' | null;
  onChange: (shape: 'slim' | 'regular' | 'full') => void;
}

export const HipShapeStep: React.FC<HipShapeStepProps> = ({ value, onChange }) => {
  const shapes = [
    {
      id: 'slim' as const,
      label: 'Slim',
      description: 'Narrow hips',
      icon: '📏'
    },
    {
      id: 'regular' as const,
      label: 'Regular',
      description: 'Balanced hips',
      icon: '⚖️'
    },
    {
      id: 'full' as const,
      label: 'Full',
      description: 'Fuller hips',
      icon: '🍐'
    }
  ];

  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <div className="w-16 h-16 bg-lime-400/30 backdrop-blur-md border border-lime-300/40 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What about your hip shape?</h2>
        <p className="text-gray-600">Last question! Just one more click! 🎉</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            onClick={() => onChange(shape.id)}
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-lime-200/40 backdrop-blur-md shadow-lg hover:shadow-xl",
              value === shape.id
                ? "border-lime-300/60 bg-lime-200/30 shadow-xl ring-2 ring-lime-300/50"
                : "border-white/20 bg-white/10 hover:border-lime-200/40 hover:bg-lime-100/20"
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
