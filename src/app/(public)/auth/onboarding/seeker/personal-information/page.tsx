"use client";
import { ArrowLeft, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Stepper from "../ui/ProgressBar";

const steps = [
  { number: 1, title: "Personal Information", href: "/auth/onboarding/seeker/personal-information" },
  { number: 2, title: "Career Goals", href: "/auth/onboarding/seeker/career-goals" },
  { number: 3, title: "Skills & Expertise", href: "/auth/onboarding/seeker/skills" },
  { number: 4, title: "Experience", href: "/auth/onboarding/seeker/experience" },
  { number: 5, title: "Final Details", href: "/auth/onboarding/seeker/final" },
];

export default function PersonalInformationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    state: "",
    country: "",
    yearsOfExperience: "0",
    careerStage: "",
    bio: "",
  });

  const careerStageOptions = [
    "Select your career stage",
    "Student/Recent Graduate",
    "Entry Level (0-2 years)",
    "Mid-Level (3-5 years)",
    "Senior Level (6-10 years)",
  ];

  type FormField = keyof typeof formData;

  const handleInputChange = (field: FormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    console.log("Form data:", formData);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between text-[#13672B]">
        <Link href="/auth/onboarding">
          <ArrowLeft />
        </Link>
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
        <Menu />
      </div>

      {/* Top section */}
      <div className="flex flex-col items-center bg-[#13672B] text-white p-8 rounded-lg mt-8">
        <h1 className="text-2xl font-medium">Create your profile</h1>
        <p className="text-sm font-light mt-3">
          Help us understand your career goals and connect you with the right opportunities
        </p>
      </div>

      <div className="p-6 bg-white">
        {/* Stepper */}
        <Stepper steps={steps} />

        {/* Personal Information Form */}
        <form className="space-y-6 p-6 bg-[#F7F9F9]">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name*
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full px-4 py-3 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              placeholder="e.g., Ikeja"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-4 py-3 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Region
            </label>
            <input
              type="text"
              placeholder="e.g., Lagos"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-4 py-3 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              placeholder="e.g., Nigeria"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full px-4 py-3 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of experience
            </label>
            <input
              type="number"
              min="0"
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
              className="w-full px-4 py-3 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors"
            />
          </div>

          {/* Career Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Career Stage*
            </label>
            <div className="relative">
              <select
                value={formData.careerStage}
                onChange={(e) => handleInputChange("careerStage", e.target.value)}
                className="w-full px-4 py-3 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors appearance-none bg-white"
              >
                {careerStageOptions.map((option, index) => (
                  <option key={index} value={index === 0 ? "" : option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              placeholder="Tell us about yourself and your professional journey..."
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.bio.length} / 500
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-8">
            <Link href="/auth/onboarding/seeker/career-goals">
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-[#13672B] text-white font-medium rounded-lg hover:bg-green-700 transition-colors focus:ring-2 outline-none cursor-pointer"
              >
                Continue
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
