import { useState } from "react";
import Scene3D from "./Scene3D";
import Controls from "./Controls";
import ViewPicker from "./ViewPicker";
import PartsPanel from "./PartsPanel";
import PartDetailsPanel from "./PartDetailsPanel";

interface ModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  modelUrl?: string;
  fileExtension?: string;
  isMultiPart?: boolean;
  parts?: { name: string; url: string }[];
  defaultRotation?: { x: number; y: number; z: number };
}

export default function ModelDialog({
  isOpen,
  onClose,
  modelName,
  modelUrl,
  fileExtension,
  isMultiPart,
  parts,
  defaultRotation,
}: ModelDialogProps) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([12, 6, 12]);
  const [visibleParts, setVisibleParts] = useState<boolean[]>(
    parts ? parts.map(() => true) : []
  );
  const [selectedPartIndices, setSelectedPartIndices] = useState<number[]>([]);
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1);
    setCameraPosition([12, 6, 12]);
    setModelRotation({ x: 0, y: 0, z: 0 });
  };

  const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
    setModelRotation((prev) => ({ ...prev, [axis]: value }));
  };

  const handleTogglePart = (index: number) => {
    setVisibleParts((prev) => {
      const newVisible = [...prev];
      newVisible[index] = !newVisible[index];
      return newVisible;
    });
  };

  const handleToggleAll = (visible: boolean) => {
    setVisibleParts(parts ? parts.map(() => visible) : []);
  };

  const handlePartClick = (index: number, ctrlKey: boolean = false) => {
    setSelectedPartIndices((prev) => {
      if (ctrlKey) {
        // Multi-select with Ctrl/Cmd
        if (prev.includes(index)) {
          // Deselect if already selected
          return prev.filter((i) => i !== index);
        } else {
          // Add to selection
          return [...prev, index];
        }
      } else {
        // Single select - toggle if clicking same part
        if (prev.length === 1 && prev[0] === index) {
          return [];
        }
        return [index];
      }
    });
  };

  const handleCloseDetails = () => {
    setSelectedPartIndices([]);
  };

  const handleBackgroundClick = () => {
    setSelectedPartIndices([]);
  };

  const handleFullscreen = () => {
    const dialogElement = document.querySelector(
      ".model-dialog-container"
    ) as HTMLElement;
    if (!dialogElement) return;

    if (!isFullscreen) {
      if (dialogElement.requestFullscreen) {
        dialogElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleToggleUI = () => {
    setUiVisible(!uiVisible);
  };

  // Calculate instance count for selected part
  const getInstanceCount = (partIndex: number) => {
    if (!parts || partIndex === null) return 0;
    const partName = parts[partIndex].name;
    return parts.filter((p) => p.name === partName).length;
  };

  const handleViewChange = (view: string) => {
    const distance = 15;
    switch (view) {
      case "Front": // South
        setCameraPosition([0, 5, distance]);
        break;
      case "Back": // North
        setCameraPosition([0, 5, -distance]);
        break;
      case "Left": // West
        setCameraPosition([-distance, 5, 0]);
        break;
      case "Right": // East
        setCameraPosition([distance, 5, 0]);
        break;
      case "Top":
        setCameraPosition([0, distance, 0.1]);
        break;
      case "Bottom":
        setCameraPosition([0, -distance, 0.1]);
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-gray-900 rounded-lg shadow-2xl w-full h-full sm:w-[90vw] sm:h-[90vh] flex flex-col border border-gray-800 model-dialog-container">
        {/* Dialog Header */}
        {uiVisible && (
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-800">
            <h2 className="text-base sm:text-xl font-semibold text-white truncate mr-2">{modelName}</h2>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Toggle UI Button */}
              <button
                onClick={handleToggleUI}
                className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg touch-manipulation"
                title="Hide UI"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
              {/* Fullscreen Button - Hidden on mobile */}
              <button
                onClick={handleFullscreen}
                className="hidden sm:block text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isFullscreen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  )}
                </svg>
              </button>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg touch-manipulation"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
          </div>
        )}

        {/* UI Toggle Button (visible when UI is hidden) */}
        {!uiVisible && (
          <button
            onClick={handleToggleUI}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg bg-gray-900/80 backdrop-blur-sm"
            title="Show UI"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        )}

        {/* Dialog Content */}
        <div className="flex-1 relative">
          {uiVisible && (
            <>
              <Controls
                autoRotate={autoRotate}
                setAutoRotate={setAutoRotate}
                gridVisible={gridVisible}
                setGridVisible={setGridVisible}
                onReset={handleReset}
                rotation={modelRotation}
                onRotationChange={handleRotationChange}
              />
              <ViewPicker onViewChange={handleViewChange} />
              {isMultiPart && parts && (
                <PartsPanel
                  parts={parts.map((part, index) => ({
                    name: part.name,
                    visible: visibleParts[index],
                  }))}
                  onTogglePart={handleTogglePart}
                  onToggleAll={handleToggleAll}
                  selectedPartIndices={selectedPartIndices}
                  onPartClick={handlePartClick}
                />
              )}
              {selectedPartIndices.length > 0 && parts && (
                <PartDetailsPanel
                  partName={
                    selectedPartIndices.length === 1
                      ? parts[selectedPartIndices[0]].name
                      : `${selectedPartIndices.length} parts selected`
                  }
                  partIndices={selectedPartIndices}
                  instanceCount={
                    selectedPartIndices.length === 1
                      ? getInstanceCount(selectedPartIndices[0])
                      : selectedPartIndices.length
                  }
                  onClose={handleCloseDetails}
                  isMultiSelect={selectedPartIndices.length > 1}
                  parts={parts}
                />
              )}
            </>
          )}
          <Scene3D
            key={resetTrigger}
            modelUrl={modelUrl}
            fileExtension={fileExtension}
            autoRotate={autoRotate}
            gridVisible={gridVisible}
            cameraPosition={cameraPosition}
            isMultiPart={isMultiPart}
            parts={parts}
            visibleParts={visibleParts}
            selectedPartIndices={selectedPartIndices}
            onPartClick={handlePartClick}
            onBackgroundClick={handleBackgroundClick}
            onClose={onClose}
            modelRotation={modelRotation}
            defaultRotation={defaultRotation}
          />
        </div>

        {/* Dialog Footer */}
        {uiVisible && (
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-800 bg-gray-900/50">
            <p className="text-xs sm:text-sm text-gray-400">
              <strong className="text-gray-300">Controls:</strong> Use mouse/touch to
              rotate, zoom, and pan
              {isMultiPart && <span className="hidden sm:inline"> • Ctrl+Click to multi-select parts</span>}
              <span className="hidden sm:inline"> • Double-click rotation sliders to reset to 0°</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
