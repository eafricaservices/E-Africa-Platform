import React from "react";

interface StepHeaderProps {
  title: string;
  description: string;
}

export default function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="text-white bg-[#13672B] px-6 py-8 mb-4 text-center rounded-tl-lg rounded-br-lg">
      <h1 className="title text-2xl font-semibold">{title}</h1>
      <p className="text-sm">{description}</p>
    </div>
  );
}
