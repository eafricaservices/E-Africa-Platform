"use client";
import React, { useState, useEffect, useRef } from "react";
import EmailVerified from "./EmailVerifiedModal";
import { sendVerificationCode, verifyEmail } from "@/lib/api/endpoints/auth";

interface VerifyEmailModalProps {
  email: string;
  onClose: () => void;
}

const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({ email, onClose }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Handle OTP input
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Submit OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);
      await verifyEmail({ email, code: enteredOtp });
      setVerified(true);
    } catch (err: any) {
      setError("❌ Invalid OTP, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      setResending(true);
      await sendVerificationCode({ email });
      setMessage("📨 A new OTP has been sent to your email.");
    } catch (err) {
      setError("❌ Failed to resend OTP, please try again.");
    } finally {
      setResending(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // If verified, show success modal
  if (verified) {
    return <EmailVerified onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg text-center"
      >
        <h2 className="text-lg font-semibold mb-2">Verify your Email</h2>
        <p className="text-xs text-gray-600 mb-4">
          Enter the 6-digit passcode sent to {email}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* OTP Boxes */}
          <div className="flex justify-center gap-2 mt-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 border border-[#9E9E9E] text-[#13672B] text-center rounded-md focus:outline-none focus:ring-1 focus:ring-[#26CD56]"
              />
            ))}
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}
          {message && <p className="text-xs text-gray-700">{message}</p>}

          <p className="text-xs">
            {"Didn't"} receive code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[#13672B] font-semibold underline cursor-pointer"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </p>

          <div className="flex justify-center mt-5">
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2 rounded-md bg-[#13672B] text-white text-sm hover:bg-[#097d2a] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailModal;
