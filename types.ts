export interface Speaker {
  id: string;
  name: string;
  voice: string;
}

export interface DialogueLine {
  id: string;
  speakerId: string;
  text: string;
}

export interface Script {
  styleInstructions: string;
  speakers: Speaker[];
  dialogue: DialogueLine[];
}

// FIX: Added missing type definitions for unused components to resolve compilation errors.
export interface VoiceSettings {
  voice: string;
  rate: number;
  pitch: number;
}

export interface Voice {
  name: string;
  value: string;
}

export interface GeneratedAudio {
  id: string;
  voiceName: string;
  text: string;
  audioSrc: string;
}

// FIX: Add missing PlaybackState type for PlaybackControls component.
export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';