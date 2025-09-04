import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import EmailRequest from "./ui/EmailRequest";
import ConfirmMail from "./ui/ConfirmMail";
import NewPasswordPage from "./ui/NewPassword";
import ChangeSuccess from "./ui/ChangeSuccess";
import SideImage from "./ui/SideImage";

const inter = Inter({ subsets: ["latin"] });

const page = () => {
  return (
    <div className="bg-white w-full flex justify-between gap-1 flex-col-reverse h-auto md:h-screen p-6 md:flex-row">
      {/* Side Image */}
      <SideImage />

      {/* Main content */}
      <div className="page-right w-full md:w-[65%] flex align-center flex-col h-full">
        <div className="logo-ctn p-2">
          <Image
            src="/E-africa-logo.png"
            alt="Logo"
            width={100}
            height={40}
            className="mx-auto"
          />
        </div>
        <EmailRequest />
        {/* <ConfirmMail /> */}
        {/* <NewPasswordPage /> */}
        {/* <ChangeSuccess /> */}
      </div>
    </div>
  );
};

export default page;
