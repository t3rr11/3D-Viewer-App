import { useState, useEffect } from "react";
import ModelDialog from "./ModelDialog";
import Toast from "./Toast";
import ModelThumbnail from "./ModelThumbnail";
import LoadIcon from "./icons/LoadIcon";
import UploadDialog from "./UploadDialog";
import { sampleData } from "../constants/models";
import { validateFileType, createModelItem } from "../utils/fileUpload";
import type { ModelItem } from "../types/models";

export default function DataGrid() {
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [models, setModels] = useState<ModelItem[]>(sampleData);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleViewClick = (model: ModelItem) => {
    setSelectedModel(model);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedModel(null);
  };

  const handleFileUpload = (file: File) => {
    if (!validateFileType(file.name)) {
      setToast({
        message:
          "Please upload a supported 3D model file (.gltf, .glb, .stl, or .obj)",
        type: "error",
      });
      return;
    }

    const newModel = createModelItem(file, models.length);

    setModels([newModel, ...models]);
    setUploadDialogOpen(false);
    setToast({
      message: `Successfully loaded ${file.name} (temporary - will be gone on refresh)`,
      type: "success",
    });
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              3D Models
            </h2>
            <p className="text-gray-400">
              Browse and view your collection of 3D models
            </p>
          </div>
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <LoadIcon />
            Load Model
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {models.map((item) => (
            <div
              key={item.id}
              onClick={() => handleViewClick(item)}
              className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-600 transition-all cursor-pointer group"
            >
              {/* Thumbnail Section */}
              <div className="aspect-square bg-gray-800 flex items-center justify-center">
                <ModelThumbnail
                  modelUrl={item.modelUrl}
                  fileExtension={item.fileExtension}
                  isMultiPart={item.isMultiPart}
                  parts={item.parts}
                  defaultRotation={item.defaultRotation}
                  className="w-full h-full"
                />
              </div>

              {/* Info Section */}
              <div className="p-4">
                <h3 className="text-white font-medium text-sm mb-1 truncate group-hover:text-indigo-400 transition-colors">
                  {item.name}
                </h3>
                <p
                  className={`text-xs mb-3 ${
                    item.type === "File System"
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  {item.type}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{item.size}</span>
                  <span>{item.dateAdded}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewClick(item);
                  }}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View Model
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedModel && (
        <ModelDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          modelName={selectedModel.name}
          modelUrl={selectedModel.modelUrl}
          fileExtension={selectedModel.fileExtension}
          isMultiPart={selectedModel.isMultiPart}
          parts={selectedModel.parts}
          defaultRotation={selectedModel.defaultRotation}
        />
      )}

      <UploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onFileSelect={handleFileUpload}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
