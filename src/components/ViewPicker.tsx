interface ViewPickerProps {
  onViewChange: (view: string) => void;
}

export default function ViewPicker({ onViewChange }: ViewPickerProps) {
  return (
    <div className="absolute bottom-4 right-4 z-30 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 p-3">
      <div className="grid grid-cols-3 gap-2">
        {/* Top row */}
        <div />
        <button
          onClick={() => onViewChange("Top")}
          className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 text-white text-xs font-medium rounded transition-colors flex items-center justify-center"
          title="Top View"
        >
          T
        </button>
        <div />

        {/* Middle row */}
        <button
          onClick={() => onViewChange("Left")}
          className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 text-white text-xs font-medium rounded transition-colors flex items-center justify-center"
          title="Left View (West)"
        >
          W
        </button>
        <button
          onClick={() => onViewChange("Front")}
          className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 text-white text-xs font-medium rounded transition-colors flex items-center justify-center"
          title="Front View (South)"
        >
          S
        </button>
        <button
          onClick={() => onViewChange("Right")}
          className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 text-white text-xs font-medium rounded transition-colors flex items-center justify-center"
          title="Right View (East)"
        >
          E
        </button>

        {/* Bottom row */}
        <div />
        <button
          onClick={() => onViewChange("Back")}
          className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 text-white text-xs font-medium rounded transition-colors flex items-center justify-center"
          title="Back View (North)"
        >
          N
        </button>
        <div />
      </div>

      {/* Bottom button */}
      <button
        onClick={() => onViewChange("Bottom")}
        className="w-full mt-2 h-8 bg-gray-800 hover:bg-indigo-600 text-white text-xs font-medium rounded transition-colors flex items-center justify-center"
        title="Bottom View"
      >
        Bottom
      </button>
    </div>
  );
}
