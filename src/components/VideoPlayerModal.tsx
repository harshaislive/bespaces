import React from 'react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
}

export function VideoPlayerModal({ isOpen, onClose, videoUrl }: VideoPlayerModalProps) {
  if (!isOpen || !videoUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      <div 
        className="bg-[#fdfbf7] rounded-lg shadow-xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
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
        <div className="p-4">
          <video 
            controls 
            src={videoUrl} 
            className="w-full h-auto max-h-[70vh] rounded"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
} 