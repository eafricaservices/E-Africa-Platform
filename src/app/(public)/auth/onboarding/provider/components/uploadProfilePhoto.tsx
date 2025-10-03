"use client";

import React, { useState, useRef } from "react";

interface UploadProfilePhotoProps {
  onFileUpload?: (file: File) => void;
}

export default function UploadProfilePhoto({
  onFileUpload,
}: UploadProfilePhotoProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, PNG, and PDF files are allowed";
    }

    if (file.size > maxSizeInBytes) {
      return "File size must be less than 5MB";
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
    setFile(selectedFile);
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    onFileUpload?.(selectedFile);
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

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Profile Photo */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Upload Profile Photo
        </h3>

        <div
          className={`relative border-1 rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-[#13672B] bg-green-50"
              : error
              ? "border-red-300 bg-red-50"
              : file
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
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* File Icon */}
          <div className="mb-4">
            <img
              src="/file-icon.svg"
              alt="File upload"
              className="w-16 h-16 mx-auto text-gray-400"
            />
          </div>

          {/* Upload Text */}
          {uploading ? (
            <div className="space-y-3">
              <p className="text-gray-700 font-medium">
                Uploading {file?.name}...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#13672B] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{uploadProgress}%</p>
            </div>
          ) : file ? (
            <div className="space-y-2">
              <p className="text-[#13672B] font-medium">
                ✓ {file.name} uploaded successfully
              </p>
              <p className="text-sm text-gray-600">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={handleRemoveFile}
                className="mt-2 px-4 py-2 text-sm text-red-600 border-1 border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                Click to upload or drag file here
              </p>
              <p className="text-sm text-gray-500">JPG, PNG, PDF up to 5MB</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
