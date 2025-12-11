export interface ModelItem {
  id: number;
  name: string;
  type: string;
  size: string;
  dateAdded: string;
  modelUrl?: string;
  fileExtension?: string;
  isMultiPart?: boolean;
  parts?: { name: string; url: string }[];
  defaultRotation?: { x: number; y: number; z: number };
  thumbnail?: string;
}
