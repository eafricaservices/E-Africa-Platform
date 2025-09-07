"use client";

import { useState } from "react";
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

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://e-africa-platform-backend.onrender.com";

  async function sendVerificationCode(targetEmail: string) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/verification/reset-password/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ email: targetEmail.trim() }),
        }
      );

      if (!res.ok) {
        const pickMsg = (d: any): string => {
          if (!d) return "";
          if (typeof d === "string") return d;
          if (typeof d.message === "string") return d.message;
          if (typeof d.error === "string") return d.error;
          if (Array.isArray(d)) return d.map(pickMsg).filter(Boolean).join(" ");
          if (typeof d === "object") {
            for (const v of Object.values(d)) {
              const m = pickMsg(v);
              if (m) return m;
            }
          }
          return "";
        };

        let serverMsg = "";
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json();
            serverMsg = pickMsg(data);
          } else {
            serverMsg = await res.text();
          }
        } catch {}

        const msg =
          serverMsg ||
          (res.status === 400 || res.status === 422
            ? "Please enter a valid email address."
            : res.status === 404
            ? "We couldn’t reach the verification service. Please try again."
            : res.status === 409
            ? "A code was just sent. Please check your inbox."
            : res.status === 429
            ? "Too many attempts. Please wait a minute and try again."
            : res.status >= 500
            ? "Something went wrong on our side. Please try again later."
            : "We couldn’t send the code right now. Please try again.");

        throw new Error(msg);
      }

      setEmail(targetEmail.trim());
      setStep("confirm");
    } catch (err: any) {
      const networkMsg =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError")
          ? "Can’t reach the server. Please check your connection and try again."
          : err?.message ||
            "We couldn’t send the code right now. Please try again.";
      setError(networkMsg);
    } finally {
      setLoading(false);
    }
  }

  // Confirm screen collects code only, then New Password submits verification+reset
  const acceptCodeAndProceed = async (sixCode: string) => {
    if (!sixCode || sixCode.length !== 6) {
      setError("Enter the 6‑digit code sent to your email.");
      return;
    }
    setCode(sixCode);
    setError(null);
    setStep("new");
  };

  async function submitNewPassword(newPassword: string) {
    if (!email || !code || code.length !== 6) {
      setError("Your verification code is missing or incomplete.");
      setStep("confirm");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/verification/reset-password/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ email, code, newPassword }),
        }
      );

      if (!res.ok) {
        const pickMsg = (d: any): string => {
          if (!d) return "";
          if (typeof d === "string") return d;
          if (typeof d.message === "string") return d.message;
          if (typeof d.error === "string") return d.error;
          if (Array.isArray(d)) return d.map(pickMsg).filter(Boolean).join(" ");
          if (typeof d === "object") {
            for (const v of Object.values(d)) {
              const m = pickMsg(v);
              if (m) return m;
            }
          }
          return "";
        };

        let serverMsg = "";
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json();
            serverMsg = pickMsg(data);
          } else {
            serverMsg = await res.text();
          }
        } catch {}

        const msg =
          serverMsg ||
          (res.status === 400 || res.status === 422
            ? "Please enter a valid password and code."
            : res.status === 404
            ? "This code is invalid or expired. Request a new one."
            : res.status === 429
            ? "Too many attempts. Please wait a minute and try again."
            : res.status >= 500
            ? "Something went wrong on our side. Please try again later."
            : "Unable to reset your password. Please try again.");

        throw new Error(msg);
      }

      setStep("success");
    } catch (err: any) {
      const networkMsg =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError")
          ? "Can’t reach the server. Please check your connection and try again."
          : err?.message || "Unable to reset your password. Please try again.";
      setError(networkMsg);
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
