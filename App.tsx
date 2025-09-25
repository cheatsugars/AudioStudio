import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Script, Speaker, DialogueLine } from './types';
import { MOVIE_SCENE_SCRIPT, SPEAKER_COLORS, VOICES } from './constants';
import { Header } from './components/Header';
import { RawStructurePanel } from './components/RawStructurePanel';
import { ScriptBuilder } from './components/ScriptBuilder';
import { SettingsPanel } from './components/SettingsPanel';
import { BottomBar } from './components/BottomBar';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { ScriptIcon } from './components/icons/ScriptIcon';
import { CodeIcon } from './components/icons/CodeIcon';

// Helper for writing strings to a DataView
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

// Converts raw PCM audio data (base64) into a playable WAV audio object URL.
const pcmToWavUrl = (base64Pcm: string): string => {
    const pcmData = atob(base64Pcm);
    const pcmBytes = new Uint8Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      pcmBytes[i] = pcmData.charCodeAt(i);
    }

    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const dataSize = pcmBytes.length;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    new Uint8Array(buffer, 44).set(pcmBytes);

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
};

type ActiveTab = 'structure' | 'script' | 'settings';

const TabButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors ${isActive ? 'text-indigo-400 bg-zinc-700/50' : 'text-gray-400 hover:bg-zinc-700'}`}>
        {icon}
        <span>{label}</span>
    </button>
);


function App() {
  const [script, setScript] = useState<Script>(MOVIE_SCENE_SCRIPT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('script');

  const { speakers, dialogue } = script;

  const speakerMap = useMemo(() => {
    const map = new Map<string, Speaker>();
    speakers.forEach(s => map.set(s.id, s));
    return map;
  }, [speakers]);

  const speakerColorMap = useMemo(() => {
    const map = new Map<string, string>();
    speakers.forEach((s, i) => map.set(s.id, SPEAKER_COLORS[i % SPEAKER_COLORS.length]));
    return map;
  }, [speakers]);
  
  useEffect(() => {
    // Clean up the object URL to avoid memory leaks when the component unmounts or the src changes.
    return () => {
        if (audioSrc) {
            URL.revokeObjectURL(audioSrc);
        }
    };
  }, [audioSrc]);

  const handleLoadPreset = useCallback((preset: Script) => {
    setScript(preset);
    if (audioSrc) URL.revokeObjectURL(audioSrc);
    setAudioSrc(null);
    setError(null);
  }, [audioSrc]);

  const handleStyleInstructionsChange = (newInstructions: string) => {
    setScript(prev => ({...prev, styleInstructions: newInstructions}));
  };

  const handleDialogueChange = (lineId: string, newText: string) => {
    setScript(prev => ({
      ...prev,
      dialogue: prev.dialogue.map(line => 
        line.id === lineId ? { ...line, text: newText } : line
      )
    }));
  };

  const handleAddDialogueLine = () => {
    if (speakers.length === 0) return;
    const lastLine = dialogue[dialogue.length - 1];
    const lastSpeakerIndex = lastLine ? speakers.findIndex(s => s.id === lastLine.speakerId) : -1;
    const nextSpeakerIndex = (lastSpeakerIndex + 1) % speakers.length;
    
    const newLine: DialogueLine = {
      id: `line-${Date.now()}`,
      speakerId: speakers[nextSpeakerIndex].id,
      text: '',
    };
    setScript(prev => ({...prev, dialogue: [...prev.dialogue, newLine]}));
  };
  
  const handleRemoveDialogueLine = (lineId: string) => {
    setScript(prev => ({
      ...prev,
      dialogue: prev.dialogue.filter(line => line.id !== lineId)
    }));
  };
  
  const handleAddSpeaker = () => {
    const newSpeakerNumber = speakers.length + 1;
    const newSpeaker: Speaker = {
      id: `speaker-${Date.now()}`,
      name: `Speaker ${newSpeakerNumber}`,
      voice: VOICES[0].value,
    };
    setScript(prev => ({...prev, speakers: [...prev.speakers, newSpeaker]}));
  };

  const handleRemoveSpeaker = (speakerId: string) => {
    setScript(prev => {
      const newSpeakers = prev.speakers.filter(s => s.id !== speakerId);
      const newDialogue = prev.dialogue.filter(d => d.speakerId !== speakerId);
      const remainingSpeakerId = newSpeakers.length > 0 ? newSpeakers[0].id : null;
      if (remainingSpeakerId) {
        return {
          ...prev,
          speakers: newSpeakers,
          dialogue: prev.dialogue.map(d => d.speakerId === speakerId ? {...d, speakerId: remainingSpeakerId} : d)
        };
      }
      return { ...prev, speakers: newSpeakers, dialogue: newDialogue };
    });
  };

  const handleUpdateSpeaker = (speakerId: string, updatedSpeaker: Partial<Speaker>) => {
    setScript(prev => ({
      ...prev,
      speakers: prev.speakers.map(s => s.id === speakerId ? {...s, ...updatedSpeaker} : s)
    }));
  };
  
  const handleRunScript = async () => {
    setIsLoading(true);
    setError(null);
    if (audioSrc) URL.revokeObjectURL(audioSrc);
    setAudioSrc(null);

    const promptText = `${script.styleInstructions}\n\nTTS the following conversation between ${script.speakers.map(s => s.name).join(' and ')}:\n` +
        script.dialogue.map(line => {
            const speakerName = speakerMap.get(line.speakerId)?.name || 'Unknown Speaker';
            return `${speakerName}: ${line.text}`;
        }).join('\n');

    const requestBody = {
      model: "gemini-2.5-flash-preview-tts",
      contents: [{
        parts:[{ "text": promptText }]
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: script.speakers.map(speaker => ({
              speaker: speaker.name,
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: speaker.voice
                }
              }
            }))
          }
        }
      }
    };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${process.env.API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            }
        );
        
        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data?.error?.message || `HTTP error! status: ${response.status}`);
        }

        const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (audioData) {
            const wavUrl = pcmToWavUrl(audioData);
            setAudioSrc(wavUrl);
        } else {
            if(data.candidates?.[0]?.finishReason === 'SAFETY') {
                 throw new Error('Content blocked due to safety ratings. Please modify the script.');
            }
            throw new Error('No audio content in API response.');
        }
    } catch (e: any) {
        setError(e.message || 'Failed to generate audio.');
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-zinc-900 text-gray-300 flex flex-col font-sans overflow-hidden">
      <Header />
       {/* Mobile Tab Navigation */}
      <div className="md:hidden flex-shrink-0 flex items-center justify-around border-b border-zinc-700 bg-zinc-800">
          <TabButton icon={<CodeIcon className="w-5 h-5" />} label="Structure" isActive={activeTab === 'structure'} onClick={() => setActiveTab('structure')} />
          <TabButton icon={<ScriptIcon className="w-5 h-5" />} label="Script" isActive={activeTab === 'script'} onClick={() => setActiveTab('script')} />
          <TabButton icon={<SettingsIcon className="w-5 h-5" />} label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      <div className="flex-1 grid md:grid-cols-12 gap-px bg-zinc-700 overflow-hidden">
        <div className={`${activeTab === 'structure' ? 'flex' : 'hidden'} md:flex md:col-span-3 bg-zinc-800/70 flex-col min-h-0`}>
          <RawStructurePanel script={script} />
        </div>
        <div className={`${activeTab === 'script' ? 'flex' : 'hidden'} md:flex md:col-span-6 bg-zinc-800 flex-col min-h-0`}>
          <ScriptBuilder 
            script={script}
            speakerMap={speakerMap}
            speakerColorMap={speakerColorMap}
            currentLineId={null} // Playback highlighting is removed
            onStyleInstructionsChange={handleStyleInstructionsChange}
            onDialogueChange={handleDialogueChange}
            onAddDialogueLine={handleAddDialogueLine}
            onRemoveDialogueLine={handleRemoveDialogueLine}
          />
        </div>
        <div className={`${activeTab === 'settings' ? 'flex' : 'hidden'} md:flex md:col-span-3 bg-zinc-800 flex-col min-h-0`}>
          <SettingsPanel 
            speakers={speakers}
            onAddSpeaker={handleAddSpeaker}
            onRemoveSpeaker={handleRemoveSpeaker}
            onUpdateSpeaker={handleUpdateSpeaker}
            audioSrc={audioSrc}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
      <BottomBar 
        isRunning={isLoading}
        onRun={handleRunScript}
        onLoadPreset={handleLoadPreset} 
      />
    </div>
  );
}

export default App;