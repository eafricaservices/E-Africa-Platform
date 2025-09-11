import { useMemo } from "react";

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function usePasswordValidation(password: string): {
  requirements: PasswordRequirement[];
  allMet: boolean;
  missingMessage: string;
} {
  const requirements = useMemo(() => {
    const reqs: PasswordRequirement[] = [
      {
        label: "At least 8 characters",
        met: password.length >= 8,
      },
      {
        label: "Contains uppercase letter",
        met: /[A-Z]/.test(password),
      },
      {
        label: "Contains lowercase letter",
        met: /[a-z]/.test(password),
      },
      {
        label: "Contains number",
        met: /\d/.test(password),
      },
      {
        label: "Contains special character",
        met: /[^\w\s]/.test(password),
      },
    ];
    return reqs;
  }, [password]);

  const allMet = requirements.every((req) => req.met);

  const missingMessage = useMemo(() => {
    if (allMet) return "";

    const missing: string[] = [];

    if (!requirements[0].met) missing.push("8+ characters");
    if (!requirements[1].met) missing.push("uppercase letter (A-Z)");
    if (!requirements[2].met) missing.push("lowercase letter (a-z)");
    if (!requirements[3].met) missing.push("number (0-9)");
    if (!requirements[4].met)
      missing.push("special character (@, $, %, !, etc.)");

    if (missing.length === 1) {
      return `Password must contain ${missing[0]}.`;
    } else if (missing.length === 2) {
      return `Password must contain ${missing[0]} and ${missing[1]}.`;
    } else {
      const lastItem = missing.pop();
      return `Password must contain ${missing.join(", ")}, and ${lastItem}.`;
    }
  }, [requirements, allMet]);

  return { requirements, allMet, missingMessage };
}
