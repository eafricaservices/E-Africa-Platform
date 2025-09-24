"use client";

import { Poppins } from "next/font/google";
import { useState } from "react";
import StepHeader from "../components/stepHeader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// TEMPORARY NAVIGATION PROPS - Remove when API validation is ready
interface NavigationProps {
  onReset: () => void;
}

export default function CompletedStep({ onReset }: NavigationProps) {
  const [optInToJobs, setOptInToJobs] = useState(false);

  return (
    <div className={`${poppins.className}`}>
      <div id="header-ctn">
        <StepHeader
          title="Profile Complete"
          description="Your mentor profile is now on E-Africa"
        />
        <div className="flex items-center gap-2 justify-center">
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
        </div>
      </div>

      <div className="form-ctn mt-8">
        <div className="rounded-lg">
          <div className="text-center rounded-lg bg-[#DAFFE5] p-8 mb-8">
            <div className="w-20 h-20 bg-[#13672B] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to E-Africa !
            </h2>
            <p className="text-gray-600 mb-8">
              Your profile is under review and will be live within 24-48 hours
            </p>

            <div className="bg-white p-4 rounded-lg border-1 border-gray-200 mb-8">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optInToJobs}
                  onChange={(e) => setOptInToJobs(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#13672B] border-gray-300 rounded focus:ring-[#13672B] focus:ring-2"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  Opt in to post your job opportunities for our community of
                  dedicated mentees and job seekers.
                </span>
              </label>
            </div>
          </div>

          <div className="mb-8 p-8 rounded-lg bg-white">
            <div className="flex items-center mb-4">
              <img
                src="/lightbulb-icon.svg"
                alt="Next Steps"
                className="w-5 h-5 mr-3"
              />
              <h3 className="font-medium text-gray-900">Next Steps</h3>
            </div>
            <ul className="space-y-3 ml-8">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 mt-2"></div>
                <span className="text-sm text-gray-700">
                  You will receive an email when your profile is approved
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 mt-2"></div>
                <span className="text-sm text-gray-700">
                  After approval, complete your profile setup
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-3 mt-2"></div>
                <span className="text-sm text-gray-700">
                  Set up payment methods for receiving earnings
                </span>
              </li>
            </ul>
          </div>

          {/* TEMPORARY NAVIGATION - Remove when API validation is ready */}
          <div className="mt-12 flex justify-between">
            <button
              onClick={onReset}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Start Over
            </button>
            <button className="bg-[#13672B] text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#13672B] border-1 border-[#13672B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
