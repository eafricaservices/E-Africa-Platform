"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/api/endpoints/auth";
import {
  DEFAULT_GOOGLE_AUTH_ROLE,
  loginWithGoogle,
} from "@/lib/api/endpoints/auth.client";
import { useAuth } from "@/app/modules/auth/AuthContext";
import {
  getPostLoginDestination,
  resolveRedirectPath,
} from "@/app/modules/auth/utils";
import { ApiError } from "@/lib/api/client";
interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

type HandleSubmitEvent = React.FormEvent<HTMLFormElement>;

const Login: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: HandleSubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email: form.email, password: form.password });

      const authenticatedUser = await refresh();

      if (!authenticatedUser) {
        throw new Error("We couldn't verify your account. Please try again.");
      }

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectParam = searchParams?.get("redirect") ?? null;
      const safeRedirect = origin && resolveRedirectPath(redirectParam, origin);
      const destination =
        safeRedirect ?? getPostLoginDestination(authenticatedUser);

      router.replace(destination);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Invalid login credentials. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl justify-center items-center">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
      </div>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="font-semibold text-xl">Login to your account</h1>
        <p className="text-xs text-[#212121]">
          Welcome back! Enter your details to login.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-2"
        autoComplete="on"
      >
        {/* Email */}
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          autoComplete="email"
          required
          className="w-full border border-[#212121] rounded-md p-2 mb-3 focus:border-none focus:outline-none focus:ring-1 focus:ring-[#26CD56] placeholder:text-xs placeholder:text-[#757575] text-sm"
        />

        {/* Password */}
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="w-full border border-[#212121] rounded-md p-2 pr-10 focus:border-none focus:outline-none focus:ring-1 focus:ring-[#26CD56] placeholder:text-xs placeholder:text-[#757575] text-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showPassword ? (
              <EyeOff size={18} className="cursor-pointer" />
            ) : (
              <Eye size={18} className="cursor-pointer" />
            )}
          </button>
        </div>

        {/* Remember Me + Forgot Password */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="accent-[#13672B] cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm">
              Remember Me
            </label>
          </div>
          <Link href="/auth/forgot-password">
            <p className="text-[#13672B] underline text-xs cursor-pointer">
              Forgot Password?
            </p>
          </Link>
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-red-600 text-sm mb-2"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-2 rounded-md transition duration-200 bg-[#13672B] text-white hover:bg-[#097d2a] cursor-pointer text-sm disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6 w-full">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-3 text-gray-500 text-sm">or continue with</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      {/* Google Auth */}
      <button
        type="button"
        onClick={() => loginWithGoogle(DEFAULT_GOOGLE_AUTH_ROLE)}
        className="w-full flex justify-center bg-[#E0E0E0] py-3 rounded-md hover:bg-[#d6e0d983] transition duration-200 cursor-pointer"
      >
        <Image src="/google.png" alt="Google Icon" width={20} height={20} />
        <p className="ml-2 text-sm font-medium">Login with Google</p>
      </button>

      {/* Signup Link */}
      <Link href="/auth/signup">
        <p className="text-xs mt-3">
          New here?{" "}
          <span className="text-[#13672B] font-semibold cursor-pointer underline">
            Create an account
          </span>
        </p>
      </Link>
    </div>
  );
};

export default Login;
