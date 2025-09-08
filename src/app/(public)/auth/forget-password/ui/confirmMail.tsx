"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

type Props = {
  email: string;
  onBack: () => void;
  onResend: () => Promise<void> | void;
  onVerify: (code: string) => Promise<void>;
  loading?: boolean;
  error?: string;
};

const BOX_COUNT = 6;

const ConfirmMail = ({
  email,
  onBack,
  onResend,
  onVerify,
  loading = false,
  error,
}: Props) => {
  const [values, setValues] = useState<string[]>(Array(BOX_COUNT).fill(""));
  const inputsRef = useMemo(
    () =>
      Array.from({ length: BOX_COUNT }, () =>
        React.createRef<HTMLInputElement>()
      ),
    []
  );
  const [cooldown, setCooldown] = useState<number>(0);

  // cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const focusAt = (i: number) => {
    const ref = inputsRef[i]?.current;
    ref?.focus();
    ref?.select?.();
  };

  const handleChange =
    (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digit = raw.replace(/\D/g, "").slice(-1); // keep only last digit
      setValues((prev) => {
        const next = [...prev];
        next[i] = digit || "";
        return next;
      });
      if (digit && i < BOX_COUNT - 1) focusAt(i + 1);
    };

  const handleKeyDown =
    (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (values[i]) {
          // clear current
          setValues((prev) => {
            const next = [...prev];
            next[i] = "";
            return next;
          });
        } else if (i > 0) {
          focusAt(i - 1);
          setValues((prev) => {
            const next = [...prev];
            next[i - 1] = "";
            return next;
          });
        }
      }
    };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    const digits = (text.match(/\d/g) || []).slice(0, BOX_COUNT);
    if (digits.length) {
      e.preventDefault();
      setValues((_) => {
        const next = Array(BOX_COUNT)
          .fill("")
          .map((_, idx) => digits[idx] || "");
        return next;
      });
      const lastIndex = Math.min(digits.length, BOX_COUNT) - 1;
      focusAt(Math.max(0, lastIndex));
    }
  };

  const code = values.join("");
  const complete = code.length === BOX_COUNT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete) return;
    await onVerify(code);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await onResend();
    setCooldown(60);
  };

  return (
    <div className={`${inter.className} px-10 md:px-18`}>
      <div className="arrow-title my-10 flex gap-2 w-[calc(50%_+_73.09px)] justify-between items-center">
        <Image
          src="/ArrowLeft.svg"
          alt="Arrow"
          className="cursor-pointer"
          width={24}
          height={24}
          onClick={onBack}
        />
        <h2 className="text-lg font-semibold text-black text-center">
          Verify your Email
        </h2>
      </div>

      <p className="mb-6 text-2sm text-center text-black font-light">
        Enter the passcode sent to <span className="font-bold">{email}</span>
      </p>

      {error && (
        <p className="mb-4 text-center text-red-700 text-[0.85em]" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex gap-3 justify-center mb-6">
          {values.map((v, i) => (
            <input
              key={i}
              ref={inputsRef[i]}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={v}
              onChange={handleChange(i)}
              onKeyDown={handleKeyDown(i)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-12 h-12 md:w-14 md:h-14 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black bg-white"
            />
          ))}
        </div>

        <div className="mb-6 text-sm text-center">
          <span className="text-black">Didn't receive the code? </span>
          {cooldown > 0 ? (
            <span className="text-gray-500">Resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-[#13672B] font-semibold hover:underline"
              disabled={loading}
            >
              Resend code
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!complete || loading}
          className="w-full bg-[#13672B] text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-70"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className="text-center mt-4">
        <a
          href="/auth/signin"
          className="text-sm text-[#13672B] font-semibold hover:underline"
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default ConfirmMail;
