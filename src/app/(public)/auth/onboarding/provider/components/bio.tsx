"use client";

import React from "react";

interface BioProps {
  value: string;
  onChange: (bio: string) => void;
  maxLength?: number;
  error?: string;
}

export default function Bio({
  value,
  onChange,
  maxLength = 500,
  error,
}: BioProps) {
  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = event.target.value;
    if (newBio.length <= maxLength) {
      onChange(newBio);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bio Section */}
      <div>
        <label className="block text-lg font-medium text-gray-900 mb-4">
          Bio*
        </label>

        <div className="relative">
          <textarea
            value={value}
            onChange={handleBioChange}
            placeholder="Tell us about yourself and your professional journey...."
            className={`w-full px-4 py-4 border-1 rounded-lg focus:outline-none focus:ring-1 text-gray-900 placeholder-gray-500 resize-none h-32 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-[#13672B] focus:border-[#13672B] focus:ring-[#13672B]"
            }`}
            rows={6}
          />

          {/* Character Count */}
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {value.length} / {maxLength}
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
