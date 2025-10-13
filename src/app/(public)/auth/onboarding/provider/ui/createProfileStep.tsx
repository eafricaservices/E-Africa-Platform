import { Poppins } from "next/font/google";
import ProfileForm, { type ProfileFormValues } from "../components/profileForm";
import AccountType from "../components/accountType";
import UploadProfilePhoto from "../components/uploadProfilePhoto";
import Bio from "../components/bio";
import StepHeader from "../components/stepHeader";
import type { ProfilePictureUploadResult } from "@/lib/api/schemas/upload";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface CreateProfileStepProps {
  values: ProfileFormValues;
  errors: Partial<Record<keyof ProfileFormValues, string>>;
  onChange: <K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K]
  ) => void;
  accountTypes: string[];
  accountTypeError?: string | null;
  onAccountTypesChange: (types: string[]) => void;
  bio: string;
  bioError?: string | null;
  onBioChange: (value: string) => void;
  profilePhoto: ProfilePictureUploadResult | null;
  onProfilePhotoChange: (data: ProfilePictureUploadResult | null) => void;
  profilePhotoError?: string | null;
  onSubmit: () => void;
  submitting?: boolean;
  generalError?: string | null;
}

export default function CreateProfileStep({
  values,
  errors,
  onChange,
  accountTypes,
  accountTypeError,
  onAccountTypesChange,
  bio,
  bioError,
  onBioChange,
  profilePhoto,
  onProfilePhotoChange,
  profilePhotoError,
  onSubmit,
  submitting,
  generalError,
}: CreateProfileStepProps) {
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
        <ProfileForm values={values} errors={errors} onChange={onChange} />

        {/* Account Type Section */}
        <div className="mt-8">
          <AccountType
            selectedTypes={accountTypes}
            onSelectionChange={onAccountTypesChange}
            error={accountTypeError || undefined}
          />
        </div>

        {/* Upload Profile Photo Section */}
        <div className="mt-8">
          <UploadProfilePhoto
            onFileUpload={onProfilePhotoChange}
            value={profilePhoto}
            errorMessage={profilePhotoError || undefined}
          />
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <Bio
            value={bio}
            onChange={onBioChange}
            error={bioError || undefined}
          />
        </div>

        {generalError && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {generalError}
          </div>
        )}

        <div className="mt-12 flex justify-end">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="bg-[#13672B] text-white px-8 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-white hover:text-[#13672B]"
          >
            {submitting ? "Saving..." : "Save and Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
