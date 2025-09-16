"use client";

export function loginWithGoogle(target?: string) {
  const href =
    target || process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/google";
  console.log(href);
  if (typeof window === "undefined") {
    throw new Error("loginWithGoogle must be called on the client.");
  }
  window.location.href = href;
}
