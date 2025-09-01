
import React, { useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  preview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, preview }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const onDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full h-64">
      <label
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="cursor-pointer w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-600 hover:border-sky-500 rounded-lg transition-colors duration-300 bg-slate-900/50 relative overflow-hidden"
      >
        {preview ? (
          <img src={preview} alt="Product preview" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-slate-500">
            <UploadIcon className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
