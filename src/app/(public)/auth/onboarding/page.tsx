"use client";

import React, { useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

type CanonicalRole = "serviceprovider" | "serviceseeker";

type RoleOption = {
  role: CanonicalRole;
  title: string;
  subtitle: string;
  image: string;
  perks: string[];
  target: "provider" | "seeker/personal-information";
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "serviceseeker",
    title: "Join as a service seeker",
    subtitle: "Explore mentors, programs, and tailored opportunities.",
    image: "/seeker-illustration.svg",
    perks: [
      "Find remote jobs or internships",
      "Connect with mentors and industry experts",
      "Build your personalized career roadmap",
      "Collaborate and learn from peers",
      "Verified opportunities and guidance",
    ],
    target: "seeker/personal-information",
  },
  {
    role: "serviceprovider",
    title: "Join as a service provider",
    subtitle: "Offer your organization's services to new markets.",
    image: "/provider-illustration.svg",
    perks: [
      "Offer your services to global clients",
      "Build your professional portfolio",
      "Connect with potential clients",
      "Grow your business network",
      "Access verified opportunities",
    ],
    target: "provider",
  },
];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<CanonicalRole | null>(null);
  const router = useRouter();

  const roleToPath = useMemo(
    () =>
      ROLE_OPTIONS.reduce((acc, option) => {
        acc[option.role] = option.target;
        return acc;
      }, {} as Record<CanonicalRole, "provider" | "seeker/personal-information">),
    []
  );

  const handleRoleSelect = (role: CanonicalRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    const target = roleToPath[selectedRole];
    router.push(`/auth/onboarding/${target}?role=${selectedRole}`);
  };

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${inter.className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <Image
            src="/E-africa-logo.png"
            alt="E-Africa Logo"
            width={120}
            height={40}
            priority
            style={{ width: "auto", height: "40px" }}
          />
          <hr className="border-gray-200 mt-8" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 py-10 mb-12 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome to E-Africa! Choose your path
            </h1>
            <p className="text-xl text-gray-600">
              and start your journey with us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {ROLE_OPTIONS.map((option) => {
              const isSelected = selectedRole === option.role;

              return (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => handleRoleSelect(option.role)}
                  aria-pressed={isSelected}
                  className={`text-left relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13672B] ${
                    isSelected
                      ? "border-[#13672B] bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      {isSelected ? (
                        <div className="w-6 h-6 bg-[#13672B] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {option.subtitle}
                    </p>

                    <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Image
                        src={option.image}
                        alt={option.title}
                        width={96}
                        height={96}
                        style={{ height: "100%", width: "auto" }}
                      />
                    </div>
                  </div>

                  <div
                    className={`transition-opacity duration-300 ${
                      isSelected ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <ul className="space-y-3 text-gray-600">
                      {option.perks.map((perk) => (
                        <li key={perk} className="flex items-center">
                          <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center flex gap-3 flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-green-600 hover:text-green-700 font-medium underline"
            >
              Login
            </Link>
          </p>

          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="bg-[#13672B] text-white px-10 py-3 rounded-sm font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
