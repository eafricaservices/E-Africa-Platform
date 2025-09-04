import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function ChangeSuccess() {
  return (
    <div
      className={`${inter.className} px-10 md:px-18 items-center text-center justify-center flex flex-col my-20`}
    >
      <Image
        src="/check-icon.png"
        width={96}
        height={96}
        alt="Success"
        className="w-16 h-16 mb-4"
      />
      <p className="text-sm text-black mb-6">
        Your password has been updated. You can now log in with your new
        password.
      </p>
      <a
        href="/auth/signin"
        className="bg-[#13672B] text-white font-semibold px-4 py-3 rounded-lg hover:bg-green-600 transition cursor-pointer w-full"
      >
        Back to Login
      </a>
    </div>
  );
}
