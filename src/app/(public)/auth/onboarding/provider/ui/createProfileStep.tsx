import { Poppins } from "next/font/google";
import ProfileForm from "../components/profileForm";
import AccountType from "../components/accountType";
import UploadProfilePhoto from "../components/uploadProfilePhoto";
import Bio from "../components/bio";
import StepHeader from "../components/stepHeader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// TEMPORARY NAVIGATION PROPS - Remove when API validation is ready
interface NavigationProps {
  onNext: () => void;
}

export default function CreateProfileStep({ onNext }: NavigationProps) {
  return (
    <div className={`${poppins.className}`}>
      <div id="header-ctn">
        <StepHeader
          title="Create your Profile"
          description="Let's start with your basic information"
        />
        <div className="flex items-center gap-2 justify-center">
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-ctn mt-8">
        <ProfileForm />

        {/* Account Type Section */}
        <div className="mt-8">
          <AccountType />
        </div>

        {/* Upload Profile Photo Section */}
        <div className="mt-8">
          <UploadProfilePhoto />
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <Bio />
        </div>

        {/* TEMPORARY NAVIGATION - Remove when API validation is ready */}
        <div className="mt-12 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="bg-[#13672B] text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#13672B] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2"
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
}
