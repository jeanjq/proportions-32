
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, LoaderCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    onImageError();
    
    // Show a toast when image fails to load
    toast({
      title: "Image could not be loaded",
      description: "We're showing a default avatar instead.",
      variant: "destructive",
    });
  };
  
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
            <div className="flex flex-col items-center space-y-4">
              <LoaderCircle className="w-12 h-12 animate-spin text-coral-500/80" />
              <p className="text-sm text-center text-gray-500">Loading your perfect fit...</p>
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
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-full px-6 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Rotate View
              </Button>
              <Button 
                onClick={onToggleFitmap}
                className={isShowingFitmap 
                  ? "bg-gray-500 hover:bg-gray-600 text-white rounded-full px-6 py-2"
                  : "bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 via-blue-500 to-purple-600 text-white rounded-full px-6 py-2"
                }
              >
                {isShowingFitmap ? 'Normal View' : 'Fitmap'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvatarImage;
