import React, { useState } from 'react';
import { ShareIcon } from './icons';

export const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'AI Ad Mockup Generator',
      text: 'Check out this AI-powered ad mockup generator!',
      url: window.location.href,
    };

    try {
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Hide message after 2s
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback for browsers that might fail clipboard access in certain contexts
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipErr) {
        console.error('Error copying to clipboard:', clipErr);
        alert('Could not copy link to clipboard.');
      }
    }
  };

  return (
    <div className="relative flex items-center">
       <button
        onClick={handleShare}
        aria-label="Share App"
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors duration-300 border border-slate-700"
      >
        <ShareIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Share</span>
      </button>
      {copied && (
         <div 
          className="absolute right-0 -top-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg transition-all animate-fade-in-out"
          role="status"
          aria-live="polite"
        >
          Link Copied!
        </div>
      )}
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};
