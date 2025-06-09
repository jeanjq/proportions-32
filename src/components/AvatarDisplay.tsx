import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { UserMeasurements } from './VirtualTryOn';
import { Sparkles } from 'lucide-react';
import { findClosestAvatarWithSize, getAvatarPath } from '@/utils/avatarMatching';
import { toast } from "@/components/ui/use-toast";

// Import our components
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
  const [recommendedSize, setRecommendedSize] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageNumber, setImageNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [avatarImages, setAvatarImages] = useState<string[]>([]);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // Helper function to map gender for avatar matching
  const getGenderForMatching = (gender: 'male' | 'female' | 'non-binary'): 'male' | 'female' => {
    if (gender === 'non-binary') {
      // Default to female for non-binary users - could be enhanced with physique-based logic
      return 'female';
    }
    return gender;
  };

  // Find the closest matching avatar based on measurements
  useEffect(() => {
    async function findMatchingAvatar() {
      setIsLoading(true);
      try {
        // Map gender for avatar matching
        const genderForMatching = getGenderForMatching(measurements.gender!);
        
        // Get the correct second shape parameter based on gender
        const secondShapeParam = genderForMatching === 'male' 
          ? measurements.shoulderWidth 
          : measurements.hipShape;
        
        // Find the closest matching avatar image number and get recommended size from CSV
        const result = await findClosestAvatarWithSize(
          measurements.height,
          measurements.weight,
          measurements.bellyShape,
          secondShapeParam,
          genderForMatching
        );
        
        setImageNumber(result.imageNumber);
        setRecommendedSize(result.recommendedSize);
        setSelectedSize(result.recommendedSize); // Set initial selected size to recommended size

        console.log('result', JSON.stringify(result, null, 2))
        
        if (result.imageNumber === null) {
          setError('No matching avatar found. Please try different measurements.');
        } else {
          setError(null);
          // Generate avatar image URLs for the found image number with recommended size
          generateAvatarImageUrls(result.imageNumber, result.recommendedSize);
        }
      } catch (err) {
        console.error('Error finding matching avatar:', err);
        setError('Failed to find matching avatar. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    findMatchingAvatar();
  }, [measurements]);

  // Generate an array of avatar image URLs for different views
  const generateAvatarImageUrls = (imgNumber: number, size: string) => {
    // Map gender for avatar path generation
    const genderForMatching = getGenderForMatching(measurements.gender!);
    
    // Import the function to get multiple views
    import('@/utils/avatarMatching').then(({ getAvatarViews }) => {
      const imageUrls = getAvatarViews(imgNumber, size, genderForMatching);
      setAvatarImages(imageUrls);
      
      console.log("Generated image URLs:", imageUrls);
      
      // Reset the image load failed state when new URLs are generated
      setImageLoadFailed(false);
      setCurrentImageIndex(0);
    });
  };

  // Update the images array when size changes
  useEffect(() => {
    if (imageNumber !== null) {
      // Generate new avatar image URLs for the selected size
      generateAvatarImageUrls(imageNumber, selectedSize);
    }
  }, [selectedSize, imageNumber, measurements.gender]);

  // Get the current avatar path
  const currentAvatarPath = avatarImages[currentImageIndex] || '';

  // Function to handle rotation
  const handleRotate = () => {
    if (avatarImages.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % avatarImages.length);
    }
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

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Here's how it looks on you! 🎉</h1>
          <p className="text-gray-600">Looking amazing! Try different sizes to see the perfect fit.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Avatar Display */}
          <Card className="p-6 bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
            <div className="text-center">
              
              <AvatarImage 
                currentAvatarPath={currentAvatarPath}
                imageLoadFailed={imageLoadFailed}
                error={error}
                avatarFileName={imageNumber ? `adidas_${imageNumber}` : null}
                onImageError={handleImageError}
                onRotate={handleRotate}
              />

              <SizeSelector 
                selectedSize={selectedSize} 
                onSelectSize={setSelectedSize} 
                sizes={sizes}
                recommendedSize={recommendedSize}
              />
            </div>
          </Card>

          {/* Details & Actions */}
          <Card className="p-6 bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Measurements</h3>
            
            <MeasurementsDisplay 
              measurements={measurements} 
              selectedSize={selectedSize}
              recommendedSize={recommendedSize}
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
