import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import SideImage from "./ui/SideImage";

const inter = Inter({ subsets: ["latin"] });

const page = () => {
  return (
    <div className={`w-full flex h-screen p-10 gap-20 ${inter.className}`}>
      {/* Side Image */}
      <div className="w-2/5 hidden md:block">
        <SideImage />
      </div>
    </div>
  );
};

export default page;