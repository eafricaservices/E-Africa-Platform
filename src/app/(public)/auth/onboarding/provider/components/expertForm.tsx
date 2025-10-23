"use client";

import React, { useState } from "react";
import UploadResume from "./uploadResume";
import { ResumeUploadResult } from "@/lib/api/schemas/upload";

interface ExpertFormProps {
  onSubmit?: (data: any) => void;
  onGoBack?: () => void;
  errors?: Record<string, string>;
}

export default function ExpertForm({
  onSubmit,
  onGoBack,
  errors,
}: ExpertFormProps) {
  const [formData, setFormData] = useState({
    primaryExpertise: "",
    educationLevel: "",
    linkedinProfileUrl: "",
    websiteUrl: "",
  });

  const [resumeData, setResumeData] = useState<ResumeUploadResult | null>(null);

  const [dropdownStates, setDropdownStates] = useState({
    primaryExpertise: false,
    educationLevel: false,
  });

  const [customExpertise, setCustomExpertise] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

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

  const handleDropdownToggle = (
    dropdown: "primaryExpertise" | "educationLevel"
  ) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleOptionSelect = (
    field: "primaryExpertise" | "educationLevel",
    value: string
  ) => {
    if (field === "primaryExpertise" && value === "Other (please specify)") {
      setShowCustomInput(true);
      setDropdownStates((prev) => ({
        ...prev,
        [field]: false,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setDropdownStates((prev) => ({
        ...prev,
        [field]: false,
      }));
      if (field === "primaryExpertise") {
        setShowCustomInput(false);
        setCustomExpertise("");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomExpertiseSubmit = () => {
    if (customExpertise.trim()) {
      setFormData((prev) => ({
        ...prev,
        primaryExpertise: customExpertise.trim(),
      }));
      setShowCustomInput(false);
    }
  };

  const handleCustomExpertiseCancel = () => {
    setShowCustomInput(false);
    setCustomExpertise("");
  };

  const handleSubmit = () => {
    onSubmit?.({
      primaryExpertise: formData.primaryExpertise,
      educationLevel: formData.educationLevel,
      portfolioOrResume: resumeData,
      linkedinProfileUrl: formData.linkedinProfileUrl,
      websiteUrl: formData.websiteUrl,
    });
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
            onClick={() => handleDropdownToggle("primaryExpertise")}
            className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-left bg-white flex justify-between items-center"
          >
            <span
              className={
                formData.primaryExpertise ? "text-gray-900" : "text-gray-500"
              }
            >
              {formData.primaryExpertise || "Select expertise"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                dropdownStates.primaryExpertise ? "rotate-180" : ""
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

          {dropdownStates.primaryExpertise && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="py-1">
                <div className="px-4 py-2 text-gray-400 text-sm">
                  Select expertise
                </div>
                {expertiseOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      handleOptionSelect("primaryExpertise", option)
                    }
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errors?.primaryExpertise && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.primaryExpertise}
          </p>
        )}

        {/* Custom Expertise Input */}
        {showCustomInput && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg border-1 border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please specify your expertise:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customExpertise}
                onChange={(e) => setCustomExpertise(e.target.value)}
                placeholder="Enter your area of expertise"
                className="flex-1 px-3 py-2 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCustomExpertiseSubmit();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleCustomExpertiseSubmit}
                className="px-4 py-2 bg-[#13672B] text-white rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleCustomExpertiseCancel}
                className="px-4 py-2 border-1 border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Educational Background */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Educational Background*
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => handleDropdownToggle("educationLevel")}
            className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-left bg-white flex justify-between items-center"
          >
            <span
              className={
                formData.educationLevel ? "text-gray-900" : "text-gray-500"
              }
            >
              {formData.educationLevel || "Select highest education level"}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                dropdownStates.educationLevel ? "rotate-180" : ""
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

          {dropdownStates.educationLevel && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="py-1">
                <div className="px-4 py-2 text-gray-400 text-sm">
                  Select highest education level
                </div>
                {educationOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionSelect("educationLevel", option)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errors?.educationLevel && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.educationLevel}
          </p>
        )}
      </div>

      {/* Upload Portfolio/Resume */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Upload Portfolio/Resume*
        </label>
        <UploadResume
          value={resumeData}
          onFileUpload={(data) => setResumeData(data)}
        />
        {errors?.portfolioOrResume && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.portfolioOrResume}
          </p>
        )}
      </div>

      {/* LinkedIn Profile */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LinkedIn Profile*
        </label>
        <input
          type="url"
          value={formData.linkedinProfileUrl}
          onChange={(e) =>
            handleInputChange("linkedinProfileUrl", e.target.value)
          }
          placeholder="https://linkedin/in/your profile"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
        {errors?.linkedinProfileUrl && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.linkedinProfileUrl}
          </p>
        )}
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website*
        </label>
        <input
          type="url"
          value={formData.websiteUrl}
          onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
          placeholder="https://portfolio or personal site"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
        {errors?.websiteUrl && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.websiteUrl}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8 gap-2 flex-col md:flex-row">
        <button
          type="button"
          onClick={onGoBack}
          className="px-8 py-3 border-2 border-[#13672B] text-[#13672B] rounded-lg font-medium hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2 w-full md:w-auto text-center"
        >
          Go back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-3 bg-[#13672B] text-white rounded-lg font-medium hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2  w-full md:w-auto text-center"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}
