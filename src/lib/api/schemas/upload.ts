import { z } from "zod";

const UploadErrorSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
});

export const ProfilePictureUploadResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.object({
    imageUrl: z.string(),
    publicId: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
    bytes: z.number(),
  }),
});

export type ProfilePictureUploadResult = z.infer<
  typeof ProfilePictureUploadResponseSchema
>["data"] & {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileUrl?: string;
  cloudinaryPublicId?: string;
  uploadedAt?: string;
};

export const ProfilePictureUploadErrorResponseSchema = z.object({
  success: z.literal(false),
  error: UploadErrorSchema.optional(),
  message: z.string().optional(),
});

export type ResumeUploadResult = {
  fileName?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  cloudinaryPublicId: string;
  uploadedAt?: string;
};

export const DeleteImageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});
