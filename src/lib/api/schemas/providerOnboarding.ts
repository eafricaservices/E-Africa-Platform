import { z } from "zod";

const preprocessNumeric = (value: unknown) => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number(trimmed);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return value;
};

const coerceInt = (options?: { nonnegative?: boolean }) =>
  z.preprocess(
    preprocessNumeric,
    options?.nonnegative ? z.number().int().nonnegative() : z.number().int()
  );
const coerceNumber = () => z.preprocess(preprocessNumeric, z.number());

// Coerce string or number to string (for backend compatibility)
const coerceString = () =>
  z.preprocess((value) => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (value === null || value === undefined) return undefined;
    return String(value);
  }, z.string());

// Coerce string or number array to string array
const coerceStringArray = () =>
  z.preprocess((value) => {
    if (!Array.isArray(value)) return undefined;
    return value.map((v) => {
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
      return String(v);
    });
  }, z.array(z.string()));

export const ProviderOnboardingProgressSchema = z
  .object({
    currentStep: coerceString().optional(),
    completedSteps: coerceStringArray().optional(),
    stepProgress: z.record(z.string(), z.boolean()).optional(),
    isCompleted: z.boolean().optional(),
  })
  .passthrough();

export type ProviderOnboardingProgress = z.infer<
  typeof ProviderOnboardingProgressSchema
>;

export const ProviderOnboardingProgressResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      progress: ProviderOnboardingProgressSchema.optional(),
      completionPercentage: coerceNumber().optional(),
      nextStep: z
        .preprocess(
          (v) => (typeof v === "string" ? Number(v) : v),
          z.number().nullable()
        )
        .optional(),
      currentStep: coerceString().optional(),
      isComplete: z.boolean().optional(),
    })
    .optional(),
  message: z.string().optional(),
});

export const ProviderOnboardingStepErrorSchema = z.object({
  success: z.literal(false).optional(),
  errors: z.record(z.string(), z.string()).optional(),
  message: z.string().optional(),
});

export const ProviderOnboardingStep2Schema = z.object({
  primaryExpertise: z.string().min(1, "Primary expertise is required"),
  educationLevel: z.enum([
    "OND",
    "HND",
    "Bachelors",
    "Masters",
    "Doctorate [PhD]",
  ]),
  portfolioOrResume: z
    .object({
      fileName: z.string().optional(),
      fileUrl: z.string(),
      fileType: z.string().optional(),
      fileSize: z.number().optional(),
      cloudinaryPublicId: z.string(),
      uploadedAt: z.string().optional(),
    })
    .optional(),
  linkedinProfileUrl: z
    .string()
    .url("Invalid LinkedIn profile URL")
    .min(1, "LinkedIn profile URL is required"),
  websiteUrl: z
    .string()
    .url("Invalid website URL")
    .min(1, "Website URL is required"),
});

export type ProviderOnboardingStep2Payload = z.infer<
  typeof ProviderOnboardingStep2Schema
>;
