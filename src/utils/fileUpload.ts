import type { ModelItem } from "../types/models";

const VALID_EXTENSIONS = [".gltf", ".glb", ".stl", ".obj"];

export function validateFileType(fileName: string): boolean {
  const fileExtension = fileName
    .toLowerCase()
    .substring(fileName.lastIndexOf("."));
  return VALID_EXTENSIONS.includes(fileExtension);
}

export function getFileExtension(fileName: string): string {
  return fileName.toLowerCase().substring(fileName.lastIndexOf("."));
}

export function createModelItem(
  file: File,
  existingModelsCount: number
): ModelItem {
  const fileUrl = URL.createObjectURL(file);
  const fileExtension = getFileExtension(file.name);

  return {
    id: existingModelsCount + 1,
    name: file.name,
    type: "File System",
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    dateAdded: new Date().toISOString().split("T")[0],
    modelUrl: fileUrl,
    fileExtension: fileExtension,
  };
}
