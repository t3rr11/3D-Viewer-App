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
  return (
    <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 p-4 space-y-3 z-30 min-w-60">
      <h3 className="font-semibold text-white text-sm mb-3">Controls</h3>

      <div className="flex items-center justify-between">
        <label
          htmlFor="autoRotate"
          className="text-sm text-gray-300 cursor-pointer"
        >
          Auto Rotate
        </label>
        <input
          id="autoRotate"
          type="checkbox"
          checked={autoRotate}
          onChange={(e) => setAutoRotate(e.target.checked)}
          className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="gridVisible"
          className="text-sm text-gray-300 cursor-pointer"
        >
          Show Grid
        </label>
        <input
          id="gridVisible"
          type="checkbox"
          checked={gridVisible}
          onChange={(e) => setGridVisible(e.target.checked)}
          className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      {rotation && onRotationChange && (
        <div className="pt-3 mt-3 border-t border-gray-800">
          <h4 className="text-xs font-semibold text-gray-300 mb-4">
            Model Rotation
          </h4>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400 w-12 shrink-0">
                X: {rotation.x.toFixed(0)}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation.x}
                onChange={(e) => onRotationChange("x", Number(e.target.value))}
                onDoubleClick={() => onRotationChange("x", 0)}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400 w-12 shrink-0">
                Y: {rotation.y.toFixed(0)}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation.y}
                onChange={(e) => onRotationChange("y", Number(e.target.value))}
                onDoubleClick={() => onRotationChange("y", 0)}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-400 w-12 shrink-0">
                Z: {rotation.z.toFixed(0)}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation.z}
                onChange={(e) => onRotationChange("z", Number(e.target.value))}
                onDoubleClick={() => onRotationChange("z", 0)}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Reset View
      </button>

      <div className="pt-3 mt-3 border-t border-gray-800">
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
  );
}
