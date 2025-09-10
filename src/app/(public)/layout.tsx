import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`auth-layout min-h-screen bg-white text-black ${inter.className}`}>
      {children}
    </div>
  );
}
