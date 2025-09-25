import React from 'react';
import { PlusIcon } from './icons/PlusIcon';

const BreadcrumbArrow = () => (
    <svg className="w-5 h-5 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
)

export const Header: React.FC = () => {
  return (
    <header className="h-16 flex-shrink-0 px-4 bg-zinc-900 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button className="p-2 rounded hover:bg-zinc-700">
                <svg className="w-6 h-6 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <span className="font-medium text-lg text-gray-200">CHEAT Generative Audio</span>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-zinc-700" aria-label="Save prompt">
                <svg className="w-5 h-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H7.5A2.25 2.25 0 0 0 5.25 6v13.5A2.25 2.25 0 0 0 7.5 21.75h9a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 16.5 3.75Z" />
                </svg>
            </button>
             <button className="p-2 rounded-full hover:bg-zinc-700" aria-label="Add new prompt">
                <PlusIcon className="w-5 h-5 text-gray-300" />
            </button>
        </div>
    </header>
  );
};