import { z } from "zod";
import { jsonFetch } from "@/lib/api/client";
import {
  EmailSchema,
  CodeSchema,
  PasswordSchema,
  BasicResponseSchema,
} from "@/lib/api/schemas/auth";

//create user
export async function signUp(input: { email: string; password: string }) {
  const email = EmailSchema.parse(input.email);
  const password = PasswordSchema.parse(input.password);

  return jsonFetch("/api/auth/signup", {
    method: "POST",
    body: { email, password },
    responseSchema: BasicResponseSchema.optional(),
  });
}

// Send verification code
export async function sendVerificationCode(input: { email: string }) {
  const email = EmailSchema.parse(input.email);

  return jsonFetch("/api/verification/send-code", {
    method: "POST",
    body: { email },
    responseSchema: BasicResponseSchema.optional(),
  });
}

// verify email with OTP
export async function verifyEmail(input: { email: string; code: string }) {
  const email = EmailSchema.parse(input.email);
  const code = CodeSchema.parse(input.code);

  return jsonFetch("/api/verification/verify-email", {
    method: "POST",
    body: { email, code },
    responseSchema: BasicResponseSchema.optional(),
  });
}

// login user
export async function login(input: { email: string; password: string }) {
  const email = EmailSchema.parse(input.email);
  const password = PasswordSchema.parse(input.password);

  return jsonFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
    responseSchema: z.any(),
  });
}

//reset password
export async function sendResetCode(input: { email: string }): Promise<void> {
  const email = EmailSchema.parse(input.email);
  await jsonFetch("/api/verification/reset-password/request", {
    method: "POST",
    body: { email },
    responseSchema: BasicResponseSchema.optional(),
  });
}

//verify password reset
export async function verifyResetPassword(input: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<void> {
  const email = EmailSchema.parse(input.email);
  const code = CodeSchema.parse(input.code);
  const newPassword = PasswordSchema.parse(input.newPassword);

  await jsonFetch("/api/verification/reset-password/verify", {
    method: "POST",
    body: { email, code, newPassword },
    responseSchema: BasicResponseSchema.optional(),
  });
}

//verify reset code
export async function verifyResetCode(input: { email: string; code: string }) {
  const email = EmailSchema.parse(input.email);
  const code = CodeSchema.parse(input.code);
  return jsonFetch("/api/verification/reset-password/verify-code", {
    method: "POST",
    body: { email, code },
    responseSchema: z.any(),
  });
}

//new password
export async function updateResetPassword(input: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<void> {
  const email = EmailSchema.parse(input.email);
  const code = CodeSchema.parse(input.code);
  const newPassword = PasswordSchema.parse(input.newPassword);
  await jsonFetch("/api/verification/reset-password/update", {
    method: "POST",
    body: { email, code, newPassword },
    responseSchema: BasicResponseSchema.optional(),
  });
}
