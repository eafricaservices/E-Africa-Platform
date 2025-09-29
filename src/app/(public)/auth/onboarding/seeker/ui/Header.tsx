"use client";
import React from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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

const Header = () => {
  const pathname = usePathname();

  // Find current step based on pathname
  const currentIndex = steps.findIndex((step) => step.href === pathname);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between text-[#13672B] mb-8 w-[55%]">
        {prevStep ? (
          <Link href={prevStep.href}>
            <ArrowLeft className="w-6 h-6 cursor-pointer" />
          </Link>
        ) : (
          <span className="w-6 h-6" /> // empty placeholder so logo stays centered
        )}
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
      </div>

      {/* Top section */}
      <div className="flex flex-col items-center bg-[#13672B] text-white p-8 rounded-lg mb-8">
        <h1 className="text-2xl font-medium">Create Your Profile</h1>
        <p className="text-sm font-light mt-3 text-center">
          Help us understand your career goals and connect you with the right opportunities
        </p>
      </div>
    </div>
  );
};

export default Header;
