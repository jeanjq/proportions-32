
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
          <Badge className="bg-gradient-to-r from-coral-500/90 to-peach-500/90 backdrop-blur-sm text-white border border-white/20">
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
              ? "bg-gradient-to-r from-coral-500/90 to-peach-500/90 backdrop-blur-sm border border-white/20" 
              : "border-coral-200/50 bg-white/20 backdrop-blur-sm text-coral-600 hover:bg-coral-50/50"
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
