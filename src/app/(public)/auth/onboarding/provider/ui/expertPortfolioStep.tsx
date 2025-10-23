import { Poppins } from "next/font/google";
import ExpertForm from "../components/expertForm";
import StepHeader from "../components/stepHeader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// TEMPORARY NAVIGATION PROPS - Remove when API validation is ready
interface NavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit?: (data: any) => void;
  errors?: Record<string, string>;
}

export default function ExpertPortfolio({
  onNext,
  onPrevious,
  onSubmit,
  errors,
}: NavigationProps) {
  return (
    <div className={`${poppins.className}`}>
      <div id="header-ctn">
        <StepHeader
          title="Expert Portfolio"
          description="Share your expertise and background"
        />
        <div className="flex items-center gap-2 justify-center">
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-ctn mt-8">
        <ExpertForm
          onSubmit={onSubmit ?? onNext}
          onGoBack={onPrevious}
          errors={errors}
        />
      </div>
    </div>
  );
}
