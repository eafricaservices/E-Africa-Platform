"use client";

import React, { useState } from "react";
import UploadResume from "./uploadResume";

interface ExpertFormProps {
  onSubmit?: (data: any) => void;
  onGoBack?: () => void;
}

export default function ExpertForm({ onSubmit, onGoBack }: ExpertFormProps) {
  const [formData, setFormData] = useState({
    expertise: "",
    education: "",
    linkedinProfile: "",
    website: "",
  });

  const [dropdownStates, setDropdownStates] = useState({
    expertise: false,
    education: false,
  });

  const expertiseOptions = [
    "Technology/Software",
    "Healthcare/Medical",
    "Finance/Banking",
    "Marketing/Advertising",
    "Education",
    "Retail/E-commerce",
    "Manufacturing",
    "Consulting",
    "Real Estate",
    "Government",
    "Non-profit",
    "Other (please specify)",
  ];

  const educationOptions = [
    "OND",
    "HND",
    "Bachelors",
    "Masters",
    "Doctorate [PhD]",
  ];

  const handleDropdownToggle = (dropdown: "expertise" | "education") => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleOptionSelect = (
    field: "expertise" | "education",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setDropdownStates((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit?.(formData);
  };

  return (
    <div className="space-y-6">
      {/* Primary Expertise Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Expertise Industry*
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => handleDropdownToggle("expertise")}
            className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-left bg-white flex justify-between items-center"
          >
            <span
              className={formData.expertise ? "text-gray-900" : "text-gray-500"}
            >
              {formData.expertise || "Select expertise"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                dropdownStates.expertise ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownStates.expertise && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="py-1">
                <div className="px-4 py-2 text-gray-400 text-sm">
                  Select expertise
                </div>
                {expertiseOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect("expertise", option)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Background */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Educational Background*
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => handleDropdownToggle("education")}
            className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-left bg-white flex justify-between items-center"
          >
            <span
              className={formData.education ? "text-gray-900" : "text-gray-500"}
            >
              {formData.education || "Select highest education level"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                dropdownStates.education ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownStates.education && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="py-1">
                <div className="px-4 py-2 text-gray-400 text-sm">
                  Select highest education level
                </div>
                {educationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect("education", option)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Portfolio/Resume */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Upload Portfolio/Resume*
        </label>
        <UploadResume />
      </div>

      {/* LinkedIn Profile */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LinkedIn Profile*
        </label>
        <input
          type="url"
          value={formData.linkedinProfile}
          onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
          placeholder="https://linkedin/in/your profile"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website*
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          placeholder="https://portfolio or personal site"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={onGoBack}
          className="px-8 py-3 border-2 border-[#13672B] text-[#13672B] rounded-lg font-medium hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2"
        >
          Go back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-3 bg-[#13672B] text-white rounded-lg font-medium hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}
