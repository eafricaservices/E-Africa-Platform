"use client";

import { Check, Loader2 } from "lucide-react";
import React from "react";

export type LoadingOverlayStatus = "loading" | "success" | "error";

interface LoadingOverlayProps {
  open: boolean;
  title: string;
  description?: string;
  status?: LoadingOverlayStatus;
}

export default function LoadingOverlay({
  open,
  title,
  description,
  status = "loading",
}: LoadingOverlayProps) {
  if (!open) {
    return null;
  }

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  const icon = isLoading ? (
    <Loader2 className="h-10 w-10 text-white animate-spin" />
  ) : isSuccess ? (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
      <Check className="h-7 w-7 text-white" />
    </div>
  ) : (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500">
      <span className="text-xl font-semibold text-white">!</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm">
      <div className="mx-4 flex max-w-sm flex-col items-center gap-4 rounded-3xl bg-white px-10 py-9 text-center shadow-2xl">
        {icon}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description ? (
            <p className="text-sm text-gray-600">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
