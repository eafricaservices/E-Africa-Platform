"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Footer, Header, Stepper } from "../ui";
import { Inter } from "next/font/google";
import { CheckCircle, Upload } from "lucide-react";
import { MultiSelectDropdown } from "../components";

const inter = Inter({ subsets: ["latin"] });

export type ProfileFormData = {
    coreSkills: string[];
    skillLevel: string[];
    tools: string[];
    yearsExperience: string;
    certifications: File[] | null;
};

type ProfileFormField = keyof ProfileFormData;

export default function ProfilePage() {
    const [formData, setFormData] = useState<ProfileFormData>({
        coreSkills: [],
        skillLevel: [],
        tools: [],
        yearsExperience: "",
        certifications: null,
    });

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [customValue, setCustomValue] = useState("");
    const [customTools, setCustomTools] = useState("");
    const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Dropdown options
    const skillsOptions = ["UI/UX Design", "Mobile Development", "Frontend", "Backend", "Python"];
    const skillLevelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const toolsOptions = ["Figma", "Adobe XD", "VS Code", "Jira", "GitHub"];
    const yearsOfExperienceOptions = ["0-3 months", "3-6 months", "6-12 months", "1-2 years", "2+ years"];

    const handleMultiSelectChange = useCallback(
        (field: ProfileFormField, value: string) => {
            setFormData((prev) => {
                if (Array.isArray(prev[field]) && prev[field].includes(value)) {
                    return {
                        ...prev,
                        [field]: (prev[field] as string[]).filter((item) => item !== value),
                    };
                } else if (Array.isArray(prev[field])) {
                    return { ...prev, [field]: [...(prev[field] as string[]), value] };
                }
                return prev;
            });
        },
        []
    );
    //remove uploaded file
    const handleRemoveItem = useCallback((field: ProfileFormField, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((item) => item !== value),
        }));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isOutside = Object.values(dropdownRefs.current).every(
                (ref) => ref && !ref.contains(event.target as Node)
            );
            if (isOutside) setOpenDropdown(null);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // file upload handler
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFormData((prev) => ({
                ...prev,
                certifications: prev.certifications ? [...prev.certifications, ...newFiles] : newFiles,
            }));
        }
    };

    return (
        <div className={`min-h-screen max-w-7xl mx-auto ${inter.className}`}>
            <div className="p-10">
                <Header />
                <div className="p-6">
                    <Stepper />
                    <div className="space-y-6 p-6 mb-5 bg-[#F7F9F9] rounded-lg">
                        {/* Core Skills */}
                        <MultiSelectDropdown
                            label="Core Skills"
                            field="coreSkills"
                            options={skillsOptions}
                            placeholder="e.g., UI/UX Design, HTML, Python"
                            formData={formData}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            handleMultiSelectChange={handleMultiSelectChange}
                            handleRemoveItem={handleRemoveItem}
                            customValue={customValue}
                            setCustomValue={setCustomValue}
                            setFormData={setFormData}
                            dropdownRef={(el) => {
                                dropdownRefs.current.coreSkills = el;
                            }}
                        />

                        {/* Current Skill Level */}
                        <MultiSelectDropdown
                            label="Current Skill Level"
                            field="skillLevel"
                            options={skillLevelOptions}
                            placeholder="Select e.g., Beginner / Intermediate"
                            formData={formData}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            handleMultiSelectChange={handleMultiSelectChange}
                            handleRemoveItem={handleRemoveItem}
                            customValue={customValue}
                            setCustomValue={setCustomValue}
                            setFormData={setFormData}
                            dropdownRef={(el) => {
                                dropdownRefs.current.skillLevel = el;
                            }}
                        />

                        {/* Tools and Technologies */}
                        <MultiSelectDropdown
                            label="Tools and Technologies"
                            field="tools"
                            options={toolsOptions}
                            placeholder="e.g., Figma, VS Code"
                            formData={formData}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            handleMultiSelectChange={handleMultiSelectChange}
                            handleRemoveItem={handleRemoveItem}
                            allowCustom
                            customValue={customTools}
                            setCustomValue={setCustomTools}
                            setFormData={setFormData}
                            dropdownRef={(el) => {
                                dropdownRefs.current.tools = el;
                            }}
                        />

                        {/* Years of Experience */}
                        <MultiSelectDropdown
                            label="Years of Experience"
                            field="yearsExperience"
                            options={yearsOfExperienceOptions}
                            placeholder="Select your experience level"
                            formData={formData}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            handleMultiSelectChange={handleMultiSelectChange}
                            handleRemoveItem={handleRemoveItem}
                            customValue={customValue}
                            setCustomValue={setCustomValue}
                            setFormData={setFormData}
                            dropdownRef={(el) => {
                                dropdownRefs.current.coreSkills = el;
                            }}
                        />

                        {/* Certifications Upload */}
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

                                {/* Upload area (clickable icon + info) */}
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
                                                        <span className="truncate"><CheckCircle className="inline w-4 h-4 mr-1" /> {file.name}</span>
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
                                    {/* Choose button */}
                                    <button
                                        type="button"
                                        className="bg-green-800 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-900 transition-colors cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Choose files
                                    </button>

                                    <p className="text-xs text-gray-400 mt-2">
                                        Max 10MB per file. Jpeg, PDF supported
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
