"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Flow from "./Flow";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ProviderOnboardingPage() {
  const router = useRouter();

  function handleBack(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    router.back();
  }
  return (
    <div className={"min-h-screen px-8 pb-10 " + poppins.className}>
      {/* Static Navigation - Always Visible */}
      <nav
        className={
          "flex items-center justify-between py-6 w-[calc(50vw_+_50px)]"
        }
      >
        <button
          className="hover:bg-green-200 transition-all ease-in-out duration-500 p-2 rounded-2xl"
          onClick={handleBack}
        >
          <ArrowLeft className="w-8 h-8 text-green-700 cursor-pointer " />
        </button>
        <Image
          src="/E-africa-logo.png"
          alt="E-Africa"
          width={100}
          height={40}
        />
      </nav>

      {/* Dynamic Forms Container */}
      <div className="forms-container p-8 bg-[#F7F9F9]">
        <Flow /> {/* This handles the swapping */}
      </div>
    </div>
  );
}
