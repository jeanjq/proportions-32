
import React from 'react';
import { Card } from "@/components/ui/card";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
        <div className="animate-spin w-16 h-16 border-4 border-coral-200/50 border-t-coral-500/80 rounded-full mx-auto mb-6 backdrop-blur-sm"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Creating your avatar...</h2>
        <p className="text-gray-600">Fetching your perfect fit from our image database! ✨</p>
        <p className="text-xs text-gray-500 mt-4">This may take a moment if it's your first time viewing this size.</p>
      </Card>
    </div>
  );
};

export default LoadingSpinner;
