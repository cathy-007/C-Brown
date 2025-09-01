
import React from 'react';

interface LoadingStateProps {
    scenarioText: string;
    currentIndex: number;
    total: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ scenarioText, currentIndex, total }) => {
    const progress = (currentIndex / total) * 100;

    return (
        <div className="w-full max-w-2xl text-center p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
            <div className="flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
                <h3 className="text-xl font-semibold ml-4 text-slate-200">Generating Ads...</h3>
            </div>
            <p className="text-slate-400 mb-4">
                Creating mockup for: <span className="font-semibold text-sky-400">{scenarioText}</span>
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                    className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-sm text-slate-500 mt-2">{currentIndex} of {total} complete</p>
        </div>
    );
};
