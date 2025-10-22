"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Step {
  number: number;
  title: string;
  href: string;
}

const Stepper: React.FC = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState<number>(0);

  const steps: Step[] = [
    { number: 1, title: "Personal Information", href: "/auth/onboarding/seeker/personal-information" },
    { number: 2, title: "Career Goals", href: "/auth/onboarding/seeker/career-goals" },
    { number: 3, title: "Skills & Expertise", href: "/auth/onboarding/seeker/skills" },
    { number: 4, title: "Final Details", href: "/auth/onboarding/seeker/final-details" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.href === pathname);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  //  Fetch onboarding progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/service-seekers/progress");
        if (!res.ok) throw new Error("Failed to load progress");
        const data = await res.json();
        setProgress(data.progress || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Step {currentStepIndex + 1} of {steps.length}
        </h2>
        <span className="text-sm text-gray-500">{progress}% Complete</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-10">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: "#13672B",
          }}
        />
      </div>

      {/* Step Navigation */}
      <div className="hidden md:flex justify-between items-center space-x-2">
        {steps.map((step, index) => {
          const isCompleted = progress >= (step.number * 25);
          const isActive = index === currentStepIndex;

          return (
            <React.Fragment key={step.number}>
              <div
                className={`flex items-center text-sm font-medium px-2 py-1 rounded-lg ${
                  isCompleted
                    ? "bg-[#13673B] text-white opacity-70"
                    : isActive
                    ? "bg-[#13672B] text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Link
                  href={isCompleted ? "#" : step.href}
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                    isCompleted || isActive
                      ? "bg-white text-[#13672B]"
                      : "bg-[#E0E0E0] text-gray-700 pointer-events-none"
                  }`}
                >
                  {step.number}
                </Link>
                <p className="ml-2">{step.title}</p>
              </div>

              {index !== steps.length - 1 && (
                <ArrowRight strokeWidth={0.5} className="text-gray-400 w-20 h-10 mx-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
