"use client";

import { API_BASE, ApiError } from "@/lib/api/client";
import {
  DeleteImageResponseSchema,
  ProfilePictureUploadErrorResponseSchema,
  ProfilePictureUploadResponseSchema,
  type ProfilePictureUploadResult,
} from "@/lib/api/schemas/upload";

async function uploadMultipart(
  path: string,
  formData: FormData,
  options?: { abortSignal?: AbortSignal }
) {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
    credentials: "include",
    signal: options?.abortSignal,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let details: unknown;
    let message = "Upload failed.";

    if (isJson) {
      try {
        const errorBody = await response.json();
        details = errorBody;
        const parsed =
          ProfilePictureUploadErrorResponseSchema.safeParse(errorBody);
        if (parsed.success) {
          message =
            parsed.data.error?.message ?? parsed.data.message ?? message;
        }
      } catch {
        // Ignore JSON parse errors; fall back to default message.
      }
    } else {
      try {
        message = await response.text();
      } catch {
        // Ignore body read errors; use default message.
      }
    }

    throw new ApiError(message, response.status, details);
  }

  if (!isJson) {
    throw new ApiError("Unexpected upload response.", response.status);
  }

  return response.json();
}

export async function uploadProfilePicture(
  file: File,
  options?: { abortSignal?: AbortSignal }
): Promise<ProfilePictureUploadResult> {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const json = await uploadMultipart(
    "/api/upload/profile-picture",
    formData,
    options
  );
  const parsed = ProfilePictureUploadResponseSchema.parse(json);
  return parsed.data;
}

export async function deleteUploadedImage(publicId: string): Promise<void> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const response = await fetch(`${API_BASE}/api/upload/image/${publicId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let message = "Unable to delete image.";
    let details: unknown;

    if (isJson) {
      try {
        const errorBody = await response.json();
        details = errorBody;
        const parsed =
          ProfilePictureUploadErrorResponseSchema.safeParse(errorBody);
        if (parsed.success) {
          message =
            parsed.data.error?.message ?? parsed.data.message ?? message;
        }
      } catch {
        // Ignore
      }
    }

    throw new ApiError(message, response.status, details);
  }

  if (!isJson) {
    return;
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return;
  }

  const parsed = DeleteImageResponseSchema.safeParse(json);
  if (!parsed.success) {
    return;
  }

  if (!parsed.data.success) {
    throw new ApiError(
      parsed.data.message ?? "Unable to delete image.",
      response.status,
      json
    );
  }
}
