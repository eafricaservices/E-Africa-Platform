"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
interface FormState {
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

type HandleSubmitEvent = React.FormEvent<HTMLFormElement>;

const SignUp: React.FC = () => {
    const [form, setForm] = useState<FormState>({
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: HandleSubmitEvent): void => {
        e.preventDefault();
        setError("");

        if (!form.terms) {
            setError("You must agree to the Terms and Privacy Policy");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        console.log("Form submitted:", form);
    };

    // form validation
    const isFormValid =
        form.email.trim() !== "" &&
        form.password.trim() !== "" &&
        form.confirmPassword.trim() !== "" &&
        form.password === form.confirmPassword &&
        form.terms;

    return (
        <div className="flex flex-col gap-3 w-full max-w-xl justify-center items-center">
            <div className="flex flex-col items-center">
                <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </div>

            <h1 className="font-semibold text-xl">Create your account</h1>
            <p className="text-xs text-[#212121]">
                Enter your details to create your account
            </p>

            <form onSubmit={handleSubmit} className="w-full gap-3">
                {/* Email */}
                <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className="w-full border border-[#212121] rounded-md p-2 mb-3 focus:outline-none focus:ring-1 focus:ring-[#26CD56] placeholder:text-xs placeholder:text-[#757575] text-sm"
                />

                {/* Password */}
                <label htmlFor="password" className="text-sm font-medium">
                    Password
                </label>
                <div className="relative mb-3">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="w-full border border-[#212121] rounded-md p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#26CD56] placeholder:text-xs placeholder:text-[#757575] text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Confirm Password */}
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                </label>
                <div className="relative mb-3">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        className="w-full border border-[#212121] rounded-md p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#26CD56] placeholder:text-xs placeholder:text-[#757575] text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Terms */}
                <div className="flex items-center space-x-2 cursor-pointer mb-3">
                    <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={form.terms}
                        onChange={handleChange}
                        className="accent-[#13672B] cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm">
                        I agree with the{" "}
                        <span className="text-[#13672B] text-xs font-semibold">
                            Terms of services
                        </span>{" "}
                        and{" "}
                        <span className="text-[#13672B] text-xs font-semibold">
                            Privacy Policy
                        </span>
                    </label>
                </div>

                {/* Error */}
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                {/* Sign Up Button */}
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full py-2 rounded-md transition duration-200  bg-[#13672B] text-white hover:bg-[#097d2a] ${isFormValid
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        }`}
                >
                    Sign Up
                </button>
            </form>

            <div className="flex items-center my-6 w-full">
                <div className="flex-grow border-t-2 border-gray-400"></div>
                <span className="px-3 text-gray-500 text-sm">or continue with</span>
                <div className="flex-grow border-t-2 border-gray-400"></div>
            </div>

            {/* Social auth buttons */}
            <div className="w-full flex justify-center bg-[#E0E0E0] py-3 rounded-md hover:bg-[#d6e0d983] transition duration-200 cursor-pointer mb-3">
                <Image src="/google.png" alt="Google Icon" width={20} height={20} />
                <p className="ml-2 text-sm font-medium">Sign Up with Google</p>
            </div>
            <div className="w-full flex justify-center bg-[#E0E0E0] py-3 rounded-md hover:bg-[#d6e0d983] transition duration-200 cursor-pointer">
                <Image src="/linkedin.png" alt="LinkedIn Icon" width={20} height={20} />
                <p className="ml-2 text-sm font-medium">Sign Up with LinkedIn</p>
            </div>

            <Link href="/signin">
                <p>
                    Already have an account?{" "}
                    <span className="text-[#13672B] font-semibold cursor-pointer underline">
                        Login
                    </span>
                </p>
            </Link>
        </div>
    );
};

export default SignUp;