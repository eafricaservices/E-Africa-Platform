"use client";

import { useState } from "react";
import {
  sendResetCode,
  verifyResetCode,
  updateResetPassword,
} from "@/lib/api/endpoints/auth";
import { CodeSchema, PasswordSchema } from "@/lib/api/schemas/auth";
import { ApiError } from "@/lib/api/client";
import EmailRequest from "./ui/EmailRequest";
import ConfirmMail from "./ui/ConfirmMail";
import NewPasswordPage from "./ui/NewPassword";
import ChangeSuccess from "./ui/ChangeSuccess";

// Steps: email -> confirm -> new -> success
type Step = "email" | "confirm" | "new" | "success";

export default function Flow() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendVerificationCode(targetEmail: string) {
    setError(null);
    setLoading(true);
    try {
      await sendResetCode({ email: targetEmail.trim() });
      setEmail(targetEmail.trim());
      setStep("confirm");
    } catch (err: any) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message ||
            "We couldn’t send the code right now. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // Confirm screen verifies code; only after success proceed to NewPassword
  const acceptCodeAndProceed = async (sixCode: string) => {
    try {
      CodeSchema.parse(sixCode);
    } catch (e: any) {
      const first = e?.errors?.[0]?.message as string | undefined;
      setError(first || "Enter the 6‑digit code sent to your email.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyResetCode({ email, code: sixCode });
      setCode(sixCode);
      setStep("new");
    } catch (err: any) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message ||
            "Invalid or expired code. Please request a new one.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  async function submitNewPassword(newPassword: string) {
    if (!email || !code || code.length !== 6) {
      setError("Your verification code is missing or incomplete.");
      setStep("confirm");
      return;
    }
    try {
      PasswordSchema.parse(newPassword);
    } catch (e: any) {
      const first = e?.errors?.[0]?.message as string | undefined;
      setError(first || "Please enter a valid password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateResetPassword({ email, code, newPassword });
      setStep("success");
    } catch (err: any) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || "Unable to reset your password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (step === "email")
    return (
      <EmailRequest
        defaultEmail={email}
        error={error || undefined}
        loading={loading}
        onSubmit={(val) => sendVerificationCode(val)}
      />
    );
  if (step === "confirm")
    return (
      <ConfirmMail
        email={email}
        onBack={() => setStep("email")}
        onResend={() => sendVerificationCode(email)}
        onVerify={async (c: string) => {
          await acceptCodeAndProceed(c);
        }}
        loading={loading}
        error={error || undefined}
      />
    );
  if (step === "new")
    return (
      <NewPasswordPage
        // submit includes email+code+newPassword
        onSubmit={(pwd: string) => submitNewPassword(pwd)}
        onBack={() => setStep("confirm")}
        loading={loading}
        error={error || undefined}
      />
    );
  return <ChangeSuccess />;
}
