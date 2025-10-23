"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateProfileStep from "./ui/createProfileStep";
import ExpertPortfolio from "./ui/expertPortfolioStep";
import VideoIntroStep from "./ui/videoIntroStep";
import PricingStep from "./ui/pricingStep";
import AvailabilityStep from "./ui/availabilityStep";
import CompletedStep from "./ui/completedStep";
import {
  getProviderOnboardingProgress,
  submitProviderOnboardingStep1,
  submitProviderOnboardingStep2,
  type ProviderOnboardingProgressSummary,
} from "@/lib/api/endpoints/providerOnboarding.client";
import { updateUser } from "@/lib/api/endpoints/user.client";
import { ProviderOnboardingStepErrorSchema } from "@/lib/api/schemas/providerOnboarding";
import type { AuthUser } from "@/lib/api/schemas/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/app/modules/auth/AuthContext";
import { isProviderRole } from "@/app/modules/auth/utils";
import {
  mapCanonicalToBackendRole,
  normalizeToCanonicalRole,
} from "@/lib/auth/roleMappings";
import type { ProfileFormValues } from "./components/profileForm";
import type { ProfilePictureUploadResult } from "@/lib/api/schemas/upload";
import LoadingOverlay from "./components/loadingOverlay";

type ProfileFieldErrors = Partial<Record<keyof ProfileFormValues, string>>;

const PROGRESS_CACHE_KEY = "provider_onboarding_progress_cache";
const PROGRESS_CACHE_TTL_MS = 60_000;

type CachedProgressPayload = {
  timestamp: number;
  summary: ProviderOnboardingProgressSummary;
};

const INITIAL_PROFILE_VALUES: ProfileFormValues = {
  fullName: "",
  professionalTitle: "",
  currentCompany: "",
  yearsOfExperience: "",
  location: "",
};

export default function Flow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, setUser } = useAuth();
  const forcedRole = searchParams.get("role")?.toLowerCase();
  const rolePromotionAttempted = useRef(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] =
    useState<ProviderOnboardingProgressSummary | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [profileValues, setProfileValues] = useState<ProfileFormValues>(
    INITIAL_PROFILE_VALUES
  );
  const [profileErrors, setProfileErrors] = useState<ProfileFieldErrors>({});
  const [accountTypes, setAccountTypes] = useState<string[]>([]);
  const [accountTypeError, setAccountTypeError] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [bioError, setBioError] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] =
    useState<ProfilePictureUploadResult | null>(null);
  const [profilePhotoError, setProfilePhotoError] = useState<string | null>(
    null
  );
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submittingStep, setSubmittingStep] = useState(false);
  const [ensuringRole, setEnsuringRole] = useState(false);

  // Step 2 state
  const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);
  const [loadingOverlayStatus, setLoadingOverlayStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [loadingOverlayMessage, setLoadingOverlayMessage] = useState("");
  const [step2Values, setStep2Values] = useState({
    primaryExpertise: "",
    educationLevel: "",
    portfolioOrResume: null as any,
    linkedinProfileUrl: "",
    websiteUrl: "",
  });
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  const determineStepIndex = useCallback(
    (summary: ProviderOnboardingProgressSummary) => {
      if (summary.isCompleted) {
        return 5;
      }
      const stepNumber = summary.currentStep ?? summary.nextStep ?? 1;
      const normalized = Math.max(1, stepNumber);
      return Math.min(4, normalized - 1);
    },
    []
  );

  const loadProgress = useCallback(
    async (options?: { allowCache?: boolean }) => {
      const allowCache = options?.allowCache ?? true;

      if (allowCache && typeof window !== "undefined") {
        try {
          const cachedRaw = window.sessionStorage.getItem(PROGRESS_CACHE_KEY);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as CachedProgressPayload;
            if (
              cached &&
              typeof cached.timestamp === "number" &&
              Date.now() - cached.timestamp < PROGRESS_CACHE_TTL_MS &&
              cached.summary
            ) {
              setProgress(cached.summary);
              setCurrentStepIndex(determineStepIndex(cached.summary));
              setLoadingError(null);
              return cached.summary;
            }
          }
        } catch {
          // Ignore cache parsing issues; fall back to live fetch.
        }
      }

      const fresh = await getProviderOnboardingProgress();
      setProgress(fresh);
      setCurrentStepIndex(determineStepIndex(fresh));
      setLoadingError(null);

      if (typeof window !== "undefined") {
        try {
          const payload: CachedProgressPayload = {
            timestamp: Date.now(),
            summary: fresh,
          };
          window.sessionStorage.setItem(
            PROGRESS_CACHE_KEY,
            JSON.stringify(payload)
          );
        } catch {
          // Ignore storage write errors.
        }
      }

      return fresh;
    },
    [determineStepIndex]
  );

  const ensureProviderRole = useCallback(async () => {
    if (!user) {
      return;
    }

    if (isProviderRole(user.role)) {
      return;
    }

    if (forcedRole !== "serviceprovider") {
      return;
    }

    if (rolePromotionAttempted.current) {
      return;
    }

    const rawId =
      user && typeof (user as any).id !== "undefined"
        ? (user as any).id
        : (user as any)?.userId ?? (user as any)?._id;
    const resolvedId =
      typeof rawId === "string"
        ? rawId
        : typeof rawId === "number"
        ? String(rawId)
        : null;

    if (!resolvedId) {
      throw new Error(
        "Unable to determine user identifier to upgrade provider role."
      );
    }

    rolePromotionAttempted.current = true;
    setEnsuringRole(true);
    try {
      const backendProviderRole =
        mapCanonicalToBackendRole("serviceprovider") ?? "talent";

      const updatedUser = await updateUser(resolvedId, {
        role: backendProviderRole,
        fullName:
          typeof (user as any)?.fullName === "string"
            ? (user as any).fullName
            : undefined,
        email: typeof user.email === "string" ? user.email : undefined,
        phone:
          typeof (user as any)?.phone === "string"
            ? (user as any).phone
            : undefined,
        country:
          typeof (user as any)?.country === "string"
            ? (user as any).country
            : undefined,
      });

      if (updatedUser && typeof updatedUser === "object") {
        const updatedRecord = updatedUser as Record<string, unknown>;
        const canonicalRole = normalizeToCanonicalRole(
          typeof updatedRecord.role === "string"
            ? (updatedRecord.role as string)
            : "serviceprovider"
        );

        const mergedUser: AuthUser = {
          ...(user ?? {}),
          ...(updatedRecord as Partial<AuthUser>),
          role: canonicalRole ?? "serviceprovider",
        } as AuthUser;

        setUser(mergedUser);
      } else {
        setUser({ ...user, role: "serviceprovider" });
      }
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(PROGRESS_CACHE_KEY);
      }
      setGeneralError(null);
    } catch (error) {
      rolePromotionAttempted.current = false;
      if (error instanceof ApiError) {
        setGeneralError(error.message);
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError("Unable to upgrade account to service provider.");
      }
      throw error;
    } finally {
      setEnsuringRole(false);
    }
  }, [user, forcedRole, setUser]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace("/auth/signin?redirect=/auth/onboarding/provider");
      return;
    }

    const allowProviderAccess =
      isProviderRole(user.role) || forcedRole === "serviceprovider";

    if (!allowProviderAccess) {
      router.replace("/auth/onboarding");
      return;
    }

    let active = true;
    setInitializing(true);
    setLoadingError(null);

    (async () => {
      try {
        await ensureProviderRole();
        if (!active) return;
        await loadProgress({ allowCache: true });
      } catch (error) {
        if (!active) return;

        if (error instanceof ApiError && error.status === 403) {
          setGeneralError(
            error.message ||
              "Your account must be upgraded to a service provider before continuing."
          );
          setLoadingError(null);
        } else if (error instanceof Error) {
          setLoadingError(
            error.message ||
              "Unable to load onboarding progress. Please try again."
          );
        } else {
          setLoadingError(
            "Unable to load onboarding progress. Please try again."
          );
        }
      } finally {
        if (active) {
          setInitializing(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [authLoading, user, router, loadProgress, forcedRole, ensureProviderRole]);

  const handleProfileChange = useCallback(
    <K extends keyof ProfileFormValues>(
      field: K,
      value: ProfileFormValues[K]
    ) => {
      setProfileValues((prev) => ({ ...prev, [field]: value }));
      setProfileErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      setGeneralError(null);
    },
    []
  );

  const handleAccountTypesChange = useCallback((types: string[]) => {
    setAccountTypes(types);
    setAccountTypeError(null);
    setGeneralError(null);
  }, []);

  const handleBioChange = useCallback((value: string) => {
    setBio(value);
    setBioError(null);
    setGeneralError(null);
  }, []);

  const handleProfilePhotoChange = useCallback(
    (upload: ProfilePictureUploadResult | null) => {
      setProfilePhoto(upload);
      setProfilePhotoError(null);
      setGeneralError(null);
    },
    []
  );

  const validateStep1 = useCallback(() => {
    const nextErrors: ProfileFieldErrors = {};
    let nextAccountTypeError: string | null = null;
    let nextBioError: string | null = null;

    const fullName = profileValues.fullName.trim();
    if (fullName.length < 2 || fullName.length > 100) {
      nextErrors.fullName = "Full name must be between 2 and 100 characters.";
    }

    const title = profileValues.professionalTitle.trim();
    if (title.length < 2 || title.length > 100) {
      nextErrors.professionalTitle =
        "Professional title must be between 2 and 100 characters.";
    }

    const company = profileValues.currentCompany.trim();
    if (company.length < 2 || company.length > 100) {
      nextErrors.currentCompany =
        "Current company must be between 2 and 100 characters.";
    }

    const yearsRaw = profileValues.yearsOfExperience.trim();
    const yearsValue = Number(yearsRaw);
    if (
      yearsRaw === "" ||
      Number.isNaN(yearsValue) ||
      !Number.isInteger(yearsValue) ||
      yearsValue < 0 ||
      yearsValue > 50
    ) {
      nextErrors.yearsOfExperience =
        "Years of experience must be a whole number between 0 and 50.";
    }

    const location = profileValues.location.trim();
    if (location.length < 2) {
      nextErrors.location = "Location is required.";
    }

    if (accountTypes.length === 0) {
      nextAccountTypeError = "Select at least one account type.";
    } else if (accountTypes.includes("altruist") && accountTypes.length > 1) {
      nextAccountTypeError =
        "Altruist cannot be combined with other account types.";
    }

    const trimmedBio = bio.trim();
    if (trimmedBio.length < 50 || trimmedBio.length > 500) {
      nextBioError = "Bio must be between 50 and 500 characters.";
    }

    setProfileErrors(nextErrors);
    setAccountTypeError(nextAccountTypeError);
    setBioError(nextBioError);
    setProfilePhotoError(null);

    const hasFieldErrors = Object.keys(nextErrors).length > 0;
    return !hasFieldErrors && !nextAccountTypeError && !nextBioError;
  }, [profileValues, accountTypes, bio]);

  const parseServerErrors = useCallback((details: unknown) => {
    const parsed = ProviderOnboardingStepErrorSchema.safeParse(details);
    if (!parsed.success || !parsed.data.errors) {
      return false;
    }

    const fieldErrors = parsed.data.errors;
    const nextProfileErrors: ProfileFieldErrors = {};

    if (fieldErrors.fullName) {
      nextProfileErrors.fullName = fieldErrors.fullName;
    }
    if (fieldErrors.professionalTitle) {
      nextProfileErrors.professionalTitle = fieldErrors.professionalTitle;
    }
    if (fieldErrors.currentCompany) {
      nextProfileErrors.currentCompany = fieldErrors.currentCompany;
    }
    if (fieldErrors.yearsOfExperience) {
      nextProfileErrors.yearsOfExperience = fieldErrors.yearsOfExperience;
    }
    if (fieldErrors.location) {
      nextProfileErrors.location = fieldErrors.location;
    }

    if (Object.keys(nextProfileErrors).length > 0) {
      setProfileErrors((prev) => ({ ...prev, ...nextProfileErrors }));
    }

    if (fieldErrors.accountTypes) {
      setAccountTypeError(fieldErrors.accountTypes);
    }

    if (fieldErrors.bio) {
      setBioError(fieldErrors.bio);
    }

    if (fieldErrors.profilePhoto) {
      setProfilePhotoError(fieldErrors.profilePhoto);
    }

    const remainingMessages = Object.entries(fieldErrors)
      .filter(
        ([key]) =>
          ![
            "fullName",
            "professionalTitle",
            "currentCompany",
            "yearsOfExperience",
            "location",
            "accountTypes",
            "bio",
            "profilePhoto",
          ].includes(key)
      )
      .map(([, value]) => value);

    if (parsed.data.message) {
      setGeneralError(parsed.data.message);
    } else if (remainingMessages.length > 0) {
      setGeneralError(remainingMessages.join(" "));
    } else {
      setGeneralError(
        "Unable to save profile. Please review the highlighted fields."
      );
    }

    return true;
  }, []);

  const handleSubmitStep1 = useCallback(async () => {
    setGeneralError(null);

    if (!validateStep1()) {
      return;
    }

    const normalizedProfilePhoto = profilePhoto
      ? {
          ...profilePhoto,
          fileName:
            profilePhoto.fileName ??
            profilePhoto.cloudinaryPublicId ??
            profilePhoto.publicId,
          fileUrl: profilePhoto.fileUrl ?? profilePhoto.imageUrl,
          fileType:
            profilePhoto.fileType ??
            (profilePhoto.format
              ? `image/${profilePhoto.format}`
              : undefined) ??
            "image/jpeg",
          fileSize:
            typeof profilePhoto.fileSize === "number"
              ? profilePhoto.fileSize
              : profilePhoto.bytes,
          cloudinaryPublicId:
            profilePhoto.cloudinaryPublicId ?? profilePhoto.publicId,
          uploadedAt: profilePhoto.uploadedAt ?? new Date().toISOString(),
        }
      : undefined;

    const payload = {
      fullName: profileValues.fullName.trim(),
      professionalTitle: profileValues.professionalTitle.trim(),
      currentCompany: profileValues.currentCompany.trim(),
      yearsOfExperience: Number(profileValues.yearsOfExperience.trim()),
      location: profileValues.location.trim(),
      accountTypes,
      bio: bio.trim(),
      profilePhoto: normalizedProfilePhoto,
    };

    setSubmittingStep(true);

    const isUpdate = progress?.completedSteps?.includes(1) ?? false;

    try {
      await submitProviderOnboardingStep1(payload, { isUpdate });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400 && parseServerErrors(error.details)) {
          setSubmittingStep(false);
          return;
        }
        setGeneralError(error.message);
      } else {
        setGeneralError("Unable to save profile. Please try again.");
      }
      setSubmittingStep(false);
      return;
    }

    try {
      await loadProgress();
    } catch {
      setGeneralError(
        "Profile saved, but progress could not be refreshed. Please reload the page."
      );
    } finally {
      setSubmittingStep(false);
    }
  }, [
    validateStep1,
    profileValues,
    accountTypes,
    bio,
    profilePhoto,
    progress,
    parseServerErrors,
    loadProgress,
  ]);

  const handleNavigateBack = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNavigateForward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(5, prev + 1));
  }, []);

  const handleSubmitStep2 = useCallback(
    async (formData: any) => {
      setGeneralError(null);
      setStep2Errors({});

      const resumeData = formData.portfolioOrResume;

      if (!resumeData) {
        setStep2Errors({
          portfolioOrResume: "Portfolio or resume file is required.",
        });
        return;
      }

      if (!resumeData.fileUrl) {
        setStep2Errors({
          portfolioOrResume:
            "Uploaded resume is missing a file URL. Please re-upload and try again.",
        });
        return;
      }

      const normalizedResume = {
        fileName: resumeData.fileName,
        fileUrl: resumeData.fileUrl,
        fileType: resumeData.fileType,
        fileSize: resumeData.fileSize,
        uploadedAt: resumeData.uploadedAt ?? new Date().toISOString(),
        cloudinaryPublicId: resumeData.cloudinaryPublicId,
      };

      const payload = {
        primaryExpertise: formData.primaryExpertise,
        educationLevel: formData.educationLevel,
        portfolioOrResume: normalizedResume,
        linkedinProfileUrl: formData.linkedinProfileUrl,
        websiteUrl: formData.websiteUrl,
      };

      setLoadingOverlayOpen(true);
      setLoadingOverlayStatus("loading");
      setLoadingOverlayMessage("Saving your profile...");

      const isUpdate = progress?.completedSteps?.includes(2) ?? false;

      try {
        await submitProviderOnboardingStep2(payload, { isUpdate });
        setLoadingOverlayStatus("success");
        setLoadingOverlayMessage("Profile saved successfully!");

        setTimeout(async () => {
          try {
            await loadProgress();
            setLoadingOverlayOpen(false);
            handleNavigateForward();
          } catch {
            setLoadingOverlayStatus("error");
            setLoadingOverlayMessage(
              "Profile saved, but progress could not be refreshed."
            );
          }
        }, 1000);
      } catch (error) {
        setLoadingOverlayStatus("error");

        if (error instanceof ApiError) {
          if (error.status === 400 && error.details) {
            const errorData = error.details as Record<string, any>;
            if (errorData.errors) {
              setStep2Errors(errorData.errors);
              setLoadingOverlayMessage(
                errorData.message || "Please review the highlighted fields."
              );
            } else {
              setLoadingOverlayMessage(
                errorData.message || "Unable to save profile."
              );
            }
          } else {
            setLoadingOverlayMessage(
              error.message || "Unable to save profile."
            );
          }
        } else {
          setLoadingOverlayMessage("Unable to save profile. Please try again.");
        }

        setTimeout(() => {
          setLoadingOverlayOpen(false);
        }, 2000);
      }
    },
    [progress, loadProgress, handleNavigateForward]
  );

  const handleReset = useCallback(() => {
    setCurrentStepIndex(0);
  }, []);

  const stepContent = useMemo(() => {
    if (initializing) {
      return (
        <div className="flex min-h-[200px] items-center justify-center text-gray-600">
          Loading onboarding...
        </div>
      );
    }

    if (loadingError) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="mb-4 text-sm">{loadingError}</p>
          <button
            type="button"
            onClick={() => {
              setInitializing(true);
              loadProgress()
                .catch(() => {
                  setLoadingError(
                    "Unable to load onboarding progress. Please try again."
                  );
                })
                .finally(() => {
                  setInitializing(false);
                });
            }}
            className="rounded-md bg-[#13672B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
          >
            Retry
          </button>
        </div>
      );
    }

    if (currentStepIndex === 0) {
      return (
        <CreateProfileStep
          values={profileValues}
          errors={profileErrors}
          onChange={handleProfileChange}
          accountTypes={accountTypes}
          accountTypeError={accountTypeError}
          onAccountTypesChange={handleAccountTypesChange}
          bio={bio}
          bioError={bioError}
          onBioChange={handleBioChange}
          onProfilePhotoChange={handleProfilePhotoChange}
          profilePhoto={profilePhoto}
          profilePhotoError={profilePhotoError}
          onSubmit={handleSubmitStep1}
          submitting={submittingStep}
          generalError={generalError}
        />
      );
    }

    if (currentStepIndex === 1) {
      return (
        <ExpertPortfolio
          onSubmit={handleSubmitStep2}
          onNext={handleNavigateForward}
          onPrevious={handleNavigateBack}
          errors={step2Errors}
        />
      );
    }

    if (currentStepIndex === 2) {
      return (
        <VideoIntroStep
          onNext={handleNavigateForward}
          onPrevious={handleNavigateBack}
        />
      );
    }

    if (currentStepIndex === 3) {
      return (
        <PricingStep
          onNext={handleNavigateForward}
          onPrevious={handleNavigateBack}
        />
      );
    }

    if (currentStepIndex === 4) {
      return (
        <AvailabilityStep
          onNext={handleNavigateForward}
          onPrevious={handleNavigateBack}
        />
      );
    }

    return <CompletedStep onReset={handleReset} />;
  }, [
    initializing,
    loadingError,
    currentStepIndex,
    profileValues,
    profileErrors,
    handleProfileChange,
    accountTypes,
    accountTypeError,
    handleAccountTypesChange,
    bio,
    bioError,
    handleBioChange,
    profilePhoto,
    profilePhotoError,
    handleProfilePhotoChange,
    handleSubmitStep1,
    submittingStep,
    generalError,
    handleNavigateForward,
    handleNavigateBack,
    handleReset,
    loadProgress,
    handleSubmitStep2,
  ]);

  return (
    <div>
      {stepContent}
      <LoadingOverlay
        open={loadingOverlayOpen}
        status={loadingOverlayStatus}
        title={
          loadingOverlayStatus === "success"
            ? "Success"
            : loadingOverlayStatus === "error"
            ? "Error"
            : "Saving"
        }
        description={loadingOverlayMessage}
      />
    </div>
  );
}
