
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SizeSelectorProps {
  selectedSize: string;
  onSelectSize: (size: string) => void;
  sizes: string[];
  recommendedSize?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ 
  selectedSize, 
  onSelectSize,
  sizes,
  recommendedSize 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Try Different Sizes</h3>
      {recommendedSize && (
        <div className="text-center mb-2">
          <Badge className="bg-lime-400/30 backdrop-blur-md text-gray-800 border border-lime-300/40">
            Recommended: {recommendedSize}
          </Badge>
        </div>
      )}
      <div className="flex justify-center gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            onClick={() => onSelectSize(size)}
            className={selectedSize === size 
              ? "bg-lime-400/30 backdrop-blur-md border border-lime-300/40 text-gray-800 hover:bg-lime-400/40" 
              : "border-white/20 bg-white/10 backdrop-blur-md text-gray-700 hover:bg-lime-100/20 hover:border-lime-200/40"
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
