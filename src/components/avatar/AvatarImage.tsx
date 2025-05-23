
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface AvatarImageProps {
  currentAvatarPath: string;
  imageLoadFailed: boolean;
  error: string | null;
  avatarFileName: string | null;
  onImageError: () => void;
  onRotate: () => void;
}

const AvatarImage: React.FC<AvatarImageProps> = ({
  currentAvatarPath,
  imageLoadFailed,
  error,
  avatarFileName,
  onImageError,
  onRotate
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
  
  // Use a placeholder image if the current path fails
  const fallbackImageUrl = "/placeholder-avatar.png";
  
  return (
    <div className="relative bg-gray-50 rounded-2xl p-8 mb-6 min-h-[400px] flex flex-col items-center justify-center">
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
            className="max-h-[350px] max-w-full object-contain mt-4"
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
            <Skeleton className="w-full h-[350px] rounded-md" />
          )}
          <img 
            src={currentAvatarPath} 
            alt="Avatar preview" 
            className={`max-h-[350px] max-w-full object-contain ${isLoading ? 'hidden' : 'block'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {!isLoading && !imageLoadFailed && onRotate && (
            <Button 
              onClick={onRotate}
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Rotate View
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default AvatarImage;
