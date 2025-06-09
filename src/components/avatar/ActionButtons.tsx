
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface ActionButtonsProps {
  selectedSize: string;
  onRestart: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ selectedSize, onRestart }) => {
  const handleDownloadMaleJS = async () => {
    try {
      const url = "https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/Male.js?alt=media&token=edc4f39e-bec4-40ea-bb99-a8b0b62ca555";
      
      // Fetch the file
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      // Get the content as blob
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Male.js';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('Male.js file downloaded successfully');
    } catch (error) {
      console.error('Error downloading Male.js file:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Perfect Fit Guaranteed</h4>
        <p className="text-sm text-gray-600 mb-4">
          Size <span className="font-bold text-coral-600">{selectedSize}</span> is your ideal match based on your measurements.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full bg-gradient-to-r from-coral-500/90 to-peach-500/90 hover:from-coral-600/90 hover:to-peach-600/90 text-white border-0 rounded-full font-medium shadow-lg transition-all duration-200"
          >
            Add to Cart - Size {selectedSize}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onRestart}
            className="w-full border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-gray-700 rounded-full font-medium shadow-lg transition-all duration-200"
          >
            Try Different Measurements
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDownloadMaleJS}
            className="w-full border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-gray-700 rounded-full font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Male.js (Test)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
