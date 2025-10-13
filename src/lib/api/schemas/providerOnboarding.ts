import { z } from "zod";

export const ProviderOnboardingProgressSchema = z.object({
  currentStep: z.number().int().nonnegative(),
  completedSteps: z.array(z.number().int()),
  stepProgress: z.record(z.string(), z.boolean()).optional(),
  isCompleted: z.boolean(),
});

export type ProviderOnboardingProgress = z.infer<
  typeof ProviderOnboardingProgressSchema
>;

export const ProviderOnboardingProgressResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      progress: ProviderOnboardingProgressSchema.optional(),
      completionPercentage: z.number().optional(),
      nextStep: z.number().int().nullable().optional(),
      currentStep: z.number().optional(),
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
