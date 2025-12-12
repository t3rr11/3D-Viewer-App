import { useState, useEffect } from "react";
import ModelDialog from "./ModelDialog";
import Toast from "./Toast";
import ModelThumbnail from "./ModelThumbnail";
import LoadIcon from "./icons/LoadIcon";
import UploadDialog from "./UploadDialog";
import { sampleData } from "../constants/models";
import { validateFileType, createModelItem } from "../utils/fileUpload";
import type { ModelItem } from "../types/models";

export default function DataTable() {
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
      <div className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-1 sm:mb-2">
              3D Models
            </h2>
            <p className="text-sm sm:text-base text-gray-400">
              Browse and view your collection of 3D models
            </p>
          </div>
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <LoadIcon />
            Load Model
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {models.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleViewClick(item)}
                  className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <ModelThumbnail
                        modelUrl={item.modelUrl}
                        fileExtension={item.fileExtension}
                        isMultiPart={item.isMultiPart}
                        parts={item.parts}
                        defaultRotation={item.defaultRotation}
                        className="w-16 h-16"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {item.name}
                        </div>
                        <div className={`text-xs mt-1 ${
                          item.type === "Loaded (Temporary)" ? "text-yellow-500" : "text-gray-400"
                        }`}>
                          {item.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{item.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {item.dateAdded}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleViewClick(item)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {models.map((item) => (
            <div
              key={item.id}
              onClick={() => handleViewClick(item)}
              className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-indigo-600 transition-all cursor-pointer"
            >
              <div className="flex gap-3 p-3">
                <ModelThumbnail
                  modelUrl={item.modelUrl}
                  fileExtension={item.fileExtension}
                  isMultiPart={item.isMultiPart}
                  parts={item.parts}
                  defaultRotation={item.defaultRotation}
                  className="w-20 h-20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">
                    {item.name}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    item.type === "Loaded (Temporary)" ? "text-yellow-500" : "text-gray-400"
                  }`}>
                    {item.type}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span>{item.size}</span>
                    <span>•</span>
                    <span>{item.dateAdded}</span>
                  </div>
                </div>
              </div>
              <div className="px-3 pb-3">
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
