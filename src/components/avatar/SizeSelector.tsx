
import React from 'react';
import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
  selectedSize: string;
  onSelectSize: (size: string) => void;
  sizes: string[];
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ 
  selectedSize, 
  onSelectSize,
  sizes 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Try Different Sizes</h3>
      <div className="flex justify-center gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            onClick={() => onSelectSize(size)}
            className={selectedSize === size 
              ? "bg-gradient-to-r from-coral-500 to-peach-500 border-0" 
              : "border-coral-200 text-coral-600 hover:bg-coral-50"
            }
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
