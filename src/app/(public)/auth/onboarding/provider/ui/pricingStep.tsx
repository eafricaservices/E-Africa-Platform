import { Poppins } from "next/font/google";
import StepHeader from "../components/stepHeader";
import PricingCard from "../components/pricingCard";
import { useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// TEMPORARY NAVIGATION PROPS - Remove when API validation is ready
interface NavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

export default function PricingStep({ onNext, onPrevious }: NavigationProps) {
  const [discoveryPrice, setDiscoveryPrice] = useState("");
  const [deepDivePrice, setDeepDivePrice] = useState("");
  const [portfolioPrice, setPortfolioPrice] = useState("");
  const [mockInterviewPrice, setMockInterviewPrice] = useState("");

  return (
    <div className={`${poppins.className}`}>
      <div id="header-ctn">
        <StepHeader
          title="Pricing Setup"
          description="Set your session rates and availability"
        />
        <div className="flex items-center gap-2 justify-center">
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-ctn mt-8">
        {/* Top Row - Discovery Call and Deep Dive */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <PricingCard
            title="Discovery Call"
            duration="[30 min]*"
            description="Initial consultation"
            placeholder="Free"
            value={discoveryPrice}
            onChange={setDiscoveryPrice}
            label="Free session"
            disabled={true}
          />
          <PricingCard
            title="Deep Dive"
            duration="[90 min]*"
            description="Comprehensive mentoring"
            placeholder="e.g 30 coins"
            value={deepDivePrice}
            onChange={setDeepDivePrice}
            label="Coins per session"
          />
        </div>

        {/* Bottom Row - Portfolio Review and Mock Interview */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <PricingCard
            title="Portfolio review"
            duration="[60 min]*"
            description="Review and feedback"
            placeholder="e.g 30 coins"
            value={portfolioPrice}
            onChange={setPortfolioPrice}
            label="Coins per session"
          />
          <PricingCard
            title="Mock Interview"
            duration="[45 min]*"
            description="Interview preparation"
            placeholder="e.g 30 coins"
            value={mockInterviewPrice}
            onChange={setMockInterviewPrice}
            label="Coins per session"
          />
        </div>

        {/* TEMPORARY NAVIGATION - Remove when API validation is ready */}
        <div className="flex justify-between items-center pt-8 gap-2 flex-col md:flex-row">
          <button
            type="button"
            onClick={onPrevious}
            className="px-8 py-3 border-2 border-[#13672B] text-[#13672B] rounded-lg font-medium hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2 w-full md:w-auto text-center"
          >
            Go back
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 bg-[#13672B] text-white rounded-lg font-medium hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2 w-full md:w-auto text-center"
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
}
