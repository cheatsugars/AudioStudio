import React from 'react';
import { Script } from '../types';

interface RawStructurePanelProps {
  script: Script;
}

export const RawStructurePanel: React.FC<RawStructurePanelProps> = ({ script }) => {
  const { styleInstructions, dialogue, speakers } = script;

  const speakerMap = React.useMemo(() => new Map(speakers.map(s => [s.id, s.name])), [speakers]);

  const rawText = `${styleInstructions}\n\n` +
    dialogue.map(line => `${speakerMap.get(line.speakerId) || 'Unknown Speaker'}: ${line.text}`).join('\n');

  return (
    <div className="h-full grid grid-rows-[auto_1fr]">
      <div className="p-4 border-b border-zinc-700">
        <h2 className="font-medium text-base md:text-lg text-gray-200">Raw structure</h2>
        <p className="text-sm md:text-base text-gray-400 mt-1">
          The below reflects how to structure your script in your API request.
        </p>
      </div>
      <div className="p-4 overflow-y-auto min-h-0">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm md:text-base text-gray-400">
          {rawText}
        </pre>
      </div>
    </div>
  );
};