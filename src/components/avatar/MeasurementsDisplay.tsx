
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { UserMeasurements } from '../VirtualTryOn';

interface MeasurementsDisplayProps {
  measurements: UserMeasurements;
  selectedSize: string;
  recommendedSize?: string;
}

const MeasurementsDisplay: React.FC<MeasurementsDisplayProps> = ({
  measurements,
  selectedSize,
  recommendedSize
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center py-2 border-b border-white/20">
        <span className="text-gray-600">Height</span>
        <span className="font-medium">{measurements.height} cm</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-white/20">
        <span className="text-gray-600">Weight</span>
        <span className="font-medium">{measurements.weight} kg</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-white/20">
        <span className="text-gray-600">Belly Shape</span>
        <span className="font-medium capitalize">{measurements.bellyShape}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-white/20">
        <span className="text-gray-600">Shoulder Width</span>
        <span className="font-medium">
          {measurements.shoulderWidth === '1' ? 'Small' : 
           measurements.shoulderWidth === '2' ? 'Medium' : 
           measurements.shoulderWidth === '3' ? 'Large' : 'Not specified'}
        </span>
      </div>
      {recommendedSize && (
        <div className="flex justify-between items-center py-2 border-b border-white/20">
          <span className="text-gray-600">Recommended Size</span>
          <Badge className="bg-gradient-to-r from-coral-500/90 to-peach-500/90 backdrop-blur-sm text-white border border-white/20">
            {recommendedSize}
          </Badge>
        </div>
      )}
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600">Selected Size</span>
        <Badge className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm text-white border border-white/20">
          {selectedSize}
        </Badge>
      </div>
    </div>
  );
};

export default MeasurementsDisplay;
