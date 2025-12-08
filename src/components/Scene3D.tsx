import MultiPartSTLModel from "./models/MultiPartSTLModel";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Grid,
} from "@react-three/drei";
import {
  CubeModel,
  SphereModel,
  TorusModel,
  CylinderModel,
  ConeModel,
  GLTFModel,
  STLModel,
  OBJModel,
} from "./models";
import { useRef } from "react";

interface Scene3DProps {
  modelUrl?: string;
  modelType?: string;
  fileExtension?: string;
  autoRotate?: boolean;
  gridVisible?: boolean;
  cameraPosition?: [number, number, number];
  isMultiPart?: boolean;
  parts?: { name: string; url: string }[];
  visibleParts?: boolean[];
  selectedPartIndices?: number[];
  onPartClick?: (index: number, ctrlKey: boolean) => void;
  onBackgroundClick?: () => void;
}

function Model({
  url,
  type,
  extension,
  isMultiPart,
  parts,
  visibleParts,
  selectedPartIndices,
  onPartClick,
}: {
  url?: string;
  type?: string;
  extension?: string;
  isMultiPart?: boolean;
  parts?: { name: string; url: string }[];
  visibleParts?: boolean[];
  selectedPartIndices?: number[];
  onPartClick?: (index: number, ctrlKey: boolean) => void;
}) {
  // Handle multi-part models
  if (isMultiPart && parts) {
    return (
      <MultiPartSTLModel 
        parts={parts} 
        visibleParts={visibleParts}
        selectedPartIndices={selectedPartIndices}
        onPartClick={onPartClick}
      />
    );
  }

  // If URL is provided, determine the file type and load accordingly
  if (url) {
    // Use provided extension first, fallback to extracting from URL
    const fileExt = extension || url.toLowerCase().split(".").pop();

    switch (fileExt) {
      case ".gltf":
      case "gltf":
      case ".glb":
      case "glb":
        return <GLTFModel url={url} />;
      case ".stl":
      case "stl":
        return <STLModel url={url} />;
      case ".obj":
      case "obj":
        return <OBJModel url={url} />;
      default:
        return <GLTFModel url={url} />;
    }
  }

  // If modelType is specified, render the appropriate geometry
  if (type) {
    switch (type.toLowerCase()) {
      case "cube":
      case "cube model":
        return <CubeModel />;
      case "sphere":
        return <SphereModel />;
      case "torus":
        return <TorusModel />;
      case "cylinder":
        return <CylinderModel />;
      case "cone":
        return <ConeModel />;
      default:
        return <CubeModel />;
    }
  }

  // Default cube when no model is loaded
  return <CubeModel />;
}

function BackgroundPlane({ onBackgroundClick }: { onBackgroundClick?: () => void }) {
  const mouseDownPos = useRef({ x: 0, y: 0 });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      onPointerDown={(e) => {
        mouseDownPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        // Calculate distance moved
        const dx = e.clientX - mouseDownPos.current.x;
        const dy = e.clientY - mouseDownPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only trigger click if mouse didn't move much (less than 5 pixels)
        if (distance < 5) {
          e.stopPropagation();
          onBackgroundClick?.();
        }
      }}
    >
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

export default function Scene3D({
  modelUrl,
  modelType,
  fileExtension,
  autoRotate = true,
  gridVisible = true,
  cameraPosition = [12, 6, 12],
  isMultiPart,
  parts,
  visibleParts,
  selectedPartIndices,
  onPartClick,
  onBackgroundClick,
}: Scene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          target={[0, 0, 0]}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Grid */}
        {gridVisible && (
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#374151"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#4b5563"
            fadeDistance={200}
            fadeStrength={1}
            infiniteGrid
          />
        )}

        {/* Invisible plane to catch background clicks */}
        <BackgroundPlane onBackgroundClick={onBackgroundClick} />

        {/* Model or default object */}
        <Model
          url={modelUrl}
          type={modelType}
          extension={fileExtension}
          isMultiPart={isMultiPart}
          parts={parts}
          visibleParts={visibleParts}
          selectedPartIndices={selectedPartIndices}
          onPartClick={onPartClick}
        />
      </Canvas>
    </div>
  );
}
