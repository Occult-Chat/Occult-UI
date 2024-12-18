"Use Client"

// ScreenMirror.tsx
import React, { useState, useRef } from 'react';
import { AppWindow, MonitorPlay, Layout, X } from 'lucide-react';

interface ScreenPickerProps {
  onSourceSelect: (stream: MediaStream) => void;
  onClose: () => void;
}

function ScreenPicker({ onSourceSelect, onClose }: ScreenPickerProps) {
  const handleSelect = async (displaySurface: string) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface,
          frameRate: { ideal: 60 }
        },
        audio: false,
        preferCurrentTab: false,
        selfBrowserSurface: 'exclude'
      });
      onSourceSelect(stream);
    } catch (error) {
      console.error('Error selecting source:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Select Screen to Share</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect('window')}
            className="bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors"
          >
            <AppWindow className="w-8 h-8 text-blue-400" />
            <span className="text-sm text-gray-200">Application Window</span>
          </button>

          <button
            onClick={() => handleSelect('monitor')}
            className="bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors"
          >
            <MonitorPlay className="w-8 h-8 text-green-400" />
            <span className="text-sm text-gray-200">Entire Screen</span>
          </button>

          <button
            onClick={() => handleSelect('browser')}
            className="bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 flex flex-col items-center gap-2 transition-colors"
          >
            <Layout className="w-8 h-8 text-purple-400" />
            <span className="text-sm text-gray-200">Browser Tab</span>
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Your screen will be shared securely with end-to-end encryption
        </div>
      </div>
    </div>
  );
}

export default function ScreenMirror() {
  const [showPicker, setShowPicker] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleSourceSelect = (stream: MediaStream) => {
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      setIsSharing(true);
      setShowPicker(false);

      // Handle stream ending
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        setIsSharing(false);
        streamRef.current = null;
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      });
    }
  };

  const stopSharing = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsSharing(false);
  };

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        {isSharing && (
          <div className="bg-zinc-900 rounded-lg shadow-lg p-2 mb-2">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted
              className="w-64 rounded border border-zinc-700"
            />
            <button
              onClick={stopSharing}
              className="w-full mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white transition-colors"
            >
              Stop Sharing
            </button>
          </div>
        )}

        {!isSharing && (
          <button
          onClick={() => setShowPicker(true)}
          className={`p-2.5 rounded-md transition-colors  bg-[#36393f] hover:bg-[#40444b]}`}
          >
            <MonitorPlay className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {showPicker && (
        <ScreenPicker
          onSourceSelect={handleSourceSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}