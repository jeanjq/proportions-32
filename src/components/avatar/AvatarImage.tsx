import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Map } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface AvatarImageProps {
  currentAvatarPath: string;
  imageLoadFailed: boolean;
  error: string | null;
  avatarFileName: string | null;
  onImageError: () => void;
  onRotate: () => void;
  onToggleFitmap: () => void;
  isShowingFitmap: boolean;
}

const AvatarImage: React.FC<AvatarImageProps> = ({
  currentAvatarPath,
  imageLoadFailed,
  error,
  avatarFileName,
  onImageError,
  onRotate,
  onToggleFitmap,
  isShowingFitmap
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { toast } = useToast();
  
  const handleImageLoad = () => {
    setIsLoading(false);
    setLoadingProgress(100);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setLoadingProgress(0);
    onImageError();
    
    // Show a toast when image fails to load
    toast({
      title: "Image could not be loaded",
      description: "We're showing a default avatar instead.",
      variant: "destructive",
    });
  };
  
  // Simulate loading progress
  React.useEffect(() => {
    let interval: number | undefined;
    
    if (isLoading) {
      setLoadingProgress(0);
      // Simulate progress with small increments
      interval = window.setInterval(() => {
        setLoadingProgress(prev => {
          // Cap at 90% until the actual image loads
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next;
        });
      }, 300);
    } else {
      // When loaded, ensure we show 100%
      setLoadingProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, currentAvatarPath]);
  
  // Reset loading state when avatar path changes
  React.useEffect(() => {
    setIsLoading(true);
  }, [currentAvatarPath]);
  
  // Use a placeholder image if the current path fails
  const fallbackImageUrl = "/placeholder-avatar.png";
  
  return (
    <div className="relative rounded-2xl p-8 mb-6 min-h-[500px] flex flex-col items-center justify-center">
      {error ? (
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : imageLoadFailed ? (
        <div className="text-center text-orange-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <p>Could not load the image. Using default avatar.</p>
          <img 
            src={fallbackImageUrl}
            alt="Default avatar" 
            className="max-h-[450px] max-w-full object-contain mt-4"
          />
        </div>
      ) : !currentAvatarPath ? (
        <div className="text-center text-orange-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <p>No image available for this combination.</p>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-center text-gray-500">Loading your perfect fit...</p>
                <Progress value={loadingProgress} className="h-2 w-full" />
              </div>
            </div>
          )}
          <img 
            src={currentAvatarPath} 
            alt={isShowingFitmap ? "Fitmap preview" : "Avatar preview"} 
            className={`max-h-[450px] max-w-full object-contain transition-opacity duration-700 ease-in-out ${isLoading ? 'opacity-0 hidden' : 'opacity-100 animate-scale-in'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {!isLoading && !imageLoadFailed && (
            <div className="flex gap-3 mt-4">
              <Button 
                onClick={onRotate}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Rotate View
              </Button>
              <Button 
                onClick={onToggleFitmap}
                className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white rounded-full"
              >
                <Map className="w-4 h-4 mr-2" /> 
                {isShowingFitmap ? 'Show Avatar' : 'Fitmap'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvatarImage;
