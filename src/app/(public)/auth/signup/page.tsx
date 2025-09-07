import React from "react";
import { Inter } from "next/font/google";
import SideImage from "@/app/shared/SideImage";
import { SignUp } from "./ui";


const inter = Inter({ subsets: ["latin"] });

const page = () => {
  return (
    <div className={`w-full flex p-10 gap-20 max-w-7xl mx-auto ${inter.className}`}>
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