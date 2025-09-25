import React from 'react';

interface TextEditorProps {
  text: string;
  onTextChange: (newText: string) => void;
}

export const DialogueEditor: React.FC<TextEditorProps> = ({
  text,
  onTextChange,
}) => {
  return (
    <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full h-full bg-slate-800/50 p-4 text-lg text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 placeholder-slate-500 border-t border-slate-700"
        placeholder="Enter text to generate speech..."
        aria-label="Text to synthesize"
    />
  );
};
