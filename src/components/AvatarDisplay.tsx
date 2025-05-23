import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMeasurements } from './VirtualTryOn';
import { RotateCcw, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { calculateSize, findClosestAvatar, getAvatarPath } from '@/utils/avatarMatching';
import { fetchAvatarData } from '@/data/importCsvData';
import { toast } from "@/components/ui/use-toast";

interface AvatarDisplayProps {
  measurements: UserMeasurements;
  onRestart: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ measurements, onRestart }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatarData, setAvatarData] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [avatarImages, setAvatarImages] = useState<string[]>([]);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // Fetch avatar data from Firebase
  useEffect(() => {
    async function loadAvatarData() {
      setIsLoading(true);
      try {
        const data = await fetchAvatarData();
        setAvatarData(data);
        console.log("Avatar data loaded:", data.length, "items");
        
        // Calculate the recommended size based on height and weight
        const size = calculateSize(measurements.height, measurements.weight);
        setSelectedSize(size);
        
        // Find the closest matching avatar
        if (data && data.length > 0) {
          const fileName = findClosestAvatar(
            measurements.height,
            measurements.weight,
            measurements.bellyShape,
            measurements.hipShape,
            measurements.gender
          );
          setAvatarFileName(fileName);
          
          if (!fileName) {
            setError('No matching avatar found. Using example avatar instead.');
            // Use the first example avatar if no match is found
            setAvatarFileName(data[0].fileName);
          } else {
            setError(null);
            
            // Create an array of image URLs for rotation (0-9)
            const baseFileName = fileName.replace(/_\d+$/, '');
            const imagesArray = Array.from({ length: 10 }, (_, i) => 
              getAvatarPath(`${baseFileName}_${i}`, size, measurements.gender)
            );
            setAvatarImages(imagesArray);
            console.log("Generated image URLs:", imagesArray);
          }
        }
      } catch (err) {
        console.error('Error loading avatar data:', err);
        setError('Failed to load avatar data. Using example avatar instead.');
        // Use example data as fallback
        const size = calculateSize(measurements.height, measurements.weight);
        setSelectedSize(size);
        setAvatarFileName(exampleAvatarData[0].fileName);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadAvatarData();
  }, [measurements]);

  // Update the images array when size changes
  useEffect(() => {
    if (avatarFileName) {
      const baseFileName = avatarFileName.replace(/_\d+$/, '');
      const imagesArray = Array.from({ length: 10 }, (_, i) => 
        getAvatarPath(`${baseFileName}_${i}`, selectedSize, measurements.gender)
      );
      setAvatarImages(imagesArray);
      console.log("Size changed, updated image URLs:", imagesArray);
      
      // Reset the image load failed state when size changes
      setImageLoadFailed(false);
    }
  }, [selectedSize, avatarFileName, measurements.gender]);

  // Get the current avatar path
  const currentAvatarPath = avatarImages[currentImageIndex] || getAvatarPath(avatarFileName, selectedSize, measurements.gender);

  // Function to rotate to next image
  const rotateImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % avatarImages.length);
  };

  // Function to handle image load error
  const handleImageError = () => {
    console.log(`Failed to load avatar at path: ${currentAvatarPath}`);
    setImageLoadFailed(true);
    toast({
      title: "Image Load Error",
      description: "Could not load the avatar image. Please try a different size or refresh the page.",
      variant: "destructive"
    });
  };

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
              
              <div className="relative bg-gray-50 rounded-2xl p-8 mb-6 min-h-[400px] flex flex-col items-center justify-center">
                {error && !avatarFileName ? (
                  <div className="text-center text-red-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>{error}</p>
                  </div>
                ) : imageLoadFailed ? (
                  <div className="text-center text-orange-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>Could not load the image. Please try a different size.</p>
                    <p className="text-xs mt-2 text-gray-500">{currentAvatarPath}</p>
                  </div>
                ) : (
                  <>
                    <img 
                      src={currentAvatarPath} 
                      alt={`Size ${selectedSize} avatar`} 
                      className="max-h-[350px] max-w-full object-contain"
                      onError={handleImageError}
                    />
                    {!imageLoadFailed && (
                      <Button 
                        onClick={rotateImage}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" /> Rotate View
                      </Button>
                    )}
                  </>
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
