import { z } from "zod";

export const EmailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address." });

export const CodeSchema = z
  .string()
  .regex(/^\d{6}$/, { message: "Enter the 6-digit code." });

export const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .regex(/[A-Z]/, { message: "Password must include an uppercase letter." })
  .regex(/[a-z]/, { message: "Password must include a lowercase letter." })
  .regex(/\d/, { message: "Password must include a number." })
  .regex(/[^\w\s]/, { message: "Password must include a special character." });

// Minimal, flexible response schema (accepts optional message/data)
export const BasicResponseSchema = z
  .object({
    message: z.string().optional(),
    data: z.unknown().optional(),
  })
  .partial();

export type Email = z.infer<typeof EmailSchema>;
export type Code = z.infer<typeof CodeSchema>;
export type Password = z.infer<typeof PasswordSchema>;

// Verify code response: { success, message?, data: { email, codeValid, expiresAt? } }
export const VerifyCodeResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: z
    .object({
      email: EmailSchema.optional(),
      codeValid: z.boolean(),
      expiresAt: z.string().optional(),
    })
    .optional(),
});

export type VerifyCodeResponse = z.infer<typeof VerifyCodeResponseSchema>;

export const AuthUserSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    email: EmailSchema.optional(),
    role: z.string().optional(),
    backendRole: z.string().optional(),
    userId: z.string().optional(),
    _id: z.union([z.string(), z.number()]).optional(),
    onboardingCompleted: z.boolean().optional(),
    onboardingStatus: z.string().optional(),
    onboardingCompletedAt: z.string().optional().nullable(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .passthrough();

export const AuthUserResponseSchema = z.union([
  AuthUserSchema,
  z
    .object({
      data: AuthUserSchema.nullish(),
      message: z.string().optional(),
    })
    .passthrough(),
]);

export type AuthUser = z.infer<typeof AuthUserSchema>;
