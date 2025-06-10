import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GenderStep } from './steps/GenderStep';
import { PhysiqueStep } from './steps/PhysiqueStep';
import { HeightStep } from './steps/HeightStep';
import { WeightStep } from './steps/WeightStep';
import { BraSizeStep } from './steps/BraSizeStep';
import { BellyShapeStep } from './steps/BellyShapeStep';
import { HipShapeStep } from './steps/HipShapeStep';
import { ShoulderWidthStep } from './steps/ShoulderWidthStep';
import { AvatarDisplay } from './AvatarDisplay';
import { ChevronLeft } from 'lucide-react';

export interface UserMeasurements {
  gender: 'male' | 'female' | 'non-binary' | null;
  physique: string[];
  height: number; // Changed back to number
  weight: number; // Changed back to number
  braSize: string | null;
  bellyShape: 'flat' | 'round' | 'curvy' | null;
  hipShape: 'slim' | 'regular' | 'full' | null;
  shoulderWidth: '1' | '2' | '3' | null;
}

const initialMeasurements: UserMeasurements = {
  gender: null,
  physique: [],
  height: 0, // Changed back to number
  weight: 0, // Changed back to number
  braSize: null,
  bellyShape: null,
  hipShape: null,
  shoulderWidth: null
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
    steps += 2; // Belly and (hip shape for female OR shoulder width for male)
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

  useEffect(() => {
      console.log(`currentStep ${currentStep}: measurements: ${JSON.stringify(measurements, null, 2)}`)
  }, [measurements])

  const getStepForCurrentFlow = (step: number) => {
    if (needsPhysiqueStep) {
      // Non-binary flow: Gender -> Physique -> Height -> Weight -> (Bra Size if female features) -> Belly -> (Hip/Shoulder)
      switch (step) {
        case 1: return 'gender';
        case 2: return 'physique';
        case 3: return 'height';
        case 4: return 'weight';
        case 5: return questionnaireType === 'female' ? 'braSize' : 'bellyShape';
        case 6: return questionnaireType === 'female' ? 'bellyShape' : (questionnaireType === 'male' ? 'shoulderWidth' : 'hipShape');
        case 7: return questionnaireType === 'female' ? 'hipShape' : 'shoulderWidth';
        default: return 'gender';
      }
    } else {
      // Male/Female flow: Gender -> Height -> Weight -> (Bra Size if female) -> Belly -> (Hip/Shoulder)
      switch (step) {
        case 1: return 'gender';
        case 2: return 'height';
        case 3: return 'weight';
        case 4: return questionnaireType === 'female' ? 'braSize' : 'bellyShape';
        case 5: return questionnaireType === 'female' ? 'bellyShape' : (questionnaireType === 'male' ? 'shoulderWidth' : 'hipShape');
        case 6: return questionnaireType === 'female' ? 'hipShape' : 'shoulderWidth';
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
      case 'height': return measurements.height !== 0;
      case 'weight': return measurements.weight !== 0;
      case 'braSize': return measurements.braSize !== null;
      case 'bellyShape': return measurements.bellyShape !== null;
      case 'hipShape': return measurements.hipShape !== null;
      case 'shoulderWidth': return measurements.shoulderWidth !== null;
      default: return false;
    }
  };

  const allStepsComplete = measurements.gender && 
                          measurements.height !== 0 && 
                          measurements.weight !== 0 && 
                          (questionnaireType === 'male' || measurements.braSize) &&
                          measurements.bellyShape && 
                          (questionnaireType === 'female' ? measurements.hipShape : measurements.shoulderWidth) &&
                          (!needsPhysiqueStep || measurements.physique.length > 0);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-12 text-center bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
          <div className="mb-8">
            <div className="mb-6 flex items-center justify-center">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/proportions-b1093.firebasestorage.app/o/logo2.png?alt=media&token=d285ea51-94e3-4229-a5de-0cf7e927b819" 
                alt="Proportions Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-6xl font-medium text-gray-800 mb-4 font-alexandria" style={{ letterSpacing: '-0.02em' }}>Proportions</h1>
            <p className="text-gray-600 leading-relaxed font-medium text-lg">
              Find your perfect fit through our simple measurement guide
            </p>
          </div>
          
          <Button 
            onClick={() => setIsStarted(true)}
            className="w-full py-4 text-base font-medium bg-gradient-to-r from-coral-500/90 to-peach-500/90 hover:from-coral-600/90 hover:to-peach-600/90 text-white border-0 rounded-full shadow-lg transition-all duration-200"
          >
            Begin Fitting
          </Button>
          
          <p className="text-sm text-gray-500 mt-6 font-medium">Takes less than one minute</p>
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
        <div className="bg-white/10 backdrop-blur-md p-8 border-b border-white/20">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="text-gray-700 hover:bg-white/20 disabled:opacity-30 border border-white/20 bg-white/10 backdrop-blur-md font-medium rounded-full px-4 py-2 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <span className="text-sm font-medium text-gray-600 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
              {currentStep} / {totalSteps}
            </span>
          </div>
          
          <div className="w-full bg-white/20 backdrop-blur-md rounded-full h-3 border border-white/30 shadow-inner">
            <div 
              className="bg-gradient-to-r from-coral-500/90 to-peach-500/90 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-12 bg-white/10 backdrop-blur-md">
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
              gender={questionnaireType as 'male' | 'female'}
            />
          )}
          
          {currentStepType === 'weight' && (
            <WeightStep 
              value={measurements.weight}
              onChange={(weight) => updateMeasurement('weight', weight)}
              gender={questionnaireType as 'male' | 'female'}
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

          {currentStepType === 'shoulderWidth' && (
            <ShoulderWidthStep 
              value={measurements.shoulderWidth}
              onChange={(width) => updateMeasurement('shoulderWidth', width)}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-end mt-12">
            <Button
              onClick={nextStep}
              disabled={!isStepComplete()}
              className="px-8 py-3 bg-gradient-to-r from-coral-500/90 to-peach-500/90 hover:from-coral-600/90 hover:to-peach-600/90 disabled:opacity-30 disabled:cursor-not-allowed text-white border-0 rounded-full font-medium shadow-lg transition-all duration-200"
            >
              {currentStep === totalSteps ? 'Complete' : 'Continue'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VirtualTryOn;
