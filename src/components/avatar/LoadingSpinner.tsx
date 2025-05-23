
import React from 'react';
import { Card } from "@/components/ui/card";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <div className="animate-spin w-16 h-16 border-4 border-coral-200 border-t-coral-500 rounded-full mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Creating your avatar...</h2>
        <p className="text-gray-600">This is so exciting! Almost ready! ✨</p>
      </Card>
    </div>
  );
};

export default LoadingSpinner;
