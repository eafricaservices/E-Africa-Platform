"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Footer, Header, Stepper } from "../ui";
import { Inter } from "next/font/google";
import { MultiSelectDropdown } from "../components";

const inter = Inter({ subsets: ["latin"] });

export interface CareerGoalsFormData {
  preferredCareerPath: string[];
  primaryCareerGoal: string[];
  industryOfInterest: string[];
  targetJobRoles: string;
  expectedTimeline: string[];
}

export default function CareerGoalsPage() {
  const [formData, setFormData] = useState<CareerGoalsFormData>({
    preferredCareerPath: [],
    primaryCareerGoal: [],
    industryOfInterest: [],
    targetJobRoles: "",
    expectedTimeline: [],
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState("");
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const careerPathOptions = [
    "Product Design",
    "Software Development",
    "Data Science & Analytics",
    "Digital Marketing",
  ];
  const careerGoalOptions = [
    "Find Remote Job",
    "Get Internship",
    "Career Transition",
    "Skill Development",
    "Networking with Experts",
  ];
  const timelineOptions = ["0-3 months", "3-6 months", "6-12 months", "1-2 years"];
  const industryOptions = ["Education", "Tech", "Health", "Finance", "Marketing"];

  const handleMultiSelectChange = useCallback(
    (field: keyof CareerGoalsFormData, value: string) => {
      setFormData((prev) => {
        if ((prev[field] as string[]).includes(value)) {
          return {
            ...prev,
            [field]: (prev[field] as string[]).filter((item) => item !== value),
          };
        } else {
          return {
            ...prev,
            [field]: [...(prev[field] as string[]), value],
          };
        }
      });
    },
    []
  );

  const handleRemoveItem = useCallback(
    (field: keyof CareerGoalsFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((item) => item !== value),
      }));
    },
    []
  );

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
            <MultiSelectDropdown<CareerGoalsFormData>
              label="Preferred Career Path*"
              field="preferredCareerPath"
              options={careerPathOptions}
              placeholder="e.g., Product Design"
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              setFormData={setFormData}
              allowCustom
              customValue={customValue}
              setCustomValue={setCustomValue}
              dropdownRef={(el) => {
                dropdownRefs.current.preferredCareerPath = el;
              }}
              required={true}
            />

            <MultiSelectDropdown<CareerGoalsFormData>
              label="Primary Career Goal"
              field="primaryCareerGoal"
              options={careerGoalOptions}
              placeholder="Select. e.g., Find Remote Job"
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              setFormData={setFormData}
              dropdownRef={(el) => {
                dropdownRefs.current.primaryCareerGoal = el;
              }}
              required={true}
            />

            <MultiSelectDropdown<CareerGoalsFormData>
              label="Industry Of Interest"
              field="industryOfInterest"
              options={industryOptions}
              placeholder="e.g., Tech, Education, Health, Finance, etc."
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              allowCustom
              customValue={customValue}
              setCustomValue={setCustomValue}
              setFormData={setFormData}
              dropdownRef={(el) => {
                dropdownRefs.current.industryOfInterest = el;
              }}
              required={true}
            />

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Target Job Role(s){" "}
                <span className="font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., UX Designer, Backend Developer, etc."
                value={formData.targetJobRoles}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetJobRoles: e.target.value,
                  }))
                }
                className="w-full px-4 text-sm py-2 border border-[#13672B] rounded-lg focus:ring-[0.5px] focus:ring-[#13672B] focus:border-[#13672B] outline-none transition-colors placeholder:text-sm"
              />
            </div>

            <MultiSelectDropdown<CareerGoalsFormData>
              label="Expected Timeline to Achieve Goal"
              field="expectedTimeline"
              options={timelineOptions}
              placeholder="Select. e.g., 0-3 months, 3-6 months, etc."
              formData={formData}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleMultiSelectChange={handleMultiSelectChange}
              handleRemoveItem={handleRemoveItem}
              setFormData={setFormData}
              dropdownRef={(el) => {
                dropdownRefs.current.expectedTimeline = el;
              }}
              required={true}
            />

            <Footer stepNumber={2} formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}
