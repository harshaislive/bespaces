import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.load();
    }
  }, [isOpen, videoUrl]);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video playback error:', e);
    setIsLoading(false);
  };

  if (!isOpen || !videoUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#fdfbf7] rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#e7e4df] flex justify-between items-center">
          <h2 className="text-lg font-serif font-bold text-[#344736]">Video Playback</h2>
          <button 
            onClick={onClose} 
            className="text-[#51514d] hover:text-[#342e29] text-2xl font-light"
          >
            &times;
          </button>
        </div>
        <div className="relative bg-black aspect-video">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#344736] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <video 
            ref={videoRef}
            controls 
            className="w-full h-full"
            autoPlay
            playsInline
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            style={{ backgroundColor: 'black' }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
} 