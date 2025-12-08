import { useState } from "react";

interface Part {
  name: string;
  visible: boolean;
}

interface PartsPanelProps {
  parts: Part[];
  onTogglePart: (index: number) => void;
  onToggleAll: (visible: boolean) => void;
  selectedPartIndices?: number[];
  onPartClick?: (index: number, ctrlKey: boolean) => void;
}

export default function PartsPanel({
  parts,
  onTogglePart,
  onToggleAll,
  selectedPartIndices = [],
  onPartClick,
}: PartsPanelProps) {
  const [expanded, setExpanded] = useState(true);
  const allVisible = parts.every((p) => p.visible);

  return (
    <div className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 w-54 h-[calc(100%-2rem)] z-40">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-white">
          Parts ({parts.length})
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {expanded && (
        <>
          <div className="max-h-[calc(100%-8rem)] overflow-y-auto">
            {parts.map((part, index) => {
              const isSelected = selectedPartIndices.includes(index);
              return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-b-0 cursor-pointer ${
                  isSelected ? 'bg-cyan-900/30 border-cyan-500/50' : ''
                }`}
                onClick={(e) => onPartClick?.(index, e.ctrlKey || e.metaKey)}
              >
                <span
                  className={`text-xs flex-1 truncate ${
                    isSelected ? 'text-cyan-300 font-medium' : 'text-gray-300'
                  }`}
                  title={part.name}
                >
                  {part.name}
                </span>
                <label className="relative inline-flex items-center cursor-pointer ml-2">
                  <input
                    type="checkbox"
                    checked={part.visible}
                    onChange={() => onTogglePart(index)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2 text-center">
              Ctrl+Click to multi-select
            </p>
            <button
              onClick={() => onToggleAll(!allVisible)}
              className="w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
            >
              {allVisible ? "Hide All" : "Show All"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
