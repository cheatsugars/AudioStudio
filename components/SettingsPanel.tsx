import React, { useState } from 'react';
import { Speaker } from '../types';
import { VOICES } from '../constants';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UserIcon } from './icons/UserIcon';
import { UsersIcon } from './icons/UsersIcon';
import { CodeIcon } from './icons/CodeIcon';
import { HelpIcon } from './icons/HelpIcon';
import { CloseIcon } from './icons/CloseIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SettingsPanelProps {
  speakers: Speaker[];
  onAddSpeaker: () => void;
  onRemoveSpeaker: (speakerId: string) => void;
  onUpdateSpeaker: (speakerId: string, updatedSpeaker: Partial<Speaker>) => void;
  audioSrc: string | null;
  isLoading: boolean;
  error: string | null;
}

const PanelHeader: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
    <div className="flex items-center justify-between p-2 pl-4 border-b border-zinc-700">
        <h2 className="text-lg md:text-xl font-medium text-gray-200">{title}</h2>
        <div className="flex items-center">
            {children}
        </div>
    </div>
);

const Section: React.FC<{title: string; isOpenDefault?: boolean; children: React.ReactNode; onAdd?: () => void;}> = ({ title, isOpenDefault = true, children, onAdd }) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1">
              <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
              <h3 className="text-base md:text-lg font-medium text-gray-300">{title}</h3>
          </button>
          {onAdd && (
              <button onClick={onAdd} className="text-gray-400 hover:text-white" aria-label={`Add ${title}`}>
                  <PlusIcon className="w-5 h-5" />
              </button>
          )}
      </div>
      {isOpen && children}
    </div>
  );
};


export const SettingsPanel: React.FC<SettingsPanelProps> = ({ speakers, onAddSpeaker, onRemoveSpeaker, onUpdateSpeaker, audioSrc, isLoading, error }) => {
  const [mode, setMode] = useState<'single' | 'multi'>('multi');

  return (
    <div className="h-full grid grid-rows-[auto_1fr] bg-zinc-800">
        <PanelHeader title="Run settings">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded"><CodeIcon className="w-5 h-5" /></button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded"><HelpIcon className="w-5 h-5" /></button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-zinc-700 rounded"><CloseIcon className="w-5 h-5" /></button>
        </PanelHeader>

        <div className="p-4 overflow-y-auto space-y-6 min-h-0">
            <div>
                <label className="text-base md:text-lg font-medium text-gray-400">Model</label>
                 <select className="w-full mt-1 bg-zinc-700 border border-zinc-600 rounded-md p-2 text-base md:text-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Cheat Generative Audio Pro</option>
                </select>
            </div>
            
            <div>
                <label className="text-base md:text-lg font-medium text-gray-400">Mode</label>
                <div className="grid grid-cols-2 gap-1 mt-1 p-1 bg-zinc-900 rounded-md">
                    <button onClick={() => setMode('single')} className={`flex items-center justify-center gap-2 p-2 rounded text-sm md:text-base ${mode === 'single' ? 'bg-zinc-700 text-white' : 'text-gray-400 hover:bg-zinc-800'}`}>
                        <UserIcon className="w-4 h-4" /> Single-speaker audio
                    </button>
                    <button onClick={() => setMode('multi')} className={`flex items-center justify-center gap-2 p-2 rounded text-sm md:text-base ${mode === 'multi' ? 'bg-zinc-700 text-white' : 'text-gray-400 hover:bg-zinc-800'}`}>
                        <UsersIcon className="w-4 h-4" /> Multi-speaker audio
                    </button>
                </div>
            </div>

            <div className="border-t border-zinc-700 pt-4">
                <Section title="Voice settings" onAdd={onAddSpeaker}>
                  <div className="space-y-4">
                    {speakers.map((speaker, index) => (
                      <div key={speaker.id} className="p-3 bg-zinc-900/50 border border-zinc-700 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-base md:text-lg font-medium text-gray-300">Speaker {index + 1} settings</h4>
                          {speakers.length > 1 && (
                            <button onClick={() => onRemoveSpeaker(speaker.id)} className="text-zinc-500 hover:text-red-400" aria-label="Remove speaker">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm md:text-base font-medium text-gray-400">Name</label>
                            <input
                              type="text"
                              value={speaker.name}
                              onChange={(e) => onUpdateSpeaker(speaker.id, { name: e.target.value })}
                              className="w-full mt-1 bg-zinc-700 border border-zinc-600 rounded-md p-1.5 px-2 text-base md:text-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm md:text-base font-medium text-gray-400">Voice</label>
                            <select 
                              value={speaker.voice}
                              onChange={(e) => onUpdateSpeaker(speaker.id, { voice: e.target.value })}
                              className="w-full mt-1 bg-zinc-700 border border-zinc-600 rounded-md p-1.5 px-2 text-base md:text-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {VOICES.map(v => <option key={v.value} value={v.value}>{v.name}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
            </div>

            <div className="border-t border-zinc-700 pt-4">
              <Section title="Generated audio">
                 <div className="px-1 space-y-3">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-base md:text-lg text-zinc-400">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating audio...</span>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-400 text-sm md:text-base bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                            <p className="font-semibold mb-1">Error generating audio:</p>
                            <p className="text-xs md:text-sm">{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && audioSrc && (
                        <audio controls playsInline src={audioSrc} className="w-full h-10" />
                    )}
                    {!isLoading && !error && !audioSrc && (
                        <p className="text-base md:text-lg text-zinc-500">
                            Click "Run" to generate audio for your script.
                        </p>
                    )}
                </div>
              </Section>
            </div>
        </div>
    </div>
  );
};