
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw } from 'lucide-react';

interface ActionButtonsProps {
  selectedSize: string;
  onRestart: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedSize,
  onRestart
}) => {
  return (
    <div className="space-y-3">
      <Button className="w-full py-4 bg-orange-400/30 hover:bg-orange-400/40 backdrop-blur-md border border-orange-300/40 text-gray-800 rounded-full font-medium text-lg shadow-lg">
        Add Size {selectedSize} to Cart 🛒
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onRestart}
        className="w-full py-3 border-white/20 bg-white/10 backdrop-blur-md text-gray-700 hover:bg-orange-100/20 hover:border-orange-200/40 rounded-full shadow-lg"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        💡 Not sure? You can always exchange for a different size!
      </p>
    </div>
  );
};

export default ActionButtons;
