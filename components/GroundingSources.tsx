import React from 'react';
import { GroundingMetadata } from '../types';
import { ExternalLink, MapPin, Search } from 'lucide-react';

interface GroundingSourcesProps {
  metadata: GroundingMetadata;
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ metadata }) => {
  if (!metadata.groundingChunks || metadata.groundingChunks.length === 0) {
    return null;
  }

  const webSources = metadata.groundingChunks.filter(c => c.web);
  const mapSources = metadata.groundingChunks.filter(c => c.maps);

  if (webSources.length === 0 && mapSources.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-3">
      {/* Web Sources */}
      {webSources.length > 0 && (
        <div className="text-xs text-slate-500">
          <div className="flex items-center gap-1 mb-2 font-semibold uppercase tracking-wider">
            <Search className="w-3 h-3" />
            <span>Sources</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {webSources.map((chunk, index) => (
              <a
                key={`web-${index}`}
                href={chunk.web?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 rounded-md px-3 py-2 transition-all shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">
                    {chunk.web?.title || "Source Link"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    {new URL(chunk.web?.uri || 'http://google.com').hostname}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-teal-500 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Map Sources */}
      {mapSources.length > 0 && (
        <div className="text-xs text-slate-500 mt-1">
          <div className="flex items-center gap-1 mb-2 font-semibold uppercase tracking-wider">
            <MapPin className="w-3 h-3" />
            <span>Locations</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mapSources.map((chunk, index) => (
              <a
                key={`map-${index}`}
                href={chunk.maps?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg p-3 transition-all shadow-sm group"
              >
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:bg-white group-hover:text-blue-500 transition-colors">
                   <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-slate-800 truncate w-full text-sm">
                    {chunk.maps?.title || "Location"}
                  </span>
                  {/* Try to find snippet if available */}
                  {chunk.maps?.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.content && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                      "{chunk.maps.placeAnswerSources[0].reviewSnippets[0].content}"
                    </p>
                  )}
                  <span className="text-[10px] text-blue-500 mt-1 font-medium">View on Maps &rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroundingSources;
