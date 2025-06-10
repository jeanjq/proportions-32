
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { UserMeasurements } from './VirtualTryOn';
import { findClosestAvatarWithSize, getAvatarPath, getHeatmapImage } from '@/utils/avatarMatching';
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
  const [isShowingFitmap, setIsShowingFitmap] = useState(false);
  const [heatmapImage, setHeatmapImage] = useState<string>('');
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  // Helper function to map gender for avatar matching
  const getGenderForMatching = (gender: 'male' | 'female' | 'non-binary'): 'male' | 'female' => {
    if (gender === 'non-binary') {
      // Default to female for non-binary users - could be enhanced with physique-based logic
      return 'female';
    }
    return gender;
  };

  // Preload image function
  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set(prev).add(url));
        resolve();
      };
      img.onerror = () => reject();
      img.src = url;
    });
  };

  // Preload all images for all sizes
  const preloadAllImages = async (imgNumber: number, genderForMatching: 'male' | 'female') => {
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const preloadPromises: Promise<void>[] = [];

    console.log('Starting to preload all images...');

    for (const size of sizes) {
      // Import the function to get multiple views
      const { getAvatarViews } = await import('@/utils/avatarMatching');
      const imageUrls = getAvatarViews(imgNumber, size, genderForMatching);
      const heatmapUrl = getHeatmapImage(imgNumber, size, genderForMatching);

      // Add avatar images to preload queue
      imageUrls.forEach(url => {
        preloadPromises.push(preloadImage(url).catch(() => {
          console.log(`Failed to preload avatar image: ${url}`);
        }));
      });

      // Add heatmap image to preload queue
      preloadPromises.push(preloadImage(heatmapUrl).catch(() => {
        console.log(`Failed to preload heatmap image: ${heatmapUrl}`);
      }));
    }

    // Execute all preloading in parallel
    await Promise.allSettled(preloadPromises);
    console.log('Finished preloading images. Preloaded count:', preloadedImages.size);
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

        console.log('measurements', JSON.stringify(measurements))
        
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
          // Generate heatmap image URL
          generateHeatmapImage(result.imageNumber, result.recommendedSize);
          
          // Start preloading all images for all sizes
          preloadAllImages(result.imageNumber, genderForMatching);
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

  // Generate heatmap image URL
  const generateHeatmapImage = (imgNumber: number, size: string) => {
    const genderForMatching = getGenderForMatching(measurements.gender!);
    const heatmapUrl = getHeatmapImage(imgNumber, size, genderForMatching);
    setHeatmapImage(heatmapUrl);
    console.log("Generated heatmap URL:", heatmapUrl);
  };

  // Update the images array when size changes
  useEffect(() => {
    if (imageNumber !== null) {
      // Generate new avatar image URLs for the selected size
      generateAvatarImageUrls(imageNumber, selectedSize);
      // Generate new heatmap image URL for the selected size
      generateHeatmapImage(imageNumber, selectedSize);
    }
  }, [selectedSize, imageNumber, measurements.gender]);

  // Get the current image path based on mode
  const currentAvatarPath = isShowingFitmap ? heatmapImage : (avatarImages[currentImageIndex] || '');

  // Function to handle rotation (only for avatar mode)
  const handleRotate = () => {
    if (!isShowingFitmap && avatarImages.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % avatarImages.length);
    }
  };

  // Function to toggle fitmap mode
  const handleToggleFitmap = () => {
    setIsShowingFitmap(prev => !prev);
    setImageLoadFailed(false); // Reset error state when switching modes
  };

  // Function to handle image load error
  const handleImageError = () => {
    console.log(`Failed to load ${isShowingFitmap ? 'heatmap' : 'avatar'} at path: ${currentAvatarPath}`);
    setImageLoadFailed(true);
    toast({
      title: "Image Load Error",
      description: `Could not load the ${isShowingFitmap ? 'heatmap' : 'avatar'} image. Please try a different size or refresh the page.`,
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
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/logo2.png?alt=media&token=d285ea51-94e3-4229-a5de-0cf7e927b819" 
              alt="Proportions Logo" 
              className="w-10 h-10 object-contain"
            />
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
                onToggleFitmap={handleToggleFitmap}
                isShowingFitmap={isShowingFitmap}
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
