"use client";

import { jsonFetch } from "@/lib/api/client";
import { AuthUserResponseSchema, AuthUserSchema } from "@/lib/api/schemas/auth";
import { normalizeToCanonicalRole } from "@/lib/auth/roleMappings";
import type { AuthUser } from "@/lib/api/schemas/auth";

export const GOOGLE_AUTH_ROLES = ["serviceprovider", "serviceseeker"] as const;

export type GoogleAuthRole = (typeof GOOGLE_AUTH_ROLES)[number];

export const DEFAULT_GOOGLE_AUTH_ROLE: GoogleAuthRole = "serviceseeker";

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await jsonFetch("/api/auth/me", {
      responseSchema: AuthUserResponseSchema,
    });

    const payload =
      response && typeof response === "object" && "data" in response
        ? (response as { data?: unknown }).data
        : response;

    if (!payload) {
      return null;
    }

    const user = AuthUserSchema.parse(payload);

    const canonicalRole = normalizeToCanonicalRole(user.role);

    return {
      ...user,
      id: typeof user.id === "number" ? String(user.id) : user.id ?? undefined,
      role: canonicalRole ?? user.role,
    } as AuthUser;
  } catch (error) {
    // If it's a 401, user is not authenticated - this is expected, not an error
    if (
      error instanceof Error &&
      "status" in error &&
      (error as any).status === 401
    ) {
      return null;
    }
    throw error;
  }
}

export function loginWithGoogle(
  role: GoogleAuthRole = DEFAULT_GOOGLE_AUTH_ROLE
) {
  if (typeof window === "undefined") {
    throw new Error("loginWithGoogle must be called on the client.");
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBase) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL. Unable to determine Google auth URL."
    );
  }

  if (!GOOGLE_AUTH_ROLES.includes(role)) {
    throw new Error(`Unsupported Google auth role: ${role}`);
  }

  // Check if we're in cross-origin scenario (localhost vs production domain)
  const isCrossOrigin = !apiBase.includes(window.location.hostname);

  const url = new URL("/api/auth/google", apiBase);
  url.searchParams.set("role", role);

  // If cross-origin, tell backend to redirect to its own domain for cookie setting
  if (isCrossOrigin) {
    // The backend should redirect to frontend success page after setting cookies
    url.searchParams.set(
      "redirectUrl",
      `${window.location.origin}/auth/success`
    );
  }

  window.location.href = url.toString();
}

export type { AuthUser };
