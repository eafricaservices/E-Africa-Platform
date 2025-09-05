import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import SideImage from "./ui/SideImage";
import SignUp from "./ui/SignUp";

const inter = Inter({ subsets: ["latin"] });

const page = () => {
  return (
    <div className={`w-full flex h-screen p-10 gap-20 2xl:max-w-7xl :mx-auto ${inter.className}`}>
      {/* Side Image */}
      <div className="w-1/2 hidden md:block">
        <SideImage />
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center">
        <SignUp />
      </div>
    </div>
  );
};

export default page;