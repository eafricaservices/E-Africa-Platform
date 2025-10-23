"use client";

import { z } from "zod";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  status?: number;
  details?: unknown;
  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function pickMessage(d: any): string {
  if (!d) return "";
  if (typeof d === "string") return d;
  if (typeof d.message === "string") return d.message;
  if (typeof d.error === "string") return d.error;
  if (Array.isArray(d)) return d.map(pickMessage).filter(Boolean).join(" ");
  if (typeof d === "object") {
    for (const v of Object.values(d)) {
      const m = pickMessage(v);
      if (m) return m;
    }
  }
  return "";
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function jsonFetch<T = void>(
  path: string,
  opts?: {
    method?: HttpMethod;
    body?: unknown;
    responseSchema?: z.ZodSchema<T>;
  }
): Promise<T> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  const fullUrl = `${API_BASE}${path}`;

  const res = await fetch(fullUrl, {
    method: opts?.method ?? "GET",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    credentials: "include",
    body: opts?.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    let serverMsg = "";
    let details: unknown;
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        details = data;
        serverMsg = pickMessage(data) || JSON.stringify(data);
      } else {
        serverMsg = await res.text();
      }
    } catch {}

    const msg =
      serverMsg ||
      (res.status === 400 || res.status === 422
        ? "Invalid request."
        : res.status === 401
        ? "You need to sign in again to continue."
        : res.status === 403
        ? "You do not have permission to perform this action."
        : res.status === 404
        ? "Resource not found."
        : res.status === 429
        ? "Too many requests. Please try again later."
        : res.status >= 500
        ? "Server error. Please try again later."
        : "Request failed.");

    throw new ApiError(msg, res.status, details);
  }

  if (!opts?.responseSchema) {
    // No response body expected
    return undefined as unknown as T;
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    // Unexpected content-type
    throw new ApiError("Unexpected server response.", res.status);
  }
  const data = await res.json();
  return opts.responseSchema.parse(data);
}
