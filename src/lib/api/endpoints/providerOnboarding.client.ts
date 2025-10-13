"use client";

import { jsonFetch } from "@/lib/api/client";
import {
  ProviderOnboardingProgressResponseSchema,
  type ProviderOnboardingProgress,
} from "@/lib/api/schemas/providerOnboarding";
import type { ProfilePictureUploadResult } from "@/lib/api/schemas/upload";
import { z } from "zod";

export type ProviderOnboardingProgressSummary = ProviderOnboardingProgress & {
  nextStep?: number | null;
  completionPercentage?: number;
};

export type ProviderOnboardingStep1Payload = {
  fullName: string;
  professionalTitle: string;
  currentCompany: string;
  yearsOfExperience: number;
  location: string;
  accountTypes: string[];
  bio: string;
  profilePhoto?: ProfilePictureUploadResult | null;
};

export async function getProviderOnboardingProgress(): Promise<ProviderOnboardingProgressSummary> {
  const response = await jsonFetch("/api/providers/onboarding/progress", {
    responseSchema: ProviderOnboardingProgressResponseSchema,
  });

  const progress = response.data?.progress;
  if (!progress) {
    throw new Error("Unable to determine onboarding progress");
  }

  const isCompletedFlag =
    typeof response.data?.isComplete === "boolean"
      ? response.data.isComplete
      : progress.isCompleted;

  return {
    currentStep: progress.currentStep,
    completedSteps: progress.completedSteps,
    stepProgress: progress.stepProgress,
    isCompleted: isCompletedFlag,
    nextStep:
      typeof response.data?.nextStep === "number"
        ? response.data.nextStep
        : null,
    completionPercentage: response.data?.completionPercentage,
  };
}

export async function submitProviderOnboardingStep1(
  payload: ProviderOnboardingStep1Payload,
  options?: { isUpdate?: boolean }
): Promise<unknown> {
  const method = options?.isUpdate ? "PUT" : "POST";

  return jsonFetch(`/api/providers/onboarding/step1`, {
    method,
    body: payload,
    responseSchema: z.any(),
  });
}
