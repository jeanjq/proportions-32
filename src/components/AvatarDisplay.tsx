
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMeasurements } from './VirtualTryOn';
import { Sparkles } from 'lucide-react';
import { calculateSize, findClosestAvatar, getAvatarPath } from '@/utils/avatarMatching';
import { fetchAvatarData, exampleAvatarData } from '@/data/importCsvData';
import { toast } from "@/components/ui/use-toast";

// Import our new components
import LoadingSpinner from './avatar/LoadingSpinner';
import AvatarImage from './avatar/AvatarImage';
import SizeSelector from './avatar/SizeSelector';
import MeasurementsDisplay from './avatar/MeasurementsDisplay';
import ActionButtons from './avatar/ActionButtons';

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
    return <LoadingSpinner />;
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
              
              <AvatarImage 
                currentAvatarPath={currentAvatarPath}
                imageLoadFailed={imageLoadFailed}
                error={error}
                avatarFileName={avatarFileName}
                onImageError={handleImageError}
                onRotate={rotateImage}
              />

              <SizeSelector 
                selectedSize={selectedSize} 
                onSelectSize={setSelectedSize} 
                sizes={sizes} 
              />
            </div>
          </Card>

          {/* Details & Actions */}
          <Card className="p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Measurements</h3>
            
            <MeasurementsDisplay 
              measurements={measurements} 
              selectedSize={selectedSize} 
            />

            <ActionButtons 
              selectedSize={selectedSize}
              onRestart={onRestart} 
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
