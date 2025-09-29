"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

interface Step {
  number: number;
  title: string;
  href: string;
}

const steps: Step[] = [
  { number: 1, title: "Personal Information", href: "/auth/onboarding/seeker/personal-information" },
  { number: 2, title: "Career Goals", href: "/auth/onboarding/seeker/career-goals" },
  { number: 3, title: "Skills & Expertise", href: "/auth/onboarding/seeker/skills" },
  { number: 4, title: "Final Details", href: "/auth/onboarding/seeker/final-details" },
];

const Footer = () => {
  const pathname = usePathname();

  // Find current step
  const currentIndex = steps.findIndex((step) => step.href === pathname);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  return (
    <div className="flex justify-between items-center mt-8">
      {/* Back Button */}
      {prevStep ? (
        <Link href={prevStep.href}>
          <button
            type="button"
            className="text-[#13672B] font-medium flex items-center cursor-pointer"
          >
            <ArrowLeft className="inline w-5 h-5 mr-1" />
            Back
          </button>
        </Link>
      ) : (
        <div /> 
      )}

      {/* Continue Button */}
      {nextStep && (
        <Link href={nextStep.href}>
          <button
            type="button"
            className="px-8 py-2 bg-[#13672B] text-sm text-white font-medium rounded-lg hover:bg-green-700 transition-colors outline-none shadow-sm cursor-pointer"
          >
            Continue
          </button>
        </Link>
      )}
    </div>
  );
};

export default Footer;
