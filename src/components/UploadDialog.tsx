import LoadIcon from "./icons/LoadIcon";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
}

export default function UploadDialog({
  isOpen,
  onClose,
  onFileSelect,
}: UploadDialogProps) {
  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 rounded-lg shadow-2xl w-[calc(100vw-2rem)] sm:w-[500px] max-w-lg border border-gray-800 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
          Load 3D Model
        </h3>
        <p className="text-gray-400 text-sm mb-4 sm:mb-6">
          Load a 3D model file (.gltf, .glb, .stl, or .obj) to view in 3D. Note: Loaded models are temporary and will be removed on page refresh.
        </p>

        <label className="block">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 sm:p-8 text-center hover:border-indigo-500 active:border-indigo-600 transition-colors cursor-pointer touch-manipulation">
            <LoadIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-500 mb-3 sm:mb-4" />
            <p className="text-gray-400 mb-2 text-sm sm:text-base">
              Tap to browse or drag and drop
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              GLTF, GLB, STL, or OBJ files
            </p>
          </div>
          <input
            type="file"
            accept=".gltf,.glb,.stl,.obj"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="mt-4 sm:mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white active:text-white transition-colors touch-manipulation"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
