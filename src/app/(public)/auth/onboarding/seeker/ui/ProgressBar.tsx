"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Step {
  number: number;
  title: string;
  href: string;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const pathname = usePathname();

  // Find the current step based on route
  const currentStep = steps.findIndex((step) => step.href === pathname) + 1;

  const progressPercentage =
    currentStep === 1 ? 0 : ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Step {currentStep} of {steps.length}
        </h2>
        <span className="text-sm text-gray-500">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-[#13672B] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Step Navigation */}
      <div className="mb-8">
        {/* Desktop / Tablet */}
        <div className="hidden md:flex justify-between items-center space-x-4">
          {steps.map((step) => {
            const isActive = pathname === step.href;
            return (
              <div
                key={step.number}
                className={`flex items-center ml-2 text-sm font-medium ${isActive
                    ? "bg-[#13672B] text-white px-2 py-1 rounded-lg"
                    : "bg-gray-100 text-gray-500 px-2 py-1 rounded-lg"
                  }`}
              >
                <Link
                  href={step.href}
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-white text-[#13672B]"
                      : "bg-[#E0E0E0] text-gray-700"
                    }`}
                >
                  {step.number}
                </Link>
                <p className="ml-2">{step.title}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-center">
          {steps.map((step) => {
            if (pathname === step.href) {
              return (
                <div
                  key={step.number}
                  className="flex items-center bg-[#13672B] text-white px-3 py-1 rounded-lg"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#13672B] text-sm font-medium">
                    {step.number}
                  </span>
                  <p className="ml-2">{step.title}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
