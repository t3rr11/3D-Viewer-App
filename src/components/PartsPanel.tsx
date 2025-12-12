import { useState, useEffect } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const allVisible = parts.every((p) => p.visible);

  return (
    <>
      {/* Mobile: Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden absolute top-2 right-2 z-40 p-2.5 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 hover:bg-gray-800 transition-colors touch-manipulation"
        aria-label="Toggle parts panel"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Parts Panel */}
      <div
        className={`absolute top-2 sm:top-4 right-2 sm:right-4 rounded-lg z-40 transition-all duration-300 ease-in-out overflow-hidden sm:bg-gray-900/95 sm:backdrop-blur-sm sm:shadow-xl ${
          isOpen || window.innerWidth >= 640 ? (expanded ? "max-h-[60vh] sm:max-h-[calc(100%-2rem)] border border-gray-700 bg-gray-900/95 backdrop-blur-sm shadow-xl" : "max-h-12 sm:max-h-14 border border-gray-700 bg-gray-900/95 backdrop-blur-sm shadow-xl") : "max-h-0 border-0 p-0 sm:max-h-[calc(100%-2rem)] sm:border sm:border-gray-700"
        } w-[calc(100vw-1rem)] sm:w-64 max-w-sm`}
      >
        <div className="flex items-center justify-between p-2.5 sm:p-3 border-b border-gray-700">
          <h3 className="text-xs sm:text-sm font-semibold text-white">
            Parts ({parts.length})
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="hidden sm:block text-gray-400 hover:text-white transition-colors p-1 touch-manipulation"
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
        </div>

      {expanded && (
        <>
          <div className="max-h-[calc(60vh-8rem)] sm:max-h-[calc(100%-8rem)] overflow-y-auto">
            {parts.map((part, index) => {
              const isSelected = selectedPartIndices.includes(index);
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2.5 sm:p-3 hover:bg-gray-800/50 active:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0 cursor-pointer touch-manipulation ${
                    isSelected ? "bg-cyan-900/30 border-cyan-500/50" : ""
                  }`}
                  onClick={(e) => onPartClick?.(index, e.ctrlKey || e.metaKey)}
                >
                  <span
                    className={`text-xs flex-1 truncate mr-2 ${
                      isSelected ? "text-cyan-300 font-medium" : "text-gray-300"
                    }`}
                    title={part.name}
                  >
                    {part.name}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={part.visible}
                      onChange={(e) => {
                        e.stopPropagation();
                        onTogglePart(index);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 sm:w-9 sm:h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 sm:after:h-4 sm:after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 sm:p-3 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2 text-center hidden sm:block">
              Ctrl+Click to multi-select
            </p>
            <button
              onClick={() => onToggleAll(!allVisible)}
              className="w-full px-3 py-2 sm:py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm rounded transition-colors touch-manipulation"
            >
              {allVisible ? "Hide All" : "Show All"}
            </button>
          </div>
        </>
      )}
      </div>
    </>
  );
}
