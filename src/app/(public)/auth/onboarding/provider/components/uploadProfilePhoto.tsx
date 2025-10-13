"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  deleteUploadedImage,
  uploadProfilePicture,
} from "@/lib/api/endpoints/upload.client";
import type { ProfilePictureUploadResult } from "@/lib/api/schemas/upload";
import { ApiError } from "@/lib/api/client";

interface UploadProfilePhotoProps {
  onFileUpload?: (data: ProfilePictureUploadResult | null) => void;
  value?: ProfilePictureUploadResult | null;
  errorMessage?: string | null;
}

export default function UploadProfilePhoto({
  onFileUpload,
  value,
  errorMessage,
}: UploadProfilePhotoProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMeta, setUploadMeta] =
    useState<ProfilePictureUploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, PNG, WEBP, or GIF files are allowed.";
    }

    if (file.size > maxSizeInBytes) {
      return "File size must be less than 5MB.";
    }

    return null;
  };

  const uploadFile = async (selectedFile: File) => {
    setUploading(true);
    try {
      const result = await uploadProfilePicture(selectedFile);
      setUploadMeta(result);
      onFileUpload?.(result);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to upload profile picture. Please try again.";
      setError(message);
      setUploadMeta(null);
      onFileUpload?.(null);
      setFileName(null);
      setFileSize(null);
      resetFileInput();
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    if (uploading) {
      return;
    }

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setFileName(selectedFile.name);
    setFileSize(selectedFile.size);
    await uploadFile(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (uploading) {
      return;
    }

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      void handleFileUpload(droppedFiles[0]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      if (uploading) {
        return;
      }
      void handleFileUpload(selectedFiles[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (uploading) {
      return;
    }

    if (uploadMeta?.publicId) {
      try {
        await deleteUploadedImage(uploadMeta.publicId);
      } catch {
        // Best-effort cleanup; ignore failures so the user can continue.
      }
    }

    setUploadMeta(null);
    setFileName(null);
    setFileSize(null);
    setError("");
    resetFileInput();
    onFileUpload?.(null);
  };

  useEffect(() => {
    if (!value) {
      setUploadMeta(null);
      setFileName(null);
      setFileSize(null);
      setError("");
      return;
    }

    setUploadMeta(value);
    setFileName(value.publicId);
    setFileSize(value.bytes);
    setError("");
  }, [value]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Upload Profile Photo
        </h3>

        <div
          className={`relative cursor-pointer rounded-lg border-1 p-12 text-center transition-all duration-200 ${
            isDragging
              ? "border-[#13672B] bg-green-50"
              : error || errorMessage
              ? "border-red-300 bg-red-50"
              : uploadMeta
              ? "border-[#13672B] bg-green-50"
              : "border-[#13672B] bg-gray-50 hover:bg-green-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="mb-4">
            <img
              src="/file-icon.svg"
              alt="File upload"
              className="mx-auto h-16 w-16 text-gray-400"
            />
          </div>

          {uploading ? (
            <div className="space-y-3">
              <p className="font-medium text-gray-700">
                Uploading {fileName ?? "file"}...
              </p>
              <div className="flex items-center justify-center gap-1">
                <span className="h-2 w-2 animate-ping rounded-full bg-[#13672B]" />
                <span className="h-2 w-2 animate-ping rounded-full bg-[#13672B] [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-ping rounded-full bg-[#13672B] [animation-delay:300ms]" />
              </div>
              <p className="text-sm text-gray-600">Please wait</p>
            </div>
          ) : uploadMeta ? (
            <div className="space-y-2">
              <p className="font-medium text-[#13672B]">
                ✓ {fileName} uploaded successfully
              </p>
              {fileSize !== null && (
                <p className="text-sm text-gray-600">
                  {(fileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
              <button
                onClick={handleRemoveFile}
                className="mt-2 rounded-lg border-1 border-red-300 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-medium text-gray-700">
                Click to upload or drag file here
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG, WEBP, GIF up to 5MB
              </p>
            </div>
          )}

          {Boolean(error || errorMessage) && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {error || errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
