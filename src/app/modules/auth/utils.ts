import type { AuthUser } from "@/lib/api/schemas/auth";
import {
  isCanonicalProviderRole,
  normalizeToCanonicalRole,
} from "@/lib/auth/roleMappings";

const ONBOARDING_BOOLEAN_KEYS = [
  "onboardingCompleted",
  "isOnboardingComplete",
  "onboarding_complete",
  "is_onboarding_complete",
  "onboardingDone",
];

const ONBOARDING_STATUS_KEYS = [
  "onboardingStatus",
  "onboarding_status",
  "status",
];

const ONBOARDING_TIMESTAMP_KEYS = [
  "onboardingCompletedAt",
  "onboarding_completed_at",
  "onboardingCompleteAt",
];

export function isProviderRole(role?: string | null): boolean {
  return isCanonicalProviderRole(role);
}

export function hasCompletedOnboarding(user: AuthUser): boolean {
  const candidate = user as Record<string, unknown>;

  for (const key of ONBOARDING_BOOLEAN_KEYS) {
    const value = candidate[key];
    if (typeof value === "boolean") {
      return value;
    }
  }

  for (const key of ONBOARDING_STATUS_KEYS) {
    const value = candidate[key];
    if (typeof value === "string") {
      const normalized = value.toLowerCase();
      if (
        normalized.includes("complete") ||
        normalized === "done" ||
        normalized === "finished"
      ) {
        return true;
      }
    }
  }

  for (const key of ONBOARDING_TIMESTAMP_KEYS) {
    const value = candidate[key];
    if (typeof value === "string" && value.trim() !== "") {
      return true;
    }
  }

  return false;
}

export function getPostLoginDestination(user: AuthUser): string {
  if (!hasCompletedOnboarding(user)) {
    const backendRoleRaw =
      typeof (user as Record<string, unknown>).backendRole === "string"
        ? ((user as Record<string, unknown>).backendRole as string)
        : undefined;

    const normalizedBackendRole = backendRoleRaw?.toLowerCase();
    if (
      normalizedBackendRole === "talent" ||
      normalizedBackendRole === "trainee"
    ) {
      return "/auth/onboarding";
    }

    const role = normalizeToCanonicalRole(user.role ?? backendRoleRaw);
    if (!role) {
      return "/auth/onboarding";
    }
    if (role === "serviceprovider") {
      return "/auth/onboarding/provider";
    }
    if (role === "serviceseeker") {
      return "/auth/onboarding/seeker";
    }
    return "/auth/onboarding";
  }
  return "/dashboard";
}

export function resolveRedirectPath(
  raw: string | null,
  origin: string
): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const candidate = new URL(trimmed, origin);
    if (candidate.origin !== origin) {
      return null;
    }
    return `${candidate.pathname}${candidate.search}${candidate.hash}`;
  } catch {
    if (trimmed.startsWith("/")) {
      return trimmed;
    }
    return null;
  }
}
