"use client";

import React, { useState, useRef, useEffect } from "react";

interface TimezoneDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const timezones = [
  "UTC-12:00 - Baker Island",
  "UTC-11:00 - American Samoa, Niue",
  "UTC-10:00 - Hawaii-Aleutian Standard Time (HST)",
  "UTC-09:30 - Marquesas Islands",
  "UTC-09:00 - Alaska Standard Time (AKST)",
  "UTC-08:00 - Pacific Standard Time (PST)",
  "UTC-07:00 - Mountain Standard Time (MST)",
  "UTC-06:00 - Central Standard Time (CST)",
  "UTC-05:00 - Eastern Standard Time (EST)",
  "UTC-04:00 - Atlantic Standard Time (AST)",
  "UTC-03:30 - Newfoundland Standard Time (NST)",
  "UTC-03:00 - Argentina, Brazil, Uruguay",
  "UTC-02:00 - South Georgia",
  "UTC-01:00 - Azores, Cape Verde",
  "UTC+00:00 - Greenwich Mean Time (GMT), London, Dublin",
  "UTC+01:00 - Central European Time (CET), Paris, Berlin, Rome",
  "UTC+02:00 - Eastern European Time (EET), Cairo, Athens",
  "UTC+03:00 - Moscow Standard Time (MSK), Turkey, Saudi Arabia",
  "UTC+03:30 - Iran Standard Time",
  "UTC+04:00 - Gulf Standard Time, Dubai, Abu Dhabi",
  "UTC+04:30 - Afghanistan Time",
  "UTC+05:00 - Pakistan Standard Time, Uzbekistan",
  "UTC+05:30 - India Standard Time (IST), Sri Lanka",
  "UTC+05:45 - Nepal Time",
  "UTC+06:00 - Bangladesh Standard Time, Kazakhstan",
  "UTC+06:30 - Myanmar Time",
  "UTC+07:00 - Indochina Time, Thailand, Vietnam",
  "UTC+08:00 - China Standard Time, Singapore, Philippines",
  "UTC+08:30 - North Korea Time",
  "UTC+09:00 - Japan Standard Time (JST), South Korea",
  "UTC+09:30 - Australian Central Standard Time",
  "UTC+10:00 - Australian Eastern Standard Time, Papua New Guinea",
  "UTC+10:30 - Lord Howe Standard Time",
  "UTC+11:00 - Solomon Islands, New Caledonia",
  "UTC+12:00 - New Zealand Standard Time, Fiji",
  "UTC+12:45 - Chatham Standard Time",
  "UTC+13:00 - Tonga, Samoa",
  "UTC+14:00 - Line Islands",
  // African Time Zones
  "UTC+01:00 - West Africa Time (WAT) - Nigeria, Ghana, Cameroon",
  "UTC+02:00 - Central Africa Time (CAT) - South Africa, Zimbabwe",
  "UTC+03:00 - East Africa Time (EAT) - Kenya, Tanzania, Ethiopia",
  "UTC+04:00 - Mauritius Time, Seychelles Time",
];

export default function timezoneDropdown({
  value,
  onChange,
}: TimezoneDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredTimezones = timezones.filter((timezone) =>
    timezone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (timezone: string) => {
    onChange(timezone);
    setIsOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".timezone-dropdown")) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative timezone-dropdown">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full px-4 py-3 border-1 border-gray-300 rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-700 bg-white flex justify-between items-center"
      >
        <span className={value ? "text-gray-900 truncate" : "text-gray-500"}>
          {value || "Select timezone"}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border-1 border-gray-300 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search timezone (e.g. GMT, WAT, Pacific)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border-1 border-gray-300 rounded-md focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-sm"
            />
          </div>

          {/* Timezone Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredTimezones.length > 0 ? (
              filteredTimezones.map((timezone) => (
                <button
                  key={timezone}
                  type="button"
                  onClick={() => handleSelect(timezone)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 hover:text-[#13672B] focus:outline-none focus:bg-gray-50 text-gray-700 border-b border-gray-100 last:border-b-0 text-sm"
                >
                  {timezone}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No timezones found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
