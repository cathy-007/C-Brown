import React from 'react';
import { DownloadIcon } from './icons';

interface AdGalleryProps {
  images: string[];
}

export const AdGallery: React.FC<AdGalleryProps> = ({ images }) => {

  const handleDownload = (imgSrc: string, index: number) => {
    const link = document.createElement('a');
    link.href = imgSrc;

    // Infer file extension from the mime type in the data URL
    const mimeType = imgSrc.substring(imgSrc.indexOf(':') + 1, imgSrc.indexOf(';'));
    const extension = mimeType.split('/')[1] || 'png';

    link.download = `ad-mockup-${index + 1}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((imgSrc, index) => (
        <div key={index} className="group relative bg-slate-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 border border-slate-700">
          <img
            src={imgSrc}
            alt={`Generated Ad ${index + 1}`}
            className="w-full h-auto object-cover aspect-square"
            loading="lazy"
          />
          <button
            onClick={() => handleDownload(imgSrc, index)}
            aria-label={`Download ad mockup ${index + 1}`}
            className="absolute top-3 right-3 bg-slate-900/60 hover:bg-sky-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm focus:opacity-100 outline-none"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};