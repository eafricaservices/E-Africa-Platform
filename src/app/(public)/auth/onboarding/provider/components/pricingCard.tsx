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
}

export default function PricingCard({
  title,
  duration,
  description,
  placeholder,
  value,
  onChange,
  label,
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}
