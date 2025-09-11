"use client";
import React, { useRef, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmailVerifiedModalProps {
    onClose: () => void;
}

const EmailVerifiedModal: React.FC<EmailVerifiedModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleContinue = () => {
        router.push("/auth/signin");
    };

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg text-center flex flex-col justify-center items-center"
            >
                <CheckCircle className="mx-auto text-green-600 w-12 h-12 mb-3" />
                <h2 className="text-lg font-semibold mb-2">You're all set!</h2>
                <p className="text-sm text-gray-600 mb-5 max-w-xs">
                    Your email has been verified. Now tell us how you'd like to get
                    started.
                </p>

                <button
                    onClick={handleContinue}
                    className="w-1/2 py-2 rounded-md bg-[#13672B] text-white text-sm hover:bg-[#097d2a] cursor-pointer"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default EmailVerifiedModal;
