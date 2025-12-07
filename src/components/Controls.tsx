interface ControlsProps {
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  gridVisible: boolean;
  setGridVisible: (value: boolean) => void;
  onReset: () => void;
}

export default function Controls({
  autoRotate,
  setAutoRotate,
  gridVisible,
  setGridVisible,
  onReset,
}: ControlsProps) {
  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-3 z-30 min-w-[200px]">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">Controls</h3>

      <div className="flex items-center justify-between">
        <label
          htmlFor="autoRotate"
          className="text-sm text-gray-700 cursor-pointer"
        >
          Auto Rotate
        </label>
        <input
          id="autoRotate"
          type="checkbox"
          checked={autoRotate}
          onChange={(e) => setAutoRotate(e.target.checked)}
          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between">
        <label
          htmlFor="gridVisible"
          className="text-sm text-gray-700 cursor-pointer"
        >
          Show Grid
        </label>
        <input
          id="gridVisible"
          type="checkbox"
          checked={gridVisible}
          onChange={(e) => setGridVisible(e.target.checked)}
          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
      </div>

      <button
        onClick={onReset}
        className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Reset View
      </button>

      <div className="pt-3 mt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Mouse Controls:</strong>
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
