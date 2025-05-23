import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeightStep } from './steps/HeightStep';
import { WeightStep } from './steps/WeightStep';
import { BellyShapeStep } from './steps/BellyShapeStep';
import { HipShapeStep } from './steps/HipShapeStep';
import { AvatarDisplay } from './AvatarDisplay';
import { ChevronLeft, Sparkles } from 'lucide-react';

export interface UserMeasurements {
  height: number;
  weight: number;
  bellyShape: 'flat' | 'round' | 'curvy' | null;
  hipShape: 'slim' | 'regular' | 'full' | null;
  gender: 'women' | 'men';
}

const initialMeasurements: UserMeasurements = {
  height: 0,
  weight: 0,
  bellyShape: null,
  hipShape: null,
  gender: 'women'
};

export const VirtualTryOn = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [measurements, setMeasurements] = useState<UserMeasurements>(initialMeasurements);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateMeasurement = (key: keyof UserMeasurements, value: any) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setMeasurements(initialMeasurements);
    setCurrentStep(1);
    setIsStarted(false);
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return measurements.height > 0;
      case 2: return measurements.weight > 0;
      case 3: return measurements.bellyShape !== null;
      case 4: return measurements.hipShape !== null;
      default: return false;
    }
  };

  const allStepsComplete = measurements.height > 0 && 
                          measurements.weight > 0 && 
                          measurements.bellyShape && 
                          measurements.hipShape;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-coral-400 to-peach-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Try It On!</h1>
            <p className="text-gray-600 leading-relaxed">
              Let's find your perfect fit! Answer a few quick questions and see how this item looks on your unique body shape.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsStarted(true)}
            className="w-full py-6 text-lg font-medium bg-gradient-to-r from-coral-500 to-peach-500 hover:from-coral-600 hover:to-peach-600 border-0 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            Start Your Virtual Try-On ✨
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">Takes less than 30 seconds!</p>
        </Card>
      </div>
    );
  }

  if (allStepsComplete) {
    return <AvatarDisplay measurements={measurements} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-coral-500 to-peach-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          {currentStep === 1 && (
            <HeightStep 
              value={measurements.height}
              onChange={(height) => updateMeasurement('height', height)}
            />
          )}
          
          {currentStep === 2 && (
            <WeightStep 
              value={measurements.weight}
              onChange={(weight) => updateMeasurement('weight', weight)}
            />
          )}
          
          {currentStep === 3 && (
            <BellyShapeStep 
              value={measurements.bellyShape}
              onChange={(shape) => updateMeasurement('bellyShape', shape)}
            />
          )}
          
          {currentStep === 4 && (
            <HipShapeStep 
              value={measurements.hipShape}
              onChange={(shape) => updateMeasurement('hipShape', shape)}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <div className="flex-1" />
            <Button
              onClick={nextStep}
              disabled={!isStepComplete()}
              className="px-8 py-3 bg-gradient-to-r from-coral-500 to-peach-500 hover:from-coral-600 hover:to-peach-600 disabled:opacity-50 disabled:cursor-not-allowed border-0 rounded-full font-medium transform transition-all duration-200 hover:scale-105"
            >
              {currentStep === totalSteps ? 'See My Avatar! 🎉' : 'Continue'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
