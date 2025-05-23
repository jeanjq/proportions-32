
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMeasurements } from './VirtualTryOn';
import { RotateCcw, User, Sparkles, AlertCircle } from 'lucide-react';
import { calculateSize, findClosestAvatar, getAvatarPath } from '@/utils/avatarMatching';

interface AvatarDisplayProps {
  measurements: UserMeasurements;
  onRestart: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ measurements, onRestart }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate the recommended size based on height and weight
    const size = calculateSize(measurements.height, measurements.weight);
    setSelectedSize(size);
    
    // Find the closest matching avatar
    try {
      const fileName = findClosestAvatar(
        measurements.height,
        measurements.weight,
        measurements.bellyShape,
        measurements.hipShape,
        measurements.gender
      );
      setAvatarFileName(fileName);
      
      if (!fileName) {
        setError('No matching avatar found. Please try different measurements.');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error finding avatar:', err);
      setError('There was an issue finding your avatar. Please try again.');
    }
    
    // Simulate loading time for avatar generation
    setTimeout(() => setIsLoading(false), 1500);
  }, [measurements]);

  // Get the current avatar path
  const avatarPath = getAvatarPath(avatarFileName, selectedSize, measurements.gender);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <div className="animate-spin w-16 h-16 border-4 border-coral-200 border-t-coral-500 rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Creating your avatar...</h2>
          <p className="text-gray-600">This is so exciting! Almost ready! ✨</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-coral-400 to-peach-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Here's how it looks on you! 🎉</h1>
          <p className="text-gray-600">Looking amazing! Try different sizes to see the perfect fit.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Avatar Display */}
          <Card className="p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <div className="text-center">
              <Badge className="mb-4 bg-gradient-to-r from-coral-500 to-peach-500 text-white border-0">
                Size {selectedSize} • Perfect Fit!
              </Badge>
              
              <div className="relative bg-gray-50 rounded-2xl p-8 mb-6 min-h-[400px] flex items-center justify-center">
                {error ? (
                  <div className="text-center text-red-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>{error}</p>
                  </div>
                ) : (
                  <img 
                    src={avatarPath} 
                    alt={`Size ${selectedSize} avatar`} 
                    className="max-h-[350px] max-w-full object-contain"
                    onError={() => {
                      console.log(`Failed to load avatar at path: ${avatarPath}`);
                      setError('Avatar image could not be loaded.');
                    }}
                  />
                )}
              </div>

              {/* Size Selector */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Try Different Sizes</h3>
                <div className="flex justify-center gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
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
            </div>
          </Card>

          {/* Details & Actions */}
          <Card className="p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Measurements</h3>
            
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
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              💡 Not sure? You can always exchange for a different size!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
