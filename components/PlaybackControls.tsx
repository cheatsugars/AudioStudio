
import React from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { StopIcon } from './icons/StopIcon';
import { PlaybackState } from '../types';

interface PlaybackControlsProps {
  state: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  state,
  onPlay,
  onPause,
  onResume,
  onStop,
}) => {
  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const isLoading = state === 'loading';
  const isIdle = state === 'idle';

  return (
    <footer className="px-8 py-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 flex items-center justify-center gap-4 sticky bottom-0 z-20">
      <button 
        onClick={onStop}
        disabled={isIdle}
        className="p-3 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Stop"
      >
        <StopIcon className="w-6 h-6" />
      </button>

      {isPaused ? (
        <button
          onClick={onResume}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-900/50"
          aria-label="Resume"
        >
          <PlayIcon className="w-8 h-8" />
        </button>
      ) : (
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isLoading}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-wait"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <PauseIcon className="w-8 h-8" />
          ) : (
            <PlayIcon className="w-8 h-8" />
          )}
        </button>
      )}
      
      <div className="w-12 h-12"></div> {/* Spacer */}
    </footer>
  );
};
