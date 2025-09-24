import React, { useState } from "react";
import CreateProfileStep from "./ui/createProfileStep";
import ExpertPortfolio from "./ui/expertPortfolioStep";
import VideoIntroStep from "./ui/videoIntroStep";
import PricingStep from "./ui/pricingStep";
import AvailabilityStep from "./ui/availabilityStep";
import CompletedStep from "./ui/completedStep";

export default function Flow() {
  // TEMPORARY NAVIGATION - i will remove it when API validation is ready
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };
  // END TEMPORARY NAVIGATION

  return (
    <div>
      {currentStep === 0 && <CreateProfileStep onNext={handleNext} />}
      {currentStep === 1 && (
        <ExpertPortfolio onNext={handleNext} onPrevious={handlePrevious} />
      )}
      {currentStep === 2 && (
        <VideoIntroStep onNext={handleNext} onPrevious={handlePrevious} />
      )}
      {currentStep === 3 && (
        <PricingStep onNext={handleNext} onPrevious={handlePrevious} />
      )}
      {currentStep === 4 && (
        <AvailabilityStep onNext={handleNext} onPrevious={handlePrevious} />
      )}
      {currentStep === 5 && <CompletedStep onReset={handleReset} />}
    </div>
  );
}
