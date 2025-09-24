"use client";

import React from "react";

interface DayButtonProps {
  day: string;
  isSelected: boolean;
  onToggle: () => void;
}

export default function dayButton({
  day,
  isSelected,
  onToggle,
}: DayButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex-1 py-3 rounded-lg font-medium transition-all cursor-pointer hover:scale-[1.02] ${
        isSelected
          ? "bg-[#13672B] text-white border-1 border-[#13672B]"
          : "bg-white text-gray-700 border-1 border-gray-300 hover:border-[#13672B] hover:text-[#13672B]"
      }`}
    >
      {day}
    </button>
  );
}
