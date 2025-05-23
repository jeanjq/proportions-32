
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { UserMeasurements } from '../VirtualTryOn';

interface MeasurementsDisplayProps {
  measurements: UserMeasurements;
  selectedSize: string;
}

const MeasurementsDisplay: React.FC<MeasurementsDisplayProps> = ({
  measurements,
  selectedSize
}) => {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Height</span>
        <span className="font-medium">{measurements.height} cm</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Weight</span>
        <span className="font-medium">{measurements.weight} kg</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Belly Shape</span>
        <span className="font-medium capitalize">{measurements.bellyShape}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-600">Hip Shape</span>
        <span className="font-medium capitalize">{measurements.hipShape}</span>
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-gray-600">Recommended Size</span>
        <Badge className="bg-gradient-to-r from-coral-500 to-peach-500 text-white border-0">
          {selectedSize}
        </Badge>
      </div>
    </div>
  );
};

export default MeasurementsDisplay;
