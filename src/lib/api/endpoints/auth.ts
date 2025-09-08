"use client";

import { z } from "zod";
import { jsonFetch } from "@/lib/api/client";
import {
  EmailSchema,
  CodeSchema,
  PasswordSchema,
  BasicResponseSchema,
} from "@/lib/api/schemas/auth";

export async function sendResetCode(input: { email: string }): Promise<void> {
  const email = EmailSchema.parse(input.email);
  await jsonFetch("/api/verification/reset-password/request", {
    method: "POST",
    body: { email },
    responseSchema: BasicResponseSchema.optional(),
  });
}

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

export async function verifyResetCode(input: { email: string; code: string }) {
  const email = EmailSchema.parse(input.email);
  const code = CodeSchema.parse(input.code);
  return jsonFetch("/api/verification/reset-password/verify-code", {
    method: "POST",
    body: { email, code },
    responseSchema: z.any(),
  });
}

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
