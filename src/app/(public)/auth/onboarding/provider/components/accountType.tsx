"use client";

import React from "react";

interface AccountTypeProps {
  selectedTypes: string[];
  onSelectionChange: (selectedTypes: string[]) => void;
  error?: string;
}

export default function AccountType({
  selectedTypes,
  onSelectionChange,
  error,
}: AccountTypeProps) {
  const handleTypeChange = (type: string) => {
    let newSelection: string[];

    if (type === "altruist") {
      newSelection = selectedTypes.includes("altruist") ? [] : ["altruist"];
    } else {
      const filteredTypes = selectedTypes.filter((t) => t !== "altruist");

      if (filteredTypes.includes(type)) {
        newSelection = filteredTypes.filter((t) => t !== type);
      } else {
        newSelection = [...filteredTypes, type];
      }
    }
    onSelectionChange(newSelection);
  };

  const isAltruistSelected = selectedTypes.includes("altruist");
  const isDisabled = (type: string) =>
    isAltruistSelected && type !== "altruist";

  const accountTypes = [
    {
      id: "consultant",
      title: "Consultant",
      description:
        "Earn while providing expertise and advice to solve specific problems. Work on project-based engagements with clear deliverables",
    },
    {
      id: "mentor",
      title: "Mentor",
      description:
        "Earn while focusing on long-term relationship building and personal development based on experience in similar situations",
    },
    {
      id: "altruist",
      title: "Altruist",
      description:
        "Shares knowledge and experience freely without expectation of reciprocal or financial benefits",
    },
    {
      id: "mentee",
      title: "Mentee",
      description:
        "A mentor can choose to also be a mentee. Provides the opportunity to learn, receive guidance, advice from other mentors",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Account type*
        </h3>
        <p className="text-gray-600 text-sm">
          Select all that apply. You can choose to be both a consultant, mentor
          and mentee.
        </p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accountTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          const disabled = isDisabled(type.id);

          return (
            <div
              key={type.id}
              className={`relative border-1 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                disabled
                  ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                  : isSelected
                  ? "border-[#13672B] bg-green-50"
                  : "border-gray-200 hover:border-[#13672B]"
              }`}
              onClick={() => !disabled && handleTypeChange(type.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 border-1 rounded flex items-center justify-center ${
                      disabled
                        ? "border-gray-300 bg-gray-100"
                        : isSelected
                        ? "border-[#13672B] bg-[#13672B]"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && !disabled && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h4
                    className={`font-medium mb-3 ${
                      disabled ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {type.title}
                  </h4>
                  <div
                    className={`text-sm ${
                      disabled ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <p>{type.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
