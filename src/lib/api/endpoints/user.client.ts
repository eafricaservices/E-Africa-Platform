"use client";

import { jsonFetch } from "@/lib/api/client";
import type { AuthUser } from "@/lib/api/schemas/auth";
import {
  mapCanonicalToBackendRole,
  normalizeToCanonicalRole,
} from "@/lib/auth/roleMappings";
import { z } from "zod";

type UpdateUserPayload = Partial<{
  fullName: string;
  email: string;
  phone: string;
  country: string;
  role: string;
  userType: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}>;

const UpdateUserResponseSchema = z.any();

export async function updateUser(
  id: string,
  payload: UpdateUserPayload
): Promise<AuthUser | Record<string, unknown>> {
  const payloadForServer: UpdateUserPayload = { ...payload };

  if (payloadForServer.role) {
    const backendRole = mapCanonicalToBackendRole(payloadForServer.role);
    if (backendRole) {
      payloadForServer.role = backendRole;
      payloadForServer.userType = backendRole;
    }
  }

  const response = await jsonFetch(`/api/users/${id}`, {
    method: "PUT",
    body: payloadForServer,
    responseSchema: UpdateUserResponseSchema,
  });

  if (response && typeof response === "object") {
    const normalized = { ...(response as Record<string, unknown>) };
    const rawRole =
      typeof normalized.role === "string"
        ? (normalized.role as string)
        : undefined;
    const canonicalRole = normalizeToCanonicalRole(rawRole ?? null);
    if (rawRole) {
      normalized.backendRole = rawRole;
    }
    if (canonicalRole) {
      normalized.role = canonicalRole;
    }
    return normalized as AuthUser;
  }

  return {};
}
