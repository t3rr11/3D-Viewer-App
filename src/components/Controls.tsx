import { useState } from "react";

interface ControlsProps {
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  gridVisible: boolean;
  setGridVisible: (value: boolean) => void;
  onReset: () => void;
  rotation?: { x: number; y: number; z: number };
  onRotationChange?: (axis: "x" | "y" | "z", value: number) => void;
}

export default function Controls({
  autoRotate,
  setAutoRotate,
  gridVisible,
  setGridVisible,
  onReset,
  rotation,
  onRotationChange,
}: ControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile: Floating toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="sm:hidden absolute top-2 left-2 z-30 p-2.5 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 hover:bg-gray-800 transition-colors touch-manipulation"
        aria-label="Toggle controls"
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      {/* Controls Panel */}
      <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 rounded-lg z-30 min-w-60 max-w-[calc(100vw-1rem)] sm:max-w-none transition-all duration-300 overflow-hidden sm:bg-gray-900/90 sm:backdrop-blur-sm sm:shadow-lg ${
        isExpanded ? 'max-h-[70vh] p-3 sm:p-4 space-y-2 sm:space-y-3 border border-gray-800 bg-gray-900/90 backdrop-blur-sm shadow-lg' : 'max-h-0 p-0 border-0 sm:max-h-none sm:p-4 sm:space-y-3 sm:border sm:border-gray-800'
      }`}>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-semibold text-white text-xs sm:text-sm">Controls</h3>
          <button
            onClick={() => setIsExpanded(false)}
            className="sm:hidden text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="autoRotate"
          className="text-xs sm:text-sm text-gray-300 cursor-pointer"
        >
          Auto Rotate
        </label>
        <input
          id="autoRotate"
          type="checkbox"
          checked={autoRotate}
          onChange={(e) => setAutoRotate(e.target.checked)}
          className="w-5 h-5 sm:w-4 sm:h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer touch-manipulation"
        />
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="gridVisible"
          className="text-xs sm:text-sm text-gray-300 cursor-pointer"
        >
          Show Grid
        </label>
        <input
          id="gridVisible"
          type="checkbox"
          checked={gridVisible}
          onChange={(e) => setGridVisible(e.target.checked)}
          className="w-5 h-5 sm:w-4 sm:h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer touch-manipulation"
        />
      </div>

      {rotation && onRotationChange && (
        <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-800">
          <h4 className="text-xs font-semibold text-gray-300 mb-3 sm:mb-4">
            Model Rotation
          </h4>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-xs text-gray-400 w-14 sm:w-12 shrink-0">
                X: {rotation.x.toFixed(0)}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation.x}
                onChange={(e) => onRotationChange("x", Number(e.target.value))}
                onDoubleClick={() => onRotationChange("x", 0)}
                className="flex-1 h-2 sm:h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-xs text-gray-400 w-14 sm:w-12 shrink-0">
                Y: {rotation.y.toFixed(0)}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation.y}
                onChange={(e) => onRotationChange("y", Number(e.target.value))}
                onDoubleClick={() => onRotationChange("y", 0)}
                className="flex-1 h-2 sm:h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-xs text-gray-400 w-14 sm:w-12 shrink-0">
                Z: {rotation.z.toFixed(0)}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation.z}
                onChange={(e) => onRotationChange("z", Number(e.target.value))}
                onDoubleClick={() => onRotationChange("z", 0)}
                className="flex-1 h-2 sm:h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full mt-2 px-4 py-2.5 sm:py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-manipulation"
      >
        Reset View
      </button>

      <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-800 hidden sm:block">
        <p className="text-xs text-gray-400">
          <strong className="text-gray-300">Mouse Controls:</strong>
          <br />
          Left: Rotate
          <br />
          Right: Pan
          <br />
          Scroll: Zoom
        </p>
      </div>
      </div>
    </>
  );
}
