
import React from 'react';
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  selectedSize: string;
  onRestart: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ selectedSize, onRestart }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full bg-gradient-to-r from-coral-500/90 to-peach-500/90 hover:from-coral-600/90 hover:to-peach-600/90 text-white border-0 rounded-full font-medium shadow-lg transition-all duration-200"
          >
            Add to Cart - Size {selectedSize}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onRestart}
            className="w-full border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-gray-700 rounded-full font-medium shadow-lg transition-all duration-200"
          >
            Try Different Measurements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
