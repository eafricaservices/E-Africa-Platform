"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Header, Stepper } from "../ui";
import { Inter } from "next/font/google";
import MultiSelectDropdown, { CareerGoalsFormData, CareerGoalsFormField } from "../components/MultiSelectDropdown";

const inter = Inter({ subsets: ["latin"] });

export default function CareerGoalsPage() {
  const [formData, setFormData] = useState<CareerGoalsFormData>({
    preferredCareerPath: [],
    primaryCareerGoal: [],
    industryOfInterest: [],
    targetJobRoles: "",
    expectedTimeline: [],
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [customIndustry, setCustomIndustry] = useState("");
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const careerPathOptions = [
    "Product Design", 
    "Software Development", 
    "Data Science & Analytics", 
    "Digital Marketing"
  ];
  const careerGoalOptions = [
    "Find Remote Job", 
    "Get Internship", 
    "Career Transition", 
    "Skill Development", 
    "Networking with Experts"
  ];
  const timelineOptions = [
    "0-3 months", 
    "3-6 months", 
    "6-12 months", 
    "1-2 years"
  ];
  const industryOptions = [
    "Education", 
    "Tech", 
    "Health", 
    "Finance", 
    "Marketing"
  ];

  const handleMultiSelectChange = useCallback((field: CareerGoalsFormField, value: string) => {
    setFormData((prev) => {
      if (prev[field].includes(value)) {
        return { ...prev, [field]: (prev[field] as string[]).filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...(prev[field] as string[]), value] };
      }
    });
  }, []);

  const handleRemoveItem = useCallback((field: CareerGoalsFormField, value: string) => {
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
    <div className={`min-h-screen max-w-7xl mx-auto ${inter.className}`}>
      <div className="p-10">
        <Header />
        <div className="p-6">
          <Stepper />

          <div className="space-y-6 p-6 mb-5 bg-[#F7F9F9] rounded-lg">
            <MultiSelectDropdown
              label="Preferred Career Path"
              field="preferredCareerPath"
              options={careerPathOptions}
              placeholder="e.g., Product Design"
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              customIndustry={customIndustry}
              setCustomIndustry={setCustomIndustry}
              setFormData={setFormData}
              dropdownRef={(el) => { dropdownRefs.current.preferredCareerPath = el; }}
            />

            <MultiSelectDropdown
              label="Primary Career Goal"
              field="primaryCareerGoal"
              options={careerGoalOptions}
              placeholder="Select. e.g., Find Remote Job"
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              customIndustry={customIndustry}
              setCustomIndustry={setCustomIndustry}
              setFormData={setFormData}
              dropdownRef={(el) => { dropdownRefs.current.primaryCareerGoal = el; }}
            />

            <MultiSelectDropdown
              label="Industry Of Interest"
              field="industryOfInterest"
              options={industryOptions}
              placeholder="e.g., Tech, Education, Health, and Finance, e.t.c.."
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              customIndustry={customIndustry}
              setCustomIndustry={setCustomIndustry}
              setFormData={setFormData}
              dropdownRef={(el) => { dropdownRefs.current.industryOfInterest = el; }}
            />

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Target Job Role(s) <span className="font-normal">(Optional)</span></label>
              <input
                type="text"
                placeholder="e.g., UX Designer, Backend Developer, e.t.c."
                value={formData.targetJobRoles}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetJobRoles: e.target.value }))}
                className="w-full px-4 text-sm py-2 border border-[#13672B] rounded-lg focus:ring-[0.5px] focus:ring-[#13672B] focus:border-[#13672B] outline-none transition-colors placeholder:text-sm"
              />
            </div>

            <MultiSelectDropdown
              label="Expected Timeline to Achieve Goal"
              field="expectedTimeline"
              options={timelineOptions}
              placeholder="Select. e.g., 0-3 months, 3-6 months, e.t.c."
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              customIndustry={customIndustry}
              setCustomIndustry={setCustomIndustry}
              setFormData={setFormData}
              dropdownRef={(el) => { dropdownRefs.current.expectedTimeline = el; }}
            />

            <div className="flex justify-between items-center mt-8">
              <Link href="/auth/onboarding/seeker/personal-information">
                <button type="button" className="text-[#13672B] font-medium">
                  <ArrowLeft className="inline w-5 h-5 mr-1" />
                  Back
                </button>
              </Link>

              <Link href="/auth/onboarding/seeker/skills">
                <button
                  type="button"
                  className="px-8 py-2 bg-[#13672B] text-sm text-white font-medium rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 outline-none shadow-sm cursor-pointer"
                >
                  Continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
