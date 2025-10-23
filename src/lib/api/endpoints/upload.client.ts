"use client";

import { API_BASE, ApiError } from "@/lib/api/client";
import {
  DeleteImageResponseSchema,
  ProfilePictureUploadErrorResponseSchema,
  ProfilePictureUploadResponseSchema,
  type ProfilePictureUploadResult,
  type ResumeUploadResult,
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

export async function uploadResumeDocument(
  file: File,
  options?: { abortSignal?: AbortSignal }
): Promise<ResumeUploadResult> {
  const formData = new FormData();
  formData.append("resume", file);

  const json = await uploadMultipart("/api/upload/resume", formData, options);
  const payload = (json?.data ?? json ?? {}) as Record<string, unknown>;

  const resumeUrlRaw =
    (typeof payload.resumeUrl === "string" && payload.resumeUrl) ||
    (typeof payload.fileUrl === "string" && payload.fileUrl) ||
    (typeof payload.url === "string" && payload.url) ||
    null;

  const publicIdRaw =
    (typeof payload.publicId === "string" && payload.publicId) ||
    (typeof payload.cloudinaryPublicId === "string" &&
      payload.cloudinaryPublicId) ||
    null;

  if (!resumeUrlRaw) {
    throw new ApiError(
      "Upload succeeded but no resume URL was returned.",
      500,
      payload
    );
  }

  if (!publicIdRaw) {
    throw new ApiError(
      "Upload succeeded but no resume identifier was returned.",
      500,
      payload
    );
  }

  const normalized: ResumeUploadResult = {
    fileUrl: resumeUrlRaw,
    cloudinaryPublicId: publicIdRaw,
    fileName:
      typeof payload.fileName === "string" && payload.fileName.trim().length > 0
        ? payload.fileName
        : file.name,
    fileType:
      typeof payload.fileType === "string" && payload.fileType
        ? payload.fileType
        : file.type || undefined,
    fileSize:
      typeof payload.fileSize === "number"
        ? payload.fileSize
        : typeof payload.bytes === "number"
        ? payload.bytes
        : file.size,
    uploadedAt:
      typeof payload.uploadedAt === "string" && payload.uploadedAt
        ? payload.uploadedAt
        : new Date().toISOString(),
  };

  return normalized;
}

export async function deleteUploadedDocument(publicId: string): Promise<void> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const response = await fetch(`${API_BASE}/api/upload/document/${publicId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Unable to delete document.";
    try {
      const errorBody = await response.json();
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Ignore
    }
    throw new ApiError(message, response.status);
  }
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
