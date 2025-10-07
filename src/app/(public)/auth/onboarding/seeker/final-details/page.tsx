"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Inter } from "next/font/google";
import { Footer, Header, Stepper } from "../ui";
import { Plus, Upload, CheckCircle } from "lucide-react";
import { updateProfileStep4 } from "@/lib/api/endpoints/auth";

const inter = Inter({ subsets: ["latin"] });

export type FinalDetailsData = {
  coreSkills: string[];
  skillLevel: string[];
  tools: string[];
  yearsExperience: string;
  certifications: File[] | null;
  linkedinUrl: string;
  portfolioUrl: string;
  links: { label: string; url: string }[];
};

type FinalDetailsField = keyof FinalDetailsData;

const Page = () => {
  const [formData, setFormData] = useState<FinalDetailsData>({
    coreSkills: [],
    skillLevel: [],
    tools: [],
    yearsExperience: "",
    certifications: null,
    linkedinUrl: "",
    portfolioUrl: "",
    links: [],
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleRemoveItem = useCallback((field: FinalDetailsField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((item) => item !== value),
    }));
  }, []);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications ? [...prev.certifications, ...newFiles] : newFiles,
      }));
    }
  };

  // Add new link
  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { label: "", url: "" }],
    }));
  };

  // Update existing link
  const updateLink = (index: number, field: "label" | "url", value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  // ✅ Submit handler for Step 4 (uses your existing Footer button)
  const handleSubmit = async () => {
    try {
      const response = await updateProfileStep4(formData);
      console.log("✅ Final details updated successfully:", response);
    } catch (error) {
      console.error("❌ Error updating final details:", error);
    }
  };

  return (
    <div className={`min-h-screen max-w-7xl mx-auto ${inter.className}`}>
      <div className="p-10">
        <Header />
        <div className="p-6">
          <Stepper />

          {/* Documents upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifications (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileUpload}
              />

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                  <Upload className="text-yellow-600" size={32} />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Upload</p>
                <p className="text-xs text-gray-500 mb-3">
                  Provide certification documents relevant to your career
                </p>
                {Array.isArray(formData.certifications) &&
                  formData.certifications.length > 0 && (
                    <ul className="text-xs text-center w-full max-w-sm mx-auto mt-1 space-y-1">
                      {formData.certifications.map((file, index) => (
                        <li
                          key={index}
                          className="text-xs text-green-700 font-medium mb-3"
                        >
                          <span className="truncate">
                            <CheckCircle className="inline w-4 h-4 mr-1" />{" "}
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                certifications: prev.certifications
                                  ? prev.certifications.filter((_, i) => i !== index)
                                  : [],
                              }))
                            }
                            className="ml-2 text-red-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                <button
                  type="button"
                  className="bg-[#13672B] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-900 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose file(s)
                </button>

                <p className="text-xs text-gray-400 mt-2">
                  Max 10MB per file. DOC, DOCX, PDF supported
                </p>
              </div>
            </div>
          </div>

          <form className="mt-3 space-y-6">
            {/* LinkedIn Profile */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                }
                className="w-full p-2 border border-[#13672B] rounded-md focus:ring-1 focus:ring-green-700 focus:border-transparent outline-none placeholder:text-sm"
              />
            </div>

            {/* Portfolio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio
              </label>
              <input
                type="url"
                placeholder="https://your-portfolio.com"
                value={formData.portfolioUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, portfolioUrl: e.target.value }))
                }
                className="w-full p-2 border border-[#13672B] rounded-md focus:ring-1 focus:ring-green-700 focus:border-transparent outline-none placeholder:text-sm"
              />
            </div>

            {/* Additional Links */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Links
              </label>
              {formData.links.map((link, index) => (
                <div key={index} className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Label (e.g. GitHub, Blog, Behance)"
                    value={link.label}
                    onChange={(e) => updateLink(index, "label", e.target.value)}
                    className="w-1/3 p-2 border border-[#13672B] rounded-md focus:ring-1 focus:ring-green-700 focus:border-transparent outline-none placeholder:text-sm"
                  />
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    className="w-2/3 p-2 border border-[#13672B] rounded-md focus:ring-1 focus:ring-green-700 focus:border-transparent outline-none placeholder:text-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="flex items-center text-green-700 text-sm font-medium hover:text-green-800 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add another link
              </button>
            </div>

            <Footer stepNumber={4} formData={formData} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
