import React from "react";
import { Inter } from "next/font/google";
import SideImage from "@/app/shared/SideImage";
import Login from "./ui/Login";

const inter = Inter({ subsets: ["latin"] });

const page = () => {
  return (
    <div className={`w-full flex p-10 gap-20 max-w-7xl mx-auto ${inter.className}`}>
      {/* Side Image */}
      <div className="hidden md:block md:w-1/2">
        <SideImage />
      </div>

      <div className="w-full md:w-3/5 flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
};

export default page;