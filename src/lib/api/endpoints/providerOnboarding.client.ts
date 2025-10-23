"use client";

import { jsonFetch } from "@/lib/api/client";
import {
  ProviderOnboardingProgressResponseSchema,
  type ProviderOnboardingProgress,
  type ProviderOnboardingStep2Payload,
} from "@/lib/api/schemas/providerOnboarding";
import type { ProfilePictureUploadResult } from "@/lib/api/schemas/upload";
import { z } from "zod";

export type ProviderOnboardingProgressSummary = {
  currentStep: number;
  completedSteps: number[];
  stepProgress?: Record<string, boolean>;
  isCompleted?: boolean;
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

  const payload = response.data ?? {};
  const progressPayload = payload.progress ?? {};

  // Parse currentStep (backend returns as string)
  let currentStep = 1;
  if (typeof progressPayload.currentStep === "string") {
    const parsed = Number(progressPayload.currentStep);
    if (!Number.isNaN(parsed) && parsed >= 1) {
      currentStep = parsed;
    }
  } else if (typeof progressPayload.currentStep === "number") {
    if (progressPayload.currentStep >= 1) {
      currentStep = progressPayload.currentStep;
    }
  } else if (typeof payload.currentStep === "string") {
    const parsed = Number(payload.currentStep);
    if (!Number.isNaN(parsed) && parsed >= 1) {
      currentStep = parsed;
    }
  } else if (typeof payload.currentStep === "number") {
    if (payload.currentStep >= 1) {
      currentStep = payload.currentStep;
    }
  }

  // Parse completedSteps (backend returns as string array)
  let completedSteps: number[] = [];
  if (Array.isArray(progressPayload.completedSteps)) {
    completedSteps = progressPayload.completedSteps
      .map((step) => {
        if (typeof step === "string") {
          const parsed = Number(step);
          return Number.isNaN(parsed) ? null : parsed;
        }
        if (typeof step === "number") {
          return step;
        }
        return null;
      })
      .filter((step): step is number => step !== null);
  }

  const stepProgress =
    progressPayload.stepProgress &&
    typeof progressPayload.stepProgress === "object"
      ? (progressPayload.stepProgress as Record<string, boolean>)
      : undefined;

  const isCompletedFlag =
    typeof progressPayload.isCompleted === "boolean"
      ? progressPayload.isCompleted
      : typeof payload.isComplete === "boolean"
      ? payload.isComplete
      : false;

  const hasMinimalData =
    typeof currentStep === "number" &&
    Number.isFinite(currentStep) &&
    currentStep >= 1;

  if (!hasMinimalData) {
    throw new Error("Unable to determine onboarding progress");
  }

  return {
    currentStep,
    completedSteps,
    stepProgress,
    isCompleted: isCompletedFlag,
    nextStep: typeof payload.nextStep === "number" ? payload.nextStep : null,
    completionPercentage: payload.completionPercentage,
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

export async function submitProviderOnboardingStep2(
  payload: ProviderOnboardingStep2Payload,
  options?: { isUpdate?: boolean }
): Promise<unknown> {
  const method = options?.isUpdate ? "PUT" : "POST";

  return jsonFetch(`/api/providers/onboarding/step2`, {
    method,
    body: payload,
    responseSchema: z.any(),
  });
}
