"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  uploadResumeDocument,
  deleteUploadedDocument,
} from "@/lib/api/endpoints/upload.client";
import type { ResumeUploadResult } from "@/lib/api/schemas/upload";
import { ApiError } from "@/lib/api/client";

interface UploadResumeProps {
  value?: ResumeUploadResult | null;
  onFileUpload?: (data: ResumeUploadResult | null) => void;
  errorMessage?: string | null;
}

export default function UploadResume({
  value,
  onFileUpload,
  errorMessage,
}: UploadResumeProps) {
  const [fileMeta, setFileMeta] = useState<ResumeUploadResult | null>(
    value ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, DOC, and DOCX files are allowed";
    }

    if (file.size > maxSizeInBytes) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const handleFileUpload = async (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setUploading(true);

    try {
      const uploaded = await uploadResumeDocument(selectedFile);

      const enriched: ResumeUploadResult = {
        ...uploaded,
        fileName: selectedFile.name,
        fileType: selectedFile.type || uploaded.fileType || "application/pdf",
        fileSize:
          typeof selectedFile.size === "number"
            ? selectedFile.size
            : uploaded.fileSize,
        fileUrl: uploaded.fileUrl,
        cloudinaryPublicId: uploaded.cloudinaryPublicId,
        uploadedAt: uploaded.uploadedAt ?? new Date().toISOString(),
      };

      setFileMeta(enriched);
      onFileUpload?.(enriched);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to upload document. Please try again.";
      setError(message);
      setFileMeta(null);
      onFileUpload?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (uploading) {
      return;
    }

    if (fileMeta?.cloudinaryPublicId) {
      try {
        await deleteUploadedDocument(fileMeta.cloudinaryPublicId);
      } catch {
        // Ignore cleanup failures so the user can continue.
      }
    }

    setFileMeta(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileUpload?.(null);
  };

  useEffect(() => {
    if (!value) {
      setFileMeta(null);
      setError("");
      return;
    }

    setFileMeta(value);
    setError("");
  }, [value]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-[#13672B] bg-green-50"
          : error || errorMessage
          ? "border-red-300 bg-red-50"
          : fileMeta
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
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Folder Icon */}
      <div className="mb-4">
        <div className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center">
          <img
            src="/folder_icon.svg"
            alt="File upload"
            className="w-16 h-16 mx-auto text-gray-400"
          />
        </div>
      </div>

      {/* Upload Content */}
      {uploading ? (
        <div className="space-y-3">
          <p className="text-gray-700 font-medium">
            Uploading {fileMeta?.fileName ?? "document"}...
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#13672B]" />
            <span className="h-2 w-2 animate-ping rounded-full bg-[#13672B] [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-ping rounded-full bg-[#13672B] [animation-delay:300ms]" />
          </div>
          <p className="text-sm text-gray-600">Please wait</p>
        </div>
      ) : fileMeta ? (
        <div className="space-y-2">
          <p className="text-[#13672B] font-medium">
            ✓ {fileMeta.fileName ?? "Document"} uploaded successfully
          </p>
          <p className="text-sm text-gray-600">
            {fileMeta.fileSize
              ? (fileMeta.fileSize / (1024 * 1024)).toFixed(2)
              : ""}
            {fileMeta.fileSize ? " MB" : ""}
          </p>
          <button
            onClick={handleRemoveFile}
            className="mt-2 px-4 py-2 text-sm text-red-600 border-1 border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Upload</h3>
          <p className="text-gray-600">
            Resume, portfolio, cover letter, or other documents
          </p>

          <button
            type="button"
            className="bg-[#13672B] text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors"
          >
            Choose files
          </button>

          <p className="text-sm text-gray-500">
            Max 10MB per file. PDF, DOC, DOCX supported
          </p>
        </div>
      )}

      {/* Error Message */}
      {(error || errorMessage) && (
        <p className="text-red-600 text-sm mt-2 font-medium">
          {error || errorMessage}
        </p>
      )}
    </div>
  );
}
