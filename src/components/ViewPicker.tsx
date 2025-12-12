interface ViewPickerProps {
  onViewChange: (view: string) => void;
}

export default function ViewPicker({ onViewChange }: ViewPickerProps) {
  return (
    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-30 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 p-2 sm:p-3">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {/* Top row */}
        <div />
        <button
          onClick={() => onViewChange("Top")}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center touch-manipulation"
          title="Top View"
        >
          T
        </button>
        <div />

        {/* Middle row */}
        <button
          onClick={() => onViewChange("Left")}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center touch-manipulation"
          title="Left View (West)"
        >
          W
        </button>
        <button
          onClick={() => onViewChange("Front")}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center touch-manipulation"
          title="Front View (South)"
        >
          S
        </button>
        <button
          onClick={() => onViewChange("Right")}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center touch-manipulation"
          title="Right View (East)"
        >
          E
        </button>

        {/* Bottom row */}
        <div />
        <button
          onClick={() => onViewChange("Back")}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center touch-manipulation"
          title="Back View (North)"
        >
          N
        </button>
        <div />
      </div>

      {/* Bottom button */}
      <button
        onClick={() => onViewChange("Bottom")}
        className="w-full mt-1.5 sm:mt-2 h-7 sm:h-8 bg-gray-800 hover:bg-indigo-600 active:bg-indigo-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center touch-manipulation"
        title="Bottom View"
      >
        Bottom
      </button>
    </div>
  );
}
