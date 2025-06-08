
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GenderStep } from './steps/GenderStep';
import { PhysiqueStep } from './steps/PhysiqueStep';
import { HeightStep } from './steps/HeightStep';
import { WeightStep } from './steps/WeightStep';
import { BraSizeStep } from './steps/BraSizeStep';
import { BellyShapeStep } from './steps/BellyShapeStep';
import { HipShapeStep } from './steps/HipShapeStep';
import { AvatarDisplay } from './AvatarDisplay';
import { ChevronLeft, Sparkles } from 'lucide-react';

export interface UserMeasurements {
  gender: 'male' | 'female' | 'non-binary' | null;
  physique: string[];
  height: number;
  weight: number;
  braSize: string | null;
  bellyShape: 'flat' | 'round' | 'curvy' | null;
  hipShape: 'slim' | 'regular' | 'full' | null;
}

const initialMeasurements: UserMeasurements = {
  gender: null,
  physique: [],
  height: 0,
  weight: 0,
  braSize: null,
  bellyShape: null,
  hipShape: null
};

export const VirtualTryOn = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [measurements, setMeasurements] = useState<UserMeasurements>(initialMeasurements);

  // Determine which questionnaire flow to use based on physique selection
  const getQuestionnaireType = () => {
    if (measurements.gender === 'male') return 'male';
    if (measurements.gender === 'female') return 'female';
    
    // For non-binary, determine based on physique features
    const femaleFeatures = ['wider-hips', 'curvier-torso'];
    const maleFeatures = ['narrow-hips', 'broad-shoulders', 'straighter-silhouette'];
    
    const hasFemaleFeatures = measurements.physique.some(feature => femaleFeatures.includes(feature));
    const hasMaleFeatures = measurements.physique.some(feature => maleFeatures.includes(feature));
    
    if (hasFemaleFeatures && !hasMaleFeatures) return 'female';
    if (hasMaleFeatures && !hasFemaleFeatures) return 'male';
    if (hasFemaleFeatures && hasMaleFeatures) return 'female'; // Default to female if both
    
    return 'male'; // Default fallback
  };

  const questionnaireType = getQuestionnaireType();
  const needsPhysiqueStep = measurements.gender === 'non-binary';
  
  // Calculate total steps based on flow
  const getTotalSteps = () => {
    let steps = 1; // Gender step
    if (needsPhysiqueStep) steps++; // Physique step for non-binary
    steps += 2; // Height and weight
    if (questionnaireType === 'female') steps++; // Bra size for female flow
    steps += 2; // Belly and hip shape
    return steps;
  };

  const totalSteps = getTotalSteps();
  const progress = (currentStep / totalSteps) * 100;

  const updateMeasurement = (key: keyof UserMeasurements, value: any) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStepForCurrentFlow = (step: number) => {
    if (needsPhysiqueStep) {
      // Non-binary flow: Gender -> Physique -> Height -> Weight -> (Bra Size if female features) -> Belly -> Hip
      switch (step) {
        case 1: return 'gender';
        case 2: return 'physique';
        case 3: return 'height';
        case 4: return 'weight';
        case 5: return questionnaireType === 'female' ? 'braSize' : 'bellyShape';
        case 6: return questionnaireType === 'female' ? 'bellyShape' : 'hipShape';
        case 7: return 'hipShape';
        default: return 'gender';
      }
    } else {
      // Male/Female flow: Gender -> Height -> Weight -> (Bra Size if female) -> Belly -> Hip
      switch (step) {
        case 1: return 'gender';
        case 2: return 'height';
        case 3: return 'weight';
        case 4: return questionnaireType === 'female' ? 'braSize' : 'bellyShape';
        case 5: return questionnaireType === 'female' ? 'bellyShape' : 'hipShape';
        case 6: return 'hipShape';
        default: return 'gender';
      }
    }
  };

  const currentStepType = getStepForCurrentFlow(currentStep);

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
    switch (currentStepType) {
      case 'gender': return measurements.gender !== null;
      case 'physique': return measurements.physique.length > 0;
      case 'height': return measurements.height > 0;
      case 'weight': return measurements.weight > 0;
      case 'braSize': return measurements.braSize !== null;
      case 'bellyShape': return measurements.bellyShape !== null;
      case 'hipShape': return measurements.hipShape !== null;
      default: return false;
    }
  };

  const allStepsComplete = measurements.gender && 
                          measurements.height > 0 && 
                          measurements.weight > 0 && 
                          (questionnaireType === 'male' || measurements.braSize) &&
                          measurements.bellyShape && 
                          measurements.hipShape &&
                          (!needsPhysiqueStep || measurements.physique.length > 0);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-coral-400/80 to-peach-400/80 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Try It On!</h1>
            <p className="text-gray-600 leading-relaxed">
              Let's find your perfect fit! Answer a few quick questions and see how this item looks on your unique body shape.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsStarted(true)}
            className="w-full py-6 text-lg font-medium bg-gradient-to-r from-coral-500/90 to-peach-500/90 hover:from-coral-600/90 hover:to-peach-600/90 border border-white/20 backdrop-blur-sm rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            Start Your Virtual Try-On ✨
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">Takes less than 30 seconds!</p>
        </Card>
      </div>
    );
  }

  if (allStepsComplete) {
    // Convert non-binary to appropriate gender for avatar display
    const displayMeasurements = {
      ...measurements,
      gender: questionnaireType as 'male' | 'female'
    };
    return <AvatarDisplay measurements={displayMeasurements} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl overflow-hidden">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-coral-500/90 to-peach-500/90 backdrop-blur-sm p-6 text-white border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="text-white hover:bg-white/20 disabled:opacity-50 border border-white/20 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          
          <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-2 border border-white/30">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8 bg-white/10 backdrop-blur-sm">
          {currentStepType === 'gender' && (
            <GenderStep 
              value={measurements.gender}
              onChange={(gender) => updateMeasurement('gender', gender)}
            />
          )}
          
          {currentStepType === 'physique' && (
            <PhysiqueStep 
              value={measurements.physique}
              onChange={(physique) => updateMeasurement('physique', physique)}
            />
          )}
          
          {currentStepType === 'height' && (
            <HeightStep 
              value={measurements.height}
              onChange={(height) => updateMeasurement('height', height)}
            />
          )}
          
          {currentStepType === 'weight' && (
            <WeightStep 
              value={measurements.weight}
              onChange={(weight) => updateMeasurement('weight', weight)}
            />
          )}
          
          {currentStepType === 'braSize' && (
            <BraSizeStep 
              value={measurements.braSize}
              onChange={(braSize) => updateMeasurement('braSize', braSize)}
            />
          )}
          
          {currentStepType === 'bellyShape' && (
            <BellyShapeStep 
              value={measurements.bellyShape}
              onChange={(shape) => updateMeasurement('bellyShape', shape)}
            />
          )}
          
          {currentStepType === 'hipShape' && (
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
              className="px-8 py-3 bg-gradient-to-r from-coral-500/90 to-peach-500/90 hover:from-coral-600/90 hover:to-peach-600/90 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 backdrop-blur-sm rounded-full font-medium transform transition-all duration-200 hover:scale-105"
            >
              {currentStep === totalSteps ? 'See My Avatar! 🎉' : 'Continue'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
