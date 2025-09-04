import React from "react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const EmailRequest = () => {
  return (
    <div className={`${inter.className} email-request-ctn px-10 md:px-18`}>
      <h2 className="text-lg font-semibold mb-4 text-black text-center">
        Forgot Password
      </h2>
      <p className="mb-12 text-center text-black font-light">
        No problem, just input your email below and we’ll help you reset your
        password.
      </p>
      <form className="flex flex-col">
        <label htmlFor="email" className="mb-2 text-black">
          Email
        </label>
        <input
          type="email"
          autoComplete="true"
          placeholder="Enter your Email Address"
          className="border-[0.8px] border-black bg-white text-black outline-[#13672B] p-3 mb-4 rounded-lg
          placeholder:text-black placeholder:text-sm"
          required
        />
        <button
          type="submit"
          className="bg-[#13672B] text-white font-semibold px-2 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer"
        >
          Continue
        </button>

        <div className="bottomNavs w-full flex gap-3 justify-between mt-8">
          <a
            href="/auth/signin"
            className="text-sm text-[#13672B] font-semibold hover:underline"
          >
            Back to Login
          </a>

          <a
            href="/auth/signup"
            className="text-sm text-[#13672B] font-semibold hover:underline"
          >
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
};

export default EmailRequest;
