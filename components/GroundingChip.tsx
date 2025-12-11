import React from 'react';
import { GroundingChunk } from '../types';

interface GroundingChipProps {
  chunk: GroundingChunk;
}

export const GroundingChip: React.FC<GroundingChipProps> = ({ chunk }) => {
  if (chunk.maps) {
    return (
      <a
        href={chunk.maps.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group w-full sm:w-auto"
      >
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-gray-900 truncate group-hover:text-brand-600">
            {chunk.maps.title}
          </span>
          <span className="text-xs text-gray-500">Abrir no Google Maps</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-auto text-gray-400 group-hover:text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  if (chunk.web) {
    return (
      <a
        href={chunk.web.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-brand-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span className="truncate max-w-[200px]">{chunk.web.title}</span>
      </a>
    );
  }

  return null;
};