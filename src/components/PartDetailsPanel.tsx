interface PartDetailsPanelProps {
  partName: string;
  partIndices: number[];
  instanceCount: number;
  onClose: () => void;
  isMultiSelect: boolean;
  parts?: { name: string; url: string }[];
}

export default function PartDetailsPanel({
  partName,
  partIndices,
  instanceCount,
  onClose,
  isMultiSelect,
  parts,
}: PartDetailsPanelProps) {
  // Calculate breakdown of selected parts by name
  const partBreakdown = isMultiSelect && parts ? (() => {
    const breakdown = new Map<string, number[]>();
    partIndices.forEach(idx => {
      const name = parts[idx].name;
      if (!breakdown.has(name)) {
        breakdown.set(name, []);
      }
      breakdown.get(name)!.push(idx + 1);
    });
    return Array.from(breakdown.entries()).map(([name, ids]) => ({
      name,
      ids,
      count: ids.length
    }));
  })() : [];

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 w-[calc(100vw-1rem)] sm:w-80 max-w-sm max-h-[50vh] sm:max-h-[calc(100vh-8rem)] flex flex-col z-40">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          {isMultiSelect ? "Selection Details" : "Part Details"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 touch-manipulation"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 overflow-y-auto">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {isMultiSelect ? "Selection" : "Name"}
          </p>
          <p className="text-sm text-white font-medium">{partName}</p>
        </div>

        {!isMultiSelect && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Part Number
            </p>
            <p className="text-sm text-white">{partIndices[0] + 1}</p>
          </div>
        )}

        {isMultiSelect && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Selected Parts
            </p>
            <p className="text-sm text-white">{partIndices.length} parts</p>
          </div>
        )}

        {isMultiSelect && partBreakdown.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Breakdown
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {partBreakdown.map((item, idx) => (
                <div key={idx} className="bg-gray-800/50 rounded p-2">
                  <p className="text-xs text-cyan-300 font-medium mb-1 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      Count: <span className="text-white">{item.count}</span>
                    </span>
                    <span className="text-gray-400">
                      IDs: <span className="text-white">{item.ids.join(", ")}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {isMultiSelect ? "Total Instances" : "Instances"}
          </p>
          <p className="text-sm text-white">{instanceCount}</p>
        </div>

        <div className="pt-3 border-t border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg
              className="w-4 h-4 text-indigo-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>All instances are highlighted in cyan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
