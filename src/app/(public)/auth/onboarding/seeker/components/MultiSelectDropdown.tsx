// MultiSelectDropdown.tsx
"use client";
import React, { useCallback } from "react";
import { ChevronDown, X } from "lucide-react";

export interface MultiSelectDropdownProps<T extends Record<string, any>> {
  label: string;
  field: keyof T;
  options: string[];
  placeholder: string;
  formData: T;
  openDropdown: string | null;
  setOpenDropdown: (value: string | null) => void;
  handleMultiSelectChange: (field: keyof T, value: string) => void;
  handleRemoveItem: (field: keyof T, value: string) => void;
  allowCustom?: boolean;
  customValue?: string;
  setCustomValue?: (value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  dropdownRef: (el: HTMLDivElement | null) => void;
  className?: string;
  mode?: "multi" | "single";
}

function MultiSelectDropdown<T extends Record<string, any>>({
  label,
  field,
  options,
  placeholder,
  formData,
  openDropdown,
  setOpenDropdown,
  handleMultiSelectChange,
  handleRemoveItem,
  customValue = "",
  setCustomValue,
  setFormData,
  dropdownRef,
  mode = "single",
}: MultiSelectDropdownProps<T>) {
  const handleCustomValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomValue?.(e.target.value);
    },
    [setCustomValue]
  );

  const handleAddCustomValue = useCallback(() => {
    if (customValue?.trim()) {
      if (mode === "single") {
        setFormData((prev) => ({
          ...prev,
          [field]: customValue.trim(),
        }));
      } else {
        setFormData((prev) => {
          const currentValues = Array.isArray(prev[field]) ? prev[field] : [];
          return {
            ...prev,
            [field]: [...currentValues, customValue.trim()],
          };
        });
      }
      setCustomValue?.("");
      setOpenDropdown(null);
    }
  }, [customValue, setFormData, setCustomValue, setOpenDropdown, mode, field]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddCustomValue();
      }
    },
    [handleAddCustomValue]
  );

  const handleOptionClick = useCallback(
    (option: string) => {
      if (mode === "single") {
        setFormData((prev) => ({
          ...prev,
          [field]: option,
        }));
        setOpenDropdown(null);
      } else {
        handleMultiSelectChange(field, option);
      }
    },
    [mode, field, setFormData, setOpenDropdown, handleMultiSelectChange]
  );

  const isSelected = useCallback(
    (option: string) => {
      if (mode === "single") {
        return formData[field] === option;
      }
      return Array.isArray(formData[field]) && formData[field].includes(option);
    },
    [mode, formData, field]
  );

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        {label}
      </label>
      <div
        className="flex flex-wrap gap-2 items-center px-3 py-2 border border-[#13672B] rounded-lg bg-white cursor-pointer"
        onClick={() => setOpenDropdown(openDropdown === field ? null : String(field))}
      >
        {mode === "single" ? (
          // Single select display
          formData[field] && String(formData[field]).trim() !== "" ? (
            <span className="flex items-center bg-[#13672B]/10 text-[#13672B] px-2 py-1 rounded-md text-sm">
              {formData[field] as string}
              <X
                className="ml-1 w-4 h-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData((prev) => ({
                    ...prev,
                    [field]: "",
                  }));
                }}
              />
            </span>
          ) : (
            <span className="text-gray-600 text-sm">{placeholder}</span>
          )
        ) : (
          // Multi select display
          Array.isArray(formData[field]) && formData[field].length > 0 ? (
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
          )
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
                type={mode === "single" ? "radio" : "checkbox"}
                checked={isSelected(option)}
                onChange={() => handleOptionClick(option)}
                className="w-4 h-4 text-[#13672B] border-[#13672B] rounded focus:ring-[#13672B] accent-[#13672B] text-sm"
              />
              <p className="text-sm">{option}</p>
            </label>
          ))}

          {(field === "industryOfInterest" || field === "preferredCareerPath" || field === "coreSkills" || field === "tools") && (
            <div
              className="flex items-center gap-2 p-2 border-b-[1.5px] border-[#13672B] text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="Other"
                value={customValue}
                onChange={handleCustomValueChange}
                onKeyDown={handleKeyDown}
                className="flex-1 py-1 focus:ring-0 focus:border-[#13672B] outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomValue}
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

export default React.memo(MultiSelectDropdown) as typeof MultiSelectDropdown;