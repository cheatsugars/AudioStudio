import React from 'react';
// FIX: Replaced non-existent text constants with the available script objects and imported the `Script` type.
import { MOVIE_SCENE_SCRIPT, PODCAST_TRANSCRIPT, AUDIO_VOICE_ASSISTANT } from '../constants';
import { Script } from '../types';

interface PresetPromptsProps {
  // FIX: Updated `onLoadPreset` to accept a `Script` object instead of a string.
  onLoadPreset: (preset: Script) => void;
}

const PresetButton: React.FC<{onClick: () => void; children: React.ReactNode;}> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
    >
        {children}
    </button>
);

export const PresetPrompts: React.FC<PresetPromptsProps> = ({ onLoadPreset }) => {
  return (
    <div className="px-8 py-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Demo Examples</h3>
        <div className="flex flex-wrap gap-3">
            {/* FIX: Updated onClick handler and button label to reflect available script data. */}
            <PresetButton onClick={() => onLoadPreset(MOVIE_SCENE_SCRIPT)}>
                Movie scene script
            </PresetButton>
            {/* FIX: Updated onClick handler and button label to reflect available script data. */}
            <PresetButton onClick={() => onLoadPreset(PODCAST_TRANSCRIPT)}>
                Podcast transcript
            </PresetButton>
            {/* FIX: Updated onClick handler and button label to reflect available script data. */}
            <PresetButton onClick={() => onLoadPreset(AUDIO_VOICE_ASSISTANT)}>
                Audio voice assistant
            </PresetButton>
        </div>
    </div>
  );
};
