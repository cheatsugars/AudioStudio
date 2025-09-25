import React from 'react';
import { Script } from '../types';
import { MOVIE_SCENE_SCRIPT, PODCAST_TRANSCRIPT, AUDIO_VOICE_ASSISTANT } from '../constants';
import { ScriptIcon } from './icons/ScriptIcon';
import { PlayIcon } from './icons/PlayIcon';

interface BottomBarProps {
    isRunning: boolean;
    onRun: () => void;
    onLoadPreset: (preset: Script) => void;
}

const PresetButton: React.FC<{onClick: () => void; children: React.ReactNode; icon: React.ReactNode}> = ({ onClick, children, icon }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1.5 text-sm md:text-base font-medium text-gray-300 bg-zinc-700/60 rounded-full border border-transparent hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500"
    >
        {icon}
        {children}
    </button>
);


export const BottomBar: React.FC<BottomBarProps> = ({ isRunning, onRun, onLoadPreset }) => {
    return (
        <footer className="flex-shrink-0 px-6 py-4 sm:py-0 sm:h-20 bg-zinc-900 border-t border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
                <PresetButton onClick={() => onLoadPreset(PODCAST_TRANSCRIPT)} icon={<ScriptIcon className="w-5 h-5"/>}>
                    Podcast transcript
                </PresetButton>
                <PresetButton onClick={() => onLoadPreset(MOVIE_SCENE_SCRIPT)} icon={<ScriptIcon className="w-5 h-5"/>}>
                    Movie scene script
                </PresetButton>
                {/* FIX: Corrected closing tag from Button to PresetButton. */}
                <PresetButton onClick={() => onLoadPreset(AUDIO_VOICE_ASSISTANT)} icon={<ScriptIcon className="w-5 h-5"/>}>
                    Audio voice assistant
                </PresetButton>
            </div>
            <div className="flex items-center">
                <button
                    onClick={onRun}
                    disabled={isRunning}
                    className="w-36 h-12 flex items-center justify-center gap-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/50 disabled:opacity-60 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500"
                    aria-label="Run script"
                >
                    {isRunning ? (
                        <>
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-lg md:text-xl font-semibold">Running...</span>
                        </>
                    ) : (
                        <>
                            <PlayIcon className="w-6 h-6" />
                            <span className="text-lg md:text-xl font-semibold">Run</span>
                        </>
                    )}
                </button>
            </div>
        </footer>
    );
};
