
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from 'lucide-react';

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
  return (
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
            alt="Avatar preview" 
            className="max-h-[350px] max-w-full object-contain"
            onError={onImageError}
          />
          {!imageLoadFailed && (
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
