import { Poppins } from "next/font/google";
import StepHeader from "../components/stepHeader";
import VideoRecorder from "../components/videoRecorder";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// TEMPORARY NAVIGATION PROPS - Remove when API validation is ready
interface NavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

export default function VideoIntroStep({
  onNext,
  onPrevious,
}: NavigationProps) {
  return (
    <div className={`${poppins.className}`}>
      <div id="header-ctn">
        <StepHeader
          title="Video Introduction"
          description="Record a 60-second introduction for potential mentees"
        />
        <div className="flex items-center gap-2 justify-center">
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-ctn mt-8">
        <VideoRecorder onNext={onNext} onPrevious={onPrevious} />
      </div>
    </div>
  );
}
