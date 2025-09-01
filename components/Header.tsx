import React from 'react';
import { CameraIcon } from './icons';
import { ShareButton } from './ShareButton';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <CameraIcon className="w-8 h-8 mr-3 text-sky-400" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
            AI Ad Mockup Generator
          </h1>
        </div>
        <ShareButton />
      </div>
    </header>
  );
};
