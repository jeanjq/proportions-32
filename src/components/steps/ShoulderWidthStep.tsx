
import React from 'react';
import { cn } from "@/lib/utils";

interface ShoulderWidthStepProps {
  value: '1' | '2' | '3' | null;
  onChange: (width: '1' | '2' | '3') => void;
}

export const ShoulderWidthStep: React.FC<ShoulderWidthStepProps> = ({ value, onChange }) => {
  const widths = [
    {
      id: '1' as const,
      label: 'Small',
      description: 'Narrow shoulders',
      icon: '📏'
    },
    {
      id: '2' as const,
      label: 'Medium',
      description: 'Average shoulders',
      icon: '⚖️'
    },
    {
      id: '3' as const,
      label: 'Large',
      description: 'Broad shoulders',
      icon: '💪'
    }
  ];

  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-lg">
          <span className="text-3xl text-white">💪</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What's your shoulder width?</h2>
        <p className="text-gray-600">Last question! Just one more click! 🎉</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {widths.map((width) => (
          <button
            key={width.id}
            onClick={() => onChange(width.id)}
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-coral-200/40 backdrop-blur-md shadow-lg hover:shadow-xl",
              value === width.id
                ? "border-coral-300/60 bg-gradient-to-r from-coral-200/30 to-peach-200/30 shadow-xl ring-2 ring-coral-300/50"
                : "border-white/20 bg-white/10 hover:border-coral-200/40 hover:bg-gradient-to-r hover:from-coral-100/20 hover:to-peach-100/20"
            )}
          >
            <div className="text-4xl mb-3">{width.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{width.label}</h3>
            <p className="text-sm text-gray-600">{width.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
