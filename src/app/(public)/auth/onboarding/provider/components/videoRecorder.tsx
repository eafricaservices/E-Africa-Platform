"use client";

import React, { useState, useRef } from "react";
import VideoRecordingModal from "./videoRecordingModal";

interface VideoRecorderProps {
  onVideoReady?: (video: File | Blob) => void;
  onNext?: () => void; // TEMPORARY NAVIGATION - Remove when API validation is ready
  onPrevious?: () => void; // TEMPORARY NAVIGATION - Remove when API validation is ready
}

export default function VideoRecorder({
  onVideoReady,
  onNext,
  onPrevious,
}: VideoRecorderProps) {
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRecordVideo = () => {
    setShowModal(true);
  };

  const handleVideoRecorded = (videoBlob: Blob) => {
    const url = URL.createObjectURL(videoBlob);
    setVideoUrl(url);
    onVideoReady?.(videoBlob);
    setShowModal(false);
  };

  const handleUploadVideo = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      onVideoReady?.(file);
    }
  };

  const videoTips = [
    "Introduce yourself and your background",
    "Explain what you can help mentees achieve",
    "Share your mentoring philosophy",
    "Keep it under 60 seconds",
    "Ensure good lighting and clear audio",
  ];

  return (
    <div className="space-y-6">
      {/* Video Preview Area */}
      <div className="bg-[#212121] rounded-lg p-16 flex items-center justify-center min-h-[280px]">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img
                src="/camera-icon.svg"
                alt="File upload"
                className="w-16 h-16 mx-auto text-gray-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Record/Upload Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleRecordVideo}
          className="px-6 py-2 cursor-pointer hover:scale-[1.05] transition-all ease-in-out text-sm rounded-lg font-medium bg-[#13672B] text-white hover:bg-green-800"
        >
          Record Video
        </button>

        <button
          onClick={handleUploadVideo}
          className="px-6 py-2 cursor-pointer hover:scale-[1.05] transition-all ease-in-out text-sm border-1 border-[#13672B] text-[#13672B] rounded-lg font-medium hover:bg-green-50"
        >
          Upload Video
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Video Tips */}
      <div className="bg-green-100 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3">
            <img
              src="/lightbulb-icon.svg"
              alt="File upload"
              className="w-16 h-16 mx-auto text-gray-400"
            />
          </div>
          <h3 className="text-gray-900 font-medium">Video Tips</h3>
        </div>
        <ul className="space-y-2">
          {videoTips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="text-gray-600 mr-2">•</span>
              <span className="text-gray-700 text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Video Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Title*
        </label>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="e.g Hi, I'm Sarah - Your software development mentor"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* TEMPORARY NAVIGATION - Remove when API validation is ready */}
      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={onPrevious}
          className="px-8 py-3 border-1 border-[#13672B] text-[#13672B] rounded-lg font-medium hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2"
        >
          Go back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3 bg-[#13672B] text-white rounded-lg font-medium hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2"
        >
          Save and Continue
        </button>
      </div>

      {/* Video Recording Modal */}
      <VideoRecordingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onVideoReady={handleVideoRecorded}
      />
    </div>
  );
}
