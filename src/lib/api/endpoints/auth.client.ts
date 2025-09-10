"use client";

export function loginWithGoogle(target?: string) {
  const href = target || "/api/auth/google";
  if (typeof window === "undefined") {
    throw new Error("loginWithGoogle must be called on the client.");
  }
  window.location.href = href;
}
