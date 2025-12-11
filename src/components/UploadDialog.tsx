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
      <div className="relative bg-gray-900 rounded-lg shadow-2xl w-[500px] border border-gray-800 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Load 3D Model
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Load a 3D model file (.gltf, .glb, .stl, or .obj) to view in 3D. Note: Loaded models are temporary and will be removed on page refresh.
        </p>

        <label className="block">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
            <LoadIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2">
              Click to browse or drag and drop
            </p>
            <p className="text-gray-500 text-sm">
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

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
