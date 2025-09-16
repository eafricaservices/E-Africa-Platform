"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { CheckCircle, AlertCircle } from "lucide-react";
import SideImage from "@/app/shared/SideImage";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const AuthSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    
    if (!urlToken) {
      setError("No authentication token found. Please try signing in again.");
      return;
    }

    // Basic JWT format validation (3 parts separated by dots)
    const tokenParts = urlToken.split(".");
    if (tokenParts.length !== 3) {
      setError("Invalid authentication token format. Please try signing in again.");
      return;
    }

    try {
      // Store token in localStorage
      localStorage.setItem("auth_token", urlToken);
      setToken(urlToken);
    } catch (err) {
      setError("Failed to save authentication. Please try again.");
    }
  }, [searchParams]);

  const handleContinueToDashboard = () => {
    setLoading(true);
    router.push("/dashboard");
  };

  const handleBackToSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <div className={`w-full flex p-10 gap-20 max-w-7xl mx-auto ${inter.className}`}>
      {/* Side Image */}
      <div className="hidden md:block md:w-1/2">
        <SideImage />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/5 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Success State */}
          {token && !error && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              
              <h1 className="text-2xl font-semibold text-black mb-4">
                Authentication Successful!
              </h1>
              
              <p className="text-gray-600 mb-8">
                You have been successfully signed in. Click below to continue to your dashboard.
              </p>

              <button
                onClick={handleContinueToDashboard}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#13672B] text-white hover:bg-[#097d2a] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Redirecting..." : "Continue to Dashboard"}
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              
              <h1 className="text-2xl font-semibold text-black mb-4">
                Authentication Error
              </h1>
              
              <p className="text-red-600 mb-8">
                {error}
              </p>

              <button
                onClick={handleBackToSignIn}
                className="w-full py-3 rounded-lg bg-[#13672B] text-white hover:bg-[#097d2a] font-semibold transition"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Loading State */}
          {!token && !error && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#13672B]"></div>
              </div>
              
              <h1 className="text-2xl font-semibold text-black mb-4">
                Processing Authentication...
              </h1>
              
              <p className="text-gray-600">
                Please wait while we complete your sign in.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;