"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { CheckCircle, AlertCircle } from "lucide-react";
import SideImage from "@/app/shared/SideImage";
import Image from "next/image";
import { useAuth } from "@/app/modules/auth/AuthContext";
import {
  getPostLoginDestination,
  resolveRedirectPath,
} from "@/app/modules/auth/utils";

const inter = Inter({ subsets: ["latin"] });

type PageState = "loading" | "redirecting" | "error";

const AuthSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading, refresh } = useAuth();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [message, setMessage] = useState<string>("Finishing sign-in…");
  const [error, setError] = useState<string | null>(null);
  const refreshCompleted = useRef(false);

  const authMethod = (searchParams.get("authMethod") ?? "cookie").toLowerCase();
  const redirectParam = searchParams.get("redirect");

  useEffect(() => {
    if (authMethod !== "cookie") {
      setError("We couldn't verify your login. Please try signing in again.");
      setPageState("error");
      return;
    }

    setMessage("Finishing sign-in…");
    setPageState("loading");

    refresh()
      .then((fetchedUser) => {
        refreshCompleted.current = true;
        if (!fetchedUser) {
          setError(
            "🍪 Cookie Authentication Failed\n\n" +
              "The backend cookie is not being sent with API requests. This happens when the cookie has incorrect SameSite settings.\n\n" +
              "Backend team: Please verify the cookie has:\n" +
              "• sameSite: 'none' (not 'lax')\n" +
              "• secure: true (always)\n\n" +
              "See COOKIE_DEBUG.md in the frontend repo for details."
          );
          setPageState("error");
        }
      })
      .catch((err) => {
        refreshCompleted.current = true;
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't verify your login. Please try signing in again."
        );
        setPageState("error");
      });
  }, [authMethod, refresh]);

  useEffect(() => {
    if (authMethod !== "cookie") return;
    if (!refreshCompleted.current) return;
    if (authLoading) return;
    if (!user) return;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const safeRedirect = origin && resolveRedirectPath(redirectParam, origin);
    const destination = safeRedirect ?? getPostLoginDestination(user);

    setMessage("Redirecting you to your dashboard…");
    setPageState("redirecting");
    router.replace(destination);
  }, [authMethod, authLoading, user, redirectParam, router]);

  const handleBackToSignIn = () => {
    router.replace("/auth/signin");
  };

  return (
    <div
      className={`w-full flex p-10 gap-20 max-w-7xl mx-auto ${inter.className}`}
    >
      <div className="hidden md:block md:w-1/2">
        <SideImage />
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {pageState === "error" ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>

              <h1 className="text-2xl font-semibold text-black mb-4">
                Authentication Error
              </h1>

              <p className="text-red-600 mb-8">
                {error ??
                  "We couldn't verify your login. Please try signing in again."}
              </p>

              <button
                onClick={handleBackToSignIn}
                className="w-full py-3 rounded-lg bg-[#13672B] text-white hover:bg-[#097d2a] font-semibold transition"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {pageState === "redirecting" ? (
                  <CheckCircle className="w-16 h-16 text-green-500" />
                ) : (
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#13672B]" />
                )}
              </div>

              <h1 className="text-2xl font-semibold text-black mb-4">
                Authentication Successful!
              </h1>

              <p className="text-gray-600 mb-8">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
