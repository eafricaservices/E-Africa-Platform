"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  updateProfileStep1,
  updateProfileStep2,
  updateProfileStep3,
  updateProfileStep4,
  completeProfile,
} from "@/lib/api/endpoints/auth";
import { toast } from "sonner";

interface Step {
  number: number;
  title: string;
  href: string;
}

interface FooterProps {
  stepNumber: number;
  formData: any;
}

const steps: Step[] = [
  { number: 1, title: "Personal Information", href: "/auth/onboarding/seeker/personal-information" },
  { number: 2, title: "Career Goals", href: "/auth/onboarding/seeker/career-goals" },
  { number: 3, title: "Skills & Expertise", href: "/auth/onboarding/seeker/skills" },
  { number: 4, title: "Final Details", href: "/auth/onboarding/seeker/final-details" },
];

const Footer: React.FC<FooterProps> = ({ stepNumber, formData }) => {
  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = steps.findIndex((step) => step.href === pathname);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  const isLastStep = currentIndex === steps.length - 1;

  const handleSubmit = async () => {
    try {
      if (stepNumber === 1) {
        await updateProfileStep1(formData);
      } else if (stepNumber === 2) {
        await updateProfileStep2(formData);
      } else if (stepNumber === 3) {
        await updateProfileStep3(formData);
      } else if (stepNumber === 4) {
        await updateProfileStep4(formData);
        await completeProfile(formData);
        toast.success("🎉 Profile completed successfully!");
        router.push("/dashboard");
        return;
      }

      toast.success(`✅ Step ${stepNumber} saved successfully`);

      // Navigate to next step or success page
      if (nextStep) router.push(nextStep.href);
    } catch (error) {
      console.error("❌ Error saving step:", error);
    }
  };

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

      {/* Continue / Complete Button */}
      {isLastStep ? (
        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-2 bg-[#13672B] text-sm text-white font-medium rounded-lg hover:bg-green-700 transition-colors outline-none shadow-sm cursor-pointer"
        >
          Complete
        </button>
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-2 bg-[#13672B] text-sm text-white font-medium rounded-lg hover:bg-green-700 transition-colors outline-none shadow-sm cursor-pointer"
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default Footer;
