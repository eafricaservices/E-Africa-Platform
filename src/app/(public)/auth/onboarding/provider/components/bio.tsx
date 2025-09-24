"use client";

import React, { useState } from "react";

interface BioProps {
  onBioChange?: (bio: string) => void;
  maxLength?: number;
}

export default function Bio({ onBioChange, maxLength = 500 }: BioProps) {
  const [bio, setBio] = useState("");

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    if (newBio.length <= maxLength) {
      setBio(newBio);
      onBioChange?.(newBio);
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
            value={bio}
            onChange={handleBioChange}
            placeholder="Tell us about yourself and your professional journey...."
            className="w-full px-4 py-4 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500 resize-none h-32"
            rows={6}
          />

          {/* Character Count */}
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {bio.length} / {maxLength}
          </div>
        </div>
      </div>
    </div>
  );
}
