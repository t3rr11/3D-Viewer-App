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
  modelType?: string;
  fileExtension?: string;
  isMultiPart?: boolean;
  parts?: { name: string; url: string }[];
}

export default function ModelDialog({
  isOpen,
  onClose,
  modelName,
  modelUrl,
  modelType,
  fileExtension,
  isMultiPart,
  parts,
}: ModelDialogProps) {
  const [autoRotate, setAutoRotate] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([12, 6, 12]);
  const [visibleParts, setVisibleParts] = useState<boolean[]>(
    parts ? parts.map(() => true) : []
  );
  const [selectedPartIndices, setSelectedPartIndices] = useState<number[]>([]);

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1);
    setCameraPosition([12, 6, 12]);
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
          return prev.filter(i => i !== index);
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
      <div className="relative bg-gray-900 rounded-lg shadow-2xl w-[90vw] h-[90vh] flex flex-col border border-gray-800">
        {/* Dialog Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">{modelName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Dialog Content */}
        <div className="flex-1 relative">
          <Controls
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
            gridVisible={gridVisible}
            setGridVisible={setGridVisible}
            onReset={handleReset}
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
              partName={selectedPartIndices.length === 1 ? parts[selectedPartIndices[0]].name : `${selectedPartIndices.length} parts selected`}
              partIndices={selectedPartIndices}
              instanceCount={selectedPartIndices.length === 1 ? getInstanceCount(selectedPartIndices[0]) : selectedPartIndices.length}
              onClose={handleCloseDetails}
              isMultiSelect={selectedPartIndices.length > 1}
              parts={parts}
            />
          )}
          <Scene3D
            key={resetTrigger}
            modelUrl={modelUrl}
            modelType={modelType}
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
          />
        </div>

        {/* Dialog Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/50">
          <p className="text-sm text-gray-400">
            Use mouse to rotate, zoom, and pan the 3D model
          </p>
        </div>
      </div>
    </div>
  );
}
