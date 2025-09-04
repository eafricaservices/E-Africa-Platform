import React from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

const ConfirmMail = () => {
  // user input email from emailRequest component
  // For demonstration, i used a hardcoded email
  const userInputEmail = "johndoe@gmail.com";

  return (
    <div className={`${inter.className} px-10 md:px-18`}>
      <div className="arrow-title my-10 flex gap-2 w-[calc(50%_+_73.09px)] justify-between items-center">
        <Image
          src="/ArrowLeft.svg"
          alt="Arrow"
          className="cursor-pointer"
          width={24}
          height={24}
        />
        <h2 className="text-lg font-semibold text-black text-center">
          Forgot Password
        </h2>
      </div>
      <p className="mb-12 text-2sm text-center text-black font-light">
        You got it! If <span className="font-bold">{userInputEmail}</span> is
        associated with an E-Africa account, we’ve emailed a reset link. Check
        your inbox for a message from E-Africa to reset your password.
      </p>
      <button
        type="submit"
        className="bg-[#13672B] text-white font-semibold px-2 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer w-full"
      >
        Resend email
      </button>
    </div>
  );
};

export default ConfirmMail;
