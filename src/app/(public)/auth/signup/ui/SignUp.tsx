"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import VerifyEmailModal from "./VerifyEmailModal";
import { signUp, sendVerificationCode } from "@/lib/api/endpoints/auth";
import { loginWithGoogle } from "@/lib/api/endpoints/auth.client";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

type HandleSubmitEvent = React.FormEvent<HTMLFormElement>;

const GOOGLE_URL = process.env.NEXT_PUBLIC_API_URL + "/auth/google";

const SignUp: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const {
    requirements,
    allMet: passwordValid,
    missingMessage,
  } = usePasswordValidation(form.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("All fields are required");
      return;
    }

    if (!passwordValid) {
      setError("Please meet all password requirements");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.terms) {
      setError("You must agree to the Terms and Privacy Policy");
      return;
    }

    try {
      setLoading(true);
      // signup
      await signUp({ email: form.email, password: form.password });
      // send verification
      await sendVerificationCode({ email: form.email });
      // show modal
      setShowVerifyModal(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl justify-center items-center">
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
      </div>

      <div className="text-center space-y-2">
        <h1 className="font-semibold text-xl">Create your account</h1>
        <p className="text-xs text-[#212121]">
          Enter your details to create your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
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
          required
          className="w-full border border-[#212121] rounded-md p-2 mb-3 focus:outline-none focus:ring-1 focus:ring-[#26CD56] placeholder:text-xs text-sm"
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
            required
            className="w-full border border-[#212121] rounded-md p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#26CD56] placeholder:text-xs text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Requirements Message */}
        {form.password && missingMessage && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{missingMessage}</p>
          </div>
        )}

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <div className="relative mb-3">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            className="w-full border border-[#212121] rounded-md p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#26CD56] placeholder:text-xs text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Terms */}
        <div className="flex items-center space-x-2 cursor-pointer mb-3">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            className="accent-[#13672B] cursor-pointer"
          />
          <label htmlFor="terms" className="text-sm cursor-pointer">
            I agree with the{" "}
            <span className="text-[#13672B] text-xs font-semibold">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#13672B] text-xs font-semibold">
              Privacy Policy
            </span>
          </label>
        </div>

        {error && (
          <p
            className="text-red-600 text-sm mb-2"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            !passwordValid ||
            !form.terms ||
            form.password !== form.confirmPassword
          }
          className="w-full mt-3 py-2 rounded-md bg-[#13672B] text-white hover:bg-[#097d2a] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="flex items-center my-6 w-full">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="px-3 text-gray-500 text-sm">or continue with</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      {/* Google Auth */}
      <button
        type="button"
        onClick={() => loginWithGoogle()}
        className="w-full flex justify-center bg-[#E0E0E0] py-3 rounded-md hover:bg-[#d6e0d983] transition duration-200 cursor-pointer"
      >
        <Image src="/google.png" alt="Google Icon" width={20} height={20} />
        <p className="ml-2 text-sm font-medium">Sign up with Google</p>
      </button>

      <Link href="/auth/signin">
        <p className="text-xs mt-3">
          Already have an account?{" "}
          <span className="text-[#13672B] font-semibold underline">Login</span>
        </p>
      </Link>

      {showVerifyModal && (
        <VerifyEmailModal
          email={form.email}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </div>
  );
};

export default SignUp;
