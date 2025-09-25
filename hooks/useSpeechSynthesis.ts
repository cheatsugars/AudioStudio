
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechSynthesisOptions {
  onQueueEnd?: () => void;
  onLineStart?: (lineId: string) => void;
}

export const useSpeechSynthesis = (options: SpeechSynthesisOptions) => {
  const { onQueueEnd, onLineStart } = options;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const utteranceQueue = useRef<SpeechSynthesisUtterance[]>([]);
  const lineIdQueue = useRef<string[]>([]);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const updateVoices = useCallback(() => {
    setVoices(window.speechSynthesis.getVoices());
  }, []);

  useEffect(() => {
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [updateVoices]);

  const speak = useCallback((utterance: SpeechSynthesisUtterance, lineId: string) => {
    utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
        currentUtterance.current = utterance;
        if(onLineStart) onLineStart(lineId);
    };

    utterance.onend = () => {
      if (utteranceQueue.current.length > 0) {
        const nextUtterance = utteranceQueue.current.shift()!;
        const nextLineId = lineIdQueue.current.shift()!;
        speak(nextUtterance, nextLineId);
      } else {
        setSpeaking(false);
        setPaused(false);
        currentUtterance.current = null;
        if (onQueueEnd) onQueueEnd();
      }
    };
    
    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      // Skip to next item in queue
      if (utteranceQueue.current.length > 0) {
        const nextUtterance = utteranceQueue.current.shift()!;
        const nextLineId = lineIdQueue.current.shift()!;
        speak(nextUtterance, nextLineId);
      } else {
        setSpeaking(false);
        setPaused(false);
        if (onQueueEnd) onQueueEnd();
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [onQueueEnd, onLineStart]);

  const speakQueue = useCallback((utterances: SpeechSynthesisUtterance[], lineIds: string[]) => {
    if (utterances.length === 0) return;
    
    window.speechSynthesis.cancel();
    utteranceQueue.current = [...utterances];
    lineIdQueue.current = [...lineIds];

    const firstUtterance = utteranceQueue.current.shift()!;
    const firstLineId = lineIdQueue.current.shift()!;
    speak(firstUtterance, firstLineId);
  }, [speak]);

  const pause = useCallback(() => {
    if (speaking && !paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [speaking, paused]);

  const resume = useCallback(() => {
    if (speaking && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, [speaking, paused]);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    utteranceQueue.current = [];
    lineIdQueue.current = [];
    currentUtterance.current = null;
  }, []);

  return { voices, speaking, paused, speakQueue, pause, resume, cancel };
};
