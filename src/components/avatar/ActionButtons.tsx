
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
      <Button className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 rounded-full font-medium text-lg">
        Add Size {selectedSize} to Cart 🛒
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onRestart}
        className="w-full py-3 border-coral-200 text-coral-600 hover:bg-coral-50 rounded-full"
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
