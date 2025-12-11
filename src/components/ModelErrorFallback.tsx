interface ModelErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export default function ModelErrorFallback({
  error,
  resetError,
}: ModelErrorFallbackProps) {
  const isSTLError = error.message.includes("Invalid typed array length");
  const isLoadError = error.message.includes("Could not load");

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="max-w-md bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl border border-indigo-400/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="w-6 h-6 text-indigo-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-indigo-400">
            Failed to Load Model
          </h3>
        </div>

        <div className="mb-4">
          <div className="bg-gray-950 rounded p-3 border border-gray-700">
            <p className="text-xs text-gray-300 font-mono break-all">
              {error.message}
            </p>
          </div>
        </div>

        {isSTLError && (
          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-300 font-semibold">
              Possible causes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
              <li>The STL file may be corrupted or in an invalid format</li>
              <li>The file might be binary STL with incorrect header</li>
              <li>The file size might be too large for browser memory</li>
              <li>ASCII STL files should have proper formatting</li>
            </ul>
          </div>
        )}

        {isLoadError && !isSTLError && (
          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-300 font-semibold">
              Possible causes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
              <li>The file path may be incorrect</li>
              <li>The file may not exist in the public directory</li>
              <li>Network error while loading the file</li>
              <li>The file format may not be supported</li>
            </ul>
          </div>
        )}

        <button
          onClick={resetError}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
        >
          Select Different Model
        </button>
      </div>
    </div>
  );
}
