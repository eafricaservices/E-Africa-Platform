"use client";
import React, { useCallback } from "react";
import { ChevronDown, X } from "lucide-react";

export type CareerGoalsFormData = {
    preferredCareerPath: string[];
    primaryCareerGoal: string[];
    industryOfInterest: string[];
    targetJobRoles: string;
    expectedTimeline: string[];
};

export type CareerGoalsFormField = keyof CareerGoalsFormData;

interface MultiSelectDropdownProps {
    label: string;
    field: CareerGoalsFormField;
    options: string[];
    placeholder: string;
    formData: CareerGoalsFormData;
    openDropdown: string | null;
    setOpenDropdown: (value: string | null) => void;
    handleMultiSelectChange: (field: CareerGoalsFormField, value: string) => void;
    handleRemoveItem: (field: CareerGoalsFormField, value: string) => void;
    customIndustry: string;
    setCustomIndustry: (value: string) => void;
    setFormData: React.Dispatch<React.SetStateAction<CareerGoalsFormData>>;
    dropdownRef: (el: HTMLDivElement | null) => void;
    className?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = React.memo(
    ({
        label,
        field,
        options,
        placeholder,
        formData,
        openDropdown,
        setOpenDropdown,
        handleMultiSelectChange,
        handleRemoveItem,
        customIndustry,
        setCustomIndustry,
        setFormData,
        dropdownRef,
    }) => {
        const handleCustomIndustryChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomIndustry(e.target.value);
            },
            [setCustomIndustry]
        );

        const handleAddCustomIndustry = useCallback(() => {
            if (customIndustry.trim() !== "") {
                setFormData((prev) => ({
                    ...prev,
                    industryOfInterest: [...prev.industryOfInterest, customIndustry.trim()],
                }));
                setCustomIndustry("");
                setOpenDropdown(null);
            }
        }, [customIndustry, setFormData, setCustomIndustry, setOpenDropdown]);

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && customIndustry.trim() !== "") {
                    e.preventDefault();
                    handleAddCustomIndustry();
                }
            },
            [customIndustry, handleAddCustomIndustry]
        );

        return (
            <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-800 mb-2">{label}</label>
                <div
                    className="flex flex-wrap gap-2 items-center px-3 py-2 border border-[#13672B] rounded-lg bg-white cursor-pointer"
                    onClick={() => setOpenDropdown(openDropdown === field ? null : field)}
                >
                    {Array.isArray(formData[field]) && formData[field].length > 0 ? (
                        (formData[field] as string[]).map((item) => (
                            <span
                                key={item}
                                className="flex items-center bg-[#13672B]/10 text-[#13672B] px-2 py-1 rounded-md text-sm"
                            >
                                {item}
                                <X
                                    className="ml-1 w-4 h-4 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveItem(field, item);
                                    }}
                                />
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-600 text-sm">{placeholder}</span>
                    )}
                    <ChevronDown className="ml-auto w-5 h-5 text-gray-400" />
                </div>

                {openDropdown === field && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 space-y-2 max-w-lg">
                        {options.map((option) => (
                            <label
                                key={option}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData[field].includes(option)}
                                    onChange={() => handleMultiSelectChange(field, option)}
                                    className="w-4 h-4 text-[#13672B] border-[#13672B] rounded focus:ring-[#13672B] accent-[#13672B] text-sm"
                                />
                                <p className="text-sm">{option}</p>
                            </label>
                        ))}

                        {field === "industryOfInterest" && (
                            <div
                                className="flex items-center gap-2 p-2 border-b-[1.5px] border-[#13672B] text-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <input
                                    type="text"
                                    placeholder="Other"
                                    value={customIndustry}
                                    onChange={handleCustomIndustryChange}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 py-1 focus:ring-0 focus:border-[#13672B] outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCustomIndustry}
                                    className="text-[#13672B] font-semibold hover:underline"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

MultiSelectDropdown.displayName = "MultiSelectDropdown";

export default MultiSelectDropdown;
