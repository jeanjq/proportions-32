
import React from 'react';
import { cn } from "@/lib/utils";
import { User } from 'lucide-react';

interface PhysiqueStepProps {
  value: string[];
  onChange: (features: string[]) => void;
}

export const PhysiqueStep: React.FC<PhysiqueStepProps> = ({ value, onChange }) => {
  const physiques = [
    {
      id: 'wider-hips',
      label: 'Wider hips',
      description: 'Hip area is wider than shoulders'
    },
    {
      id: 'narrow-hips',
      label: 'Narrow hips',
      description: 'Hip area is narrower than shoulders'
    },
    {
      id: 'broad-shoulders',
      label: 'Broad shoulders',
      description: 'Shoulders are wider than hips'
    },
    {
      id: 'curvier-torso',
      label: 'Curvier torso',
      description: 'More defined waist and curves'
    },
    {
      id: 'straighter-silhouette',
      label: 'Straighter silhouette',
      description: 'More linear body shape'
    }
  ];

  const toggleFeature = (featureId: string) => {
    const newValue = value.includes(featureId)
      ? value.filter(id => id !== featureId)
      : [...value, featureId];
    onChange(newValue);
  };

  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <div className="w-16 h-16 bg-lime-400/30 backdrop-blur-md border border-lime-300/40 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Which body features describe you best?</h2>
        <p className="text-gray-600">Select all that apply to help us find the perfect fit for your body shape.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {physiques.map((physique) => (
          <button
            key={physique.id}
            onClick={() => toggleFeature(physique.id)}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-lime-200/40 backdrop-blur-md shadow-lg hover:shadow-xl text-left",
              value.includes(physique.id)
                ? "border-lime-300/60 bg-lime-200/30 shadow-xl ring-2 ring-lime-300/50"
                : "border-white/20 bg-white/10 hover:border-lime-200/40 hover:bg-lime-100/20"
            )}
          >
            <h3 className="font-semibold text-gray-800 mb-1">{physique.label}</h3>
            <p className="text-sm text-gray-600">{physique.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
