import React from 'react';
import { VoiceSettings, Voice, GeneratedAudio } from '../types';
import { TrashIcon } from './icons/TrashIcon';

const Slider: React.FC<{label: string; value: number; min: number; max: number; step: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = 
({ label, value, min, max, step, onChange }) => (
    <div>
        <label className="flex justify-between items-center text-sm font-medium text-slate-400">
            <span>{label}</span>
            <span className="text-slate-300 font-mono text-xs">{value.toFixed(2)}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-indigo-500 [&::-moz-range-thumb]:rounded-full"
        />
    </div>
);

interface RightPanelProps {
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: VoiceSettings) => void;
  voices: Voice[];
  onGenerate: () => void;
  isGenerating: boolean;
  generatedAudios: GeneratedAudio[];
  onRemoveAudio: (id: string) => void;
}


export const SpeakerConfigPanel: React.FC<RightPanelProps> = ({
  settings,
  onUpdateSettings,
  voices,
  onGenerate,
  isGenerating,
  generatedAudios,
  onRemoveAudio,
}) => {
  return (
    <aside className="w-full md:w-96 flex-shrink-0 bg-slate-800/50 border-l border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-slate-200 mb-6">Voice Configuration</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="voice-select" className="block text-sm font-medium text-slate-400 mb-1">Voice</label>
            <select
              id="voice-select"
              value={settings.voice}
              onChange={(e) => onUpdateSettings({ ...settings, voice: e.target.value })}
              className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {voices.map((voice) => (
                <option key={voice.value} value={voice.value}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
          <Slider 
            label="Speaking Rate"
            value={settings.rate}
            min={0.25} max={4.0} step={0.05}
            onChange={(e) => onUpdateSettings({ ...settings, rate: parseFloat(e.target.value)})}
          />
          <Slider 
            label="Pitch"
            value={settings.pitch}
            min={-20.0} max={20.0} step={0.5}
            onChange={(e) => onUpdateSettings({ ...settings, pitch: parseFloat(e.target.value)})}
          />
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-wait"
        >
          {isGenerating && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <h3 className="p-6 pb-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Generated Audio
        </h3>
        {generatedAudios.length === 0 ? (
          <p className="px-6 text-slate-500 text-sm">Your generated audio clips will appear here.</p>
        ) : (
          <div className="space-y-3 p-6 pt-2">
            {generatedAudios.map(audio => (
              <div key={audio.id} className="bg-slate-900/70 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-400">{audio.voiceName}</span>
                  <button onClick={() => onRemoveAudio(audio.id)} className="text-slate-500 hover:text-red-500 p-1" aria-label="Remove audio">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 truncate mb-3">"{audio.text}"</p>
                <audio controls src={audio.audioSrc} className="w-full h-10" />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
