"use client";

import React, { useState, useRef, useEffect } from "react";

interface VideoRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoReady: (video: Blob) => void;
}

export default function VideoRecordingModal({
  isOpen,
  onClose,
  onVideoReady,
}: VideoRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentCamera, setCurrentCamera] = useState<"user" | "environment">(
    "user"
  );
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    } else {
      cleanup();
    }
    return () => cleanup();
  }, [isOpen, currentCamera]);

  const initializeCamera = async () => {
    try {
      setErrorMessage("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentCamera },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Check for flash capability
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as any;
      setHasFlash(capabilities.torch === true);
    } catch (error) {
      setErrorMessage(
        "Camera access denied. Please enable camera permissions."
      );
    }
  };

  const toggleFlash = async () => {
    if (!hasFlash) {
      setErrorMessage("Your camera doesn't support flash");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const videoTrack = streamRef.current?.getVideoTracks()[0];
      if (videoTrack) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !flashEnabled } as any],
        });
        setFlashEnabled(!flashEnabled);
      }
    } catch (error) {
      setErrorMessage("Your camera denied flash access");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const toggleCamera = () => {
    setCurrentCamera(currentCamera === "user" ? "environment" : "user");
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 60) {
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const acceptVideo = () => {
    if (recordedBlob) {
      onVideoReady(recordedBlob);
      onClose();
    }
  };

  const retakeVideo = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (previewVideoRef.current) {
      if (isPlaying) {
        previewVideoRef.current.pause();
      } else {
        previewVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Desktop blur overlay */}
      <div className="hidden md:block absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal container */}
      <div className="relative h-full w-full md:h-[80vh] md:w-[60vw] md:max-w-2xl md:mx-auto md:my-[10vh] md:rounded-2xl md:overflow-hidden bg-black">
        {/* Video stream or preview */}
        <div className="relative h-full w-full">
          {recordedBlob ? (
            <video
              ref={previewVideoRef}
              src={URL.createObjectURL(recordedBlob)}
              className="w-full h-full object-cover"
              controls={false}
              autoPlay
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="absolute top-20 left-4 right-4 bg-red-500 text-white p-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {!recordedBlob && (
              <div className="bg-black/50 px-3 py-1 rounded-full">
                <span className="text-white font-mono text-lg">
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              {!recordedBlob && (
                <>
                  <button
                    onClick={toggleFlash}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      flashEnabled
                        ? "bg-yellow-500"
                        : "bg-black/30 text-white hover:bg-black/50"
                    }`}
                  >
                    {flashEnabled ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3.27 3L2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73 3.27 3zM17 10h-4l4-8H7v2.18l8.46 8.46L17 10z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={toggleCamera}
                    className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20,5h-3.17L15,3H9L7.17,5H4C2.9,5,2,5.9,2,7v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V7C22,5.9,21.1,5,20,5z M12,18 c-2.76,0-5-2.24-5-5H5l2.5-2.5L10,13H8c0,2.21,1.79,4,4,4c0.58,0,1.13-0.13,1.62-0.35l0.74,0.74C13.65,17.76,12.86,18,12,18z M16.5,15.5L14,13h2c0-2.21-1.79-4-4-4c-0.58,0-1.13,0.13-1.62,0.35L9.64,8.62C10.35,8.24,11.14,8,12,8c2.76,0,5,2.24,5,5h2 L16.5,15.5z" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {recordedBlob ? (
              <>
                {/* Play/Pause button */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    {isPlaying ? (
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-8 h-8 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Accept/Retake buttons */}
                <div className="flex justify-center gap-8">
                  <button
                    onClick={retakeVideo}
                    className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={acceptVideo}
                    className="w-16 h-16 bg-[#13672B] rounded-full flex items-center justify-center text-white hover:bg-green-800 transition-colors"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className="relative w-20 h-20"
                  disabled={!!errorMessage}
                >
                  {/* Progress ring */}
                  <div className="absolute inset-0">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="white"
                        strokeWidth="2"
                        fill="transparent"
                        opacity="0.3"
                      />
                      {isRecording && (
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="red"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={`${(recordingTime / 60) * 283} 283`}
                          className="transition-all duration-1000"
                        />
                      )}
                    </svg>
                  </div>

                  {/* Shutter button */}
                  <div
                    className={`absolute inset-2 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                      isRecording ? "bg-red-500" : "bg-transparent"
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full transition-all ${
                        isRecording ? "bg-white" : "bg-red-500"
                      }`}
                    />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
