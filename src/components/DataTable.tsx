import { useState, useEffect } from "react";
import ModelDialog from "./ModelDialog";
import Toast from "./Toast";

interface ModelItem {
  id: number;
  name: string;
  type: string;
  size: string;
  dateAdded: string;
  modelUrl?: string;
  modelType?: string;
  fileExtension?: string;
  isMultiPart?: boolean;
  parts?: { name: string; url: string }[];
  defaultRotation?: { x: number; y: number; z: number };
}

const benchyParts = [
  {
    name: "Bridge roof",
    url: "/stl/benchy-multi-part/Multi-part - Single - Bridge roof.stl",
  },
  {
    name: "Bridge walls",
    url: "/stl/benchy-multi-part/Multi-part - Single - Bridge walls.stl",
  },
  {
    name: "Cargo box",
    url: "/stl/benchy-multi-part/Multi-part - Single - Cargo box.stl",
  },
  {
    name: "Chimney body",
    url: "/stl/benchy-multi-part/Multi-part - Single - Chimney body.stl",
  },
  {
    name: "Chimney top",
    url: "/stl/benchy-multi-part/Multi-part - Single - Chimney top.stl",
  },
  {
    name: "Deck surface",
    url: "/stl/benchy-multi-part/Multi-part - Single - Deck surface.stl",
  },
  {
    name: "Doorframe port",
    url: "/stl/benchy-multi-part/Multi-part - Single - Doorframe port.stl",
  },
  {
    name: "Doorframe starboard",
    url: "/stl/benchy-multi-part/Multi-part - Single - Doorframe starboard.stl",
  },
  {
    name: "Fishing-rod-holder",
    url: "/stl/benchy-multi-part/Multi-part - Single - Fishing-rod-holder.stl",
  },
  {
    name: "Gunwale",
    url: "/stl/benchy-multi-part/Multi-part - Single - Gunwale.stl",
  },
  {
    name: "Hawsepipe port",
    url: "/stl/benchy-multi-part/Multi-part - Single - Hawsepipe port.stl",
  },
  {
    name: "Hawsepipe starboard",
    url: "/stl/benchy-multi-part/Multi-part - Single - Hawsepipe starboard.stl",
  },
  {
    name: "Hull",
    url: "/stl/benchy-multi-part/Multi-part - Single - Hull.stl",
  },
  {
    name: "Stern name plate",
    url: "/stl/benchy-multi-part/Multi-part - Single - Stern name plate.stl",
  },
  {
    name: "Stern window",
    url: "/stl/benchy-multi-part/Multi-part - Single - Stern window.stl",
  },
  {
    name: "Wheel",
    url: "/stl/benchy-multi-part/Multi-part - Single - Wheel.stl",
  },
  {
    name: "Window",
    url: "/stl/benchy-multi-part/Multi-part - Single - Window.stl",
  },
];

const sampleData: ModelItem[] = [
  {
    id: 1,
    name: "3DBenchy - Multi-Part (17 parts)",
    type: "Multi-Part STL",
    size: "15.4 MB",
    dateAdded: "2025-12-07",
    isMultiPart: true,
    parts: benchyParts,
    fileExtension: ".stl",
  },
  {
    id: 2,
    name: "3DBenchy - Complete",
    type: "STL Model",
    size: "11.0 MB",
    dateAdded: "2025-12-07",
    modelUrl: "/stl/benchy-multi-part/Multi-part - Complete (17 shells).stl",
    fileExtension: ".stl",
  },
  {
    id: 3,
    name: "Rubber Ducky",
    type: "STL Model",
    size: "14.1 MB",
    dateAdded: "2025-12-11",
    modelUrl: "/stl/Duck.stl",
    fileExtension: ".stl",
    defaultRotation: { x: 0, y: 0, z: 90 },
  },
  {
    id: 4,
    name: "Cow",
    type: "OBJ Model",
    size: "0.17 MB",
    dateAdded: "2025-12-07",
    modelUrl: "/obj/cow.obj",
    fileExtension: ".obj",
  },
  {
    id: 5,
    name: "Teapot",
    type: "OBJ Model",
    size: "0.20 MB",
    dateAdded: "2025-12-07",
    modelUrl: "/obj/teapot.obj",
    fileExtension: ".obj",
  },
  {
    id: 6,
    name: "Emu",
    type: "OBJ Model",
    size: "2.70 MB",
    dateAdded: "2025-12-11",
    modelUrl: "/obj/emu.obj",
    fileExtension: ".obj",
    defaultRotation: { x: -90, y: 0, z: 180 },
  },
];

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a supported 3D file format
    const validExtensions = [".gltf", ".glb", ".stl", ".obj"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (!validExtensions.includes(fileExtension)) {
      setToast({
        message:
          "Please upload a supported 3D model file (.gltf, .glb, .stl, or .obj)",
        type: "error",
      });
      return;
    }

    // Create a URL for the uploaded file
    const fileUrl = URL.createObjectURL(file);

    // Create new model item
    const newModel: ModelItem = {
      id: models.length + 1,
      name: file.name,
      type: "Uploaded",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      dateAdded: new Date().toISOString().split("T")[0],
      modelUrl: fileUrl,
      fileExtension: fileExtension,
    };

    // Add to models list
    setModels([newModel, ...models]);
    setUploadDialogOpen(false);
    setToast({
      message: `Successfully uploaded ${file.name}`,
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload Model
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {models.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{item.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{item.size}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {item.dateAdded}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
      </div>

      {selectedModel && (
        <ModelDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          modelName={selectedModel.name}
          modelUrl={selectedModel.modelUrl}
          modelType={selectedModel.modelType}
          fileExtension={selectedModel.fileExtension}
          isMultiPart={selectedModel.isMultiPart}
          parts={selectedModel.parts}
          defaultRotation={selectedModel.defaultRotation}
        />
      )}

      {/* Upload Dialog */}
      {uploadDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setUploadDialogOpen(false)}
          />
          <div className="relative bg-gray-900 rounded-lg shadow-2xl w-[500px] border border-gray-800 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Upload 3D Model
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Upload a 3D model file (.gltf, .glb, .stl, or .obj) to view in 3D
            </p>

            <label className="block">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
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
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setUploadDialogOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
