"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, CheckCircle } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

type Role = "seeker/personal-information" | "provider" | null;

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const router = useRouter();

  const handleRoleSelect = (role: "seeker/personal-information" | "provider") => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/auth/onboarding/${selectedRole}`);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${inter.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="mb-12">
          <Image
            src="/E-africa-logo.png"
            alt="E-Africa Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          {/* HR line separator */}
          <hr className="border-gray-200 mt-8" />
        </div>

        {/* Welcome Heading */}
        {/* Role Cards */}
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
            {/* Service Seeker Card */}
            <div
              onClick={() => handleRoleSelect("seeker/personal-information")}
              className={`relative bg-white rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedRole === "seeker/personal-information"
                  ? "border-[#13672B] bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="text-center mb-6">
                {/* Selection Indicator - at top center above title */}
                <div className="flex justify-center mb-4">
                  {selectedRole === "seeker/personal-information" ? (
                    <div className="w-6 h-6 bg-[#13672B] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Join as a service seeker
                </h3>

                {/* Seeker Illustration */}
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <img
                    src="/seeker-illustration.svg"
                    alt="Service Seeker"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Feature List */}
              <div
                className={`transition-opacity duration-300 ${
                  selectedRole === "seeker/personal-information" ? "opacity-100" : "opacity-0"
                }`}
              >
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Find remote jobs or internships
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Connect with mentors and industry experts
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Build your personalized career roadmap
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Collaborate and learn from peers
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Verified opportunities and guidance
                  </li>
                </ul>
              </div>
            </div>

            {/* Service Provider Card */}
            <div
              onClick={() => handleRoleSelect("provider")}
              className={`relative bg-white rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedRole === "provider"
                  ? "border-[#13672B] bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="text-center mb-6">
                {/* Selection Indicator - at top center above title */}
                <div className="flex justify-center mb-4">
                  {selectedRole === "provider" ? (
                    <div className="w-6 h-6 bg-[#13672B] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Join as a service provider
                </h3>

                {/* Provider Illustration */}
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <img
                    src="/provider-illustration.svg"
                    alt="Service Provider"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Feature List */}
              <div
                className={`transition-opacity duration-300 ${
                  selectedRole === "provider" ? "opacity-100" : "opacity-0"
                }`}
              >
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Offer your services to global clients
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Build your professional portfolio
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Connect with potential clients
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Grow your business network
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    Access verified opportunities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
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
