"use client";

import React, { useState } from "react";

interface PricingCardProps {
  title: string;
  duration: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

export default function PricingCard({
  title,
  duration,
  description,
  placeholder,
  value,
  onChange,
  label,
  disabled = false,
}: PricingCardProps) {
  return (
    <div className="border-1 border-[#13672B] rounded-lg p-6 flex-1">
      <div className="mb-4">
        <h3 className="text-[#13672B] font-normal text-lg">
          {title} {duration}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 border-1 rounded-lg focus:outline-none text-gray-900 placeholder-gray-500 ${
            disabled
              ? "border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500"
              : "border-[#13672B] focus:border-gray-300 focus:ring-1 focus:ring-[#13672B]"
          }`}
        />
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}
