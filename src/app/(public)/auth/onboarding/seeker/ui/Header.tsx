import React from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
const Header = () => {
  return (
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between text-[#13672B] mb-8 w-[55%]">
          <Link href="/auth/onboarding/seeker/personal-information">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </div>

        {/* Top section */}
        <div className="flex flex-col items-center bg-[#13672B] text-white p-8 rounded-lg mb-8">
          <h1 className="text-2xl font-medium">Create Your Profile</h1>
          <p className="text-sm font-light mt-3 text-center">
            Help us understand your career goals and connect you with the right opportunities
          </p>
        </div>
      </div>
  );
}

export default Header