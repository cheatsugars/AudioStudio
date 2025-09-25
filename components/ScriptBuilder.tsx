import React from 'react';
import { Script, Speaker } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ScriptBuilderProps {
  script: Script;
  speakerMap: Map<string, Speaker>;
  speakerColorMap: Map<string, string>;
  currentLineId: string | null;
  onStyleInstructionsChange: (value: string) => void;
  onDialogueChange: (lineId: string, text: string) => void;
  onAddDialogueLine: () => void;
  onRemoveDialogueLine: (lineId: string) => void;
}

const AutoGrowTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [props.value]);

    return <textarea ref={textareaRef} {...props} />;
};

export const ScriptBuilder: React.FC<ScriptBuilderProps> = ({
  script,
  speakerMap,
  speakerColorMap,
  onStyleInstructionsChange,
  onDialogueChange,
  onAddDialogueLine,
  onRemoveDialogueLine,
}) => {
  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="p-4 border-b border-zinc-700">
        <h2 className="font-medium text-lg md:text-xl text-gray-200">Script builder</h2>
      </div>
      <div className="px-4 pt-4 pb-32 space-y-6 overflow-y-auto min-h-0">
        <div>
          <label className="text-base md:text-lg font-medium text-gray-400">Style Instructions</label>
          <input
            type="text"
            value={script.styleInstructions}
            onChange={(e) => onStyleInstructionsChange(e.target.value)}
            className="w-full mt-1 bg-zinc-700/50 border border-zinc-600 rounded-md p-2 text-lg md:text-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Read aloud in a warm, welcoming tone"
          />
        </div>
        <div className="space-y-4">
          {script.dialogue.map((line) => {
            const speaker = speakerMap.get(line.speakerId);
            const speakerColor = speaker ? speakerColorMap.get(speaker.id) : '#ffffff';
            return (
              <div key={line.id} className="flex gap-3 group transition-colors rounded-lg">
                <div className="flex-1 p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: speakerColor }}></div>
                    <span className="text-base md:text-lg font-medium text-gray-300">{speaker?.name || 'Unknown Speaker'}</span>
                  </div>
                  <AutoGrowTextarea
                    value={line.text}
                    onChange={(e) => onDialogueChange(line.id, e.target.value)}
                    className="w-full bg-zinc-700/50 border border-zinc-600 rounded-md p-2 text-lg md:text-xl text-gray-200 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter dialogue..."
                    rows={1}
                  />
                </div>
                <button 
                  onClick={() => onRemoveDialogueLine(line.id)}
                  className="mt-8 mr-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove dialogue line"
                >
                    <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            );
          })}
        </div>
        <div>
          <button
            onClick={onAddDialogueLine}
            className="w-full flex items-center justify-center gap-2 text-lg md:text-xl text-gray-400 border border-dashed border-zinc-600 rounded-lg p-3 hover:bg-zinc-700/50 hover:text-gray-300 hover:border-zinc-500 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add dialog
          </button>
        </div>
      </div>
    </div>
  );
};