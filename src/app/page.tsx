// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Welcome to E-Africa
      </h1>
      <p className="text-gray-600 mb-6 max-w-lg">
        Your mentorship and career growth platform. Sign up to get started or
        log in if you already have an account.
      </p>
      <div className="space-x-4">
        <Link
          href="/auth/signup"
          className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-500 transition"
        >
          Sign Up
        </Link>
        <Link
          href="/auth/signin"
          className="px-6 py-3 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-blue-50 transition"
        >
          Login
        </Link>
      </div>
    </main>
  );
}