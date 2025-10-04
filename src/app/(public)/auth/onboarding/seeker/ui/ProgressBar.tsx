"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import React from "react";

interface Step {
  number: number;
  title: string;
  href: string;
}

const Stepper: React.FC = () => {
  const pathname = usePathname();

  const steps: Step[] = [
    { number: 1, title: "Personal Information", href: "/auth/onboarding/seeker/personal-information" },
    { number: 2, title: "Career Goals", href: "/auth/onboarding/seeker/career-goals" },
    { number: 3, title: "Skills & Expertise", href: "/auth/onboarding/seeker/skills" },
    { number: 4, title: "Final Details", href: "/auth/onboarding/seeker/final-details" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.href === pathname);

  const progressPercentage =
 currentStepIndex < steps.length
    ? (currentStepIndex / steps.length) * 100
    : 100;
  return (
    <div className="mb-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Step {currentStepIndex + 1} of {steps.length}
        </h2>
        <span className="text-sm text-gray-500">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-10">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: "#13672B",
          }}
        />
      </div>

      {/* Step Navigation (Desktop) */}
      <div className="mb-8 hidden md:flex justify-between items-center space-x-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <React.Fragment key={step.number}>
              <div
                className={`flex items-center text-sm font-medium px-2 py-1 rounded-lg ${isCompleted
                  ? "bg-[#13673B] text-white opacity-70 cursor-not-allowed"
                  : isActive
                    ? "bg-[#13672B] text-white"
                    : "bg-gray-100 text-gray-500"
                  }`}
              >
                <Link
                  href={isCompleted ? "#" : step.href}
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium transition-colors
                      ${isCompleted || isActive
                      ? "bg-white text-[#13672B]"
                      : "bg-[#E0E0E0] text-gray-700 pointer-events-none"
                    }`}
                >
                  {step.number}
                </Link>
                <p className="ml-2">{step.title}</p>
              </div>

              {/* Arrow between steps */}
              {index !== steps.length - 1 && (
                <ArrowRight
                  strokeWidth={0.5}
                  className="text-gray-400 w-20 h-10 mx-1"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-center">
        {steps.map((step, index) => {
          if (index !== currentStepIndex) return null;
          return (
            <div
              key={step.number}
              className="flex items-center bg-[#13672B] text-white px-3 py-2 rounded-lg"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#13672B] text-sm font-medium">
                {step.number}
              </span>
              <p className="ml-3">{step.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
