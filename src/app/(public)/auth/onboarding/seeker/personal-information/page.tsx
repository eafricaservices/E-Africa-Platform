"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Footer, Header, Stepper } from "../ui";
import { Inter } from "next/font/google";
import { MultiSelectDropdown } from "../components";

const inter = Inter({ subsets: ["latin"] });

export default function PersonalInformationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    state: "",
    country: "",
    careerStage: [] as string[],
    bio: "",
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const careerStageOptions = [
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

  const handleMultiSelectChange = useCallback(
    (field: FormField, value: string) => {
      setFormData((prev) => {
        if (Array.isArray(prev[field]) && prev[field].includes(value)) {
          return {
            ...prev,
            [field]: (prev[field] as string[]).filter((item) => item !== value),
          };
        } else if (Array.isArray(prev[field])) {
          return { ...prev, [field]: [...(prev[field] as string[]), value] };
        }
        return prev;
      });
    },
    []
  );

  const handleRemoveItem = useCallback((field: FormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((item) => item !== value),
    }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target as Node)
      );
      if (isOutside) setOpenDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`p-8 ${inter.className}`}>
      {/* Header */}
      <Header />

      <div className="p-6 bg-white">
        {/* Stepper */}
        <Stepper />

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
              className="w-full px-3 py-2 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors placeholder:text-sm"
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
              className="w-full px-3 py-2 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors placeholder:text-sm"
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
              className="w-full px-3 py-2 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors placeholder:text-sm"
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
              className="w-full px-3 py-2 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors placeholder:text-sm"
            />
          </div>

          {/* Career Stage */}
          <div>
            <MultiSelectDropdown
              label="Career Stage*"
              field="careerStage"
              options={careerStageOptions}
              placeholder="Select your career stage"
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              setFormData={setFormData}
              dropdownRef={(el) => {
                dropdownRefs.current.careerStage = el;
              }}
            />
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
              className="w-full px-3 py-3 border border-[#13672B] rounded-lg focus:ring-1 focus:ring-green-800 focus:border-green-800 outline-none transition-colors placeholder:text-sm resize-none"
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.bio.length} / 500
            </div>
          </div>

          <Footer />
        </form>
      </div>
    </div>
  );
}
// Removed custom useRef implementation; using React's useRef instead.

