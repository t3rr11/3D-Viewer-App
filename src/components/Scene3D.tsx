import MultiPartSTLModel from "./models/MultiPartSTLModel";
import { useRef, Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GLTFModel, STLModel, OBJModel, CubeModel } from "./models";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Grid,
} from "@react-three/drei";
import ErrorBoundary from "./ErrorBoundary";
import ModelErrorFallback from "./ModelErrorFallback";

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
  onClose?: () => void;
  findBaseTrigger?: number;
  modelRotation?: { x: number; y: number; z: number };
  defaultRotation?: { x: number; y: number; z: number };
}

function Model({
  url,
  extension,
  isMultiPart,
  parts,
  visibleParts,
  selectedPartIndices,
  onPartClick,
  findBaseTrigger,
  modelRotation,
  defaultRotation,
}: {
  url?: string;
  type?: string;
  extension?: string;
  isMultiPart?: boolean;
  parts?: { name: string; url: string }[];
  visibleParts?: boolean[];
  selectedPartIndices?: number[];
  onPartClick?: (index: number, ctrlKey: boolean) => void;
  findBaseTrigger?: number;
  modelRotation?: { x: number; y: number; z: number };
  defaultRotation?: { x: number; y: number; z: number };
}) {
  // Handle multi-part models
  if (isMultiPart && parts) {
    return (
      <MultiPartSTLModel
        parts={parts}
        visibleParts={visibleParts}
        selectedPartIndices={selectedPartIndices}
        onPartClick={onPartClick}
        modelRotation={modelRotation}
        defaultRotation={defaultRotation}
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
        return (
          <GLTFModel
            url={url}
            modelRotation={modelRotation}
            defaultRotation={defaultRotation}
          />
        );
      case ".stl":
      case "stl":
        return (
          <STLModel
            url={url}
            findBaseTrigger={findBaseTrigger}
            modelRotation={modelRotation}
            defaultRotation={defaultRotation}
          />
        );
      case ".obj":
      case "obj":
        return (
          <OBJModel
            url={url}
            modelRotation={modelRotation}
            defaultRotation={defaultRotation}
          />
        );
      default:
        return (
          <GLTFModel
            url={url}
            modelRotation={modelRotation}
            defaultRotation={defaultRotation}
          />
        );
    }
  }

  // Default cube when no model is loaded
  return <CubeModel />;
}

function BackgroundPlane({
  onBackgroundClick,
}: {
  onBackgroundClick?: () => void;
}) {
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
  onClose,
  findBaseTrigger,
  modelRotation,
  defaultRotation,
}: Scene3DProps) {
  const [error, setError] = useState<Error | null>(null);

  const resetError = () => {
    setError(null);
    onClose?.();
  };

  if (error) {
    return <ModelErrorFallback error={error} resetError={resetError} />;
  }

  return (
    <div className="w-full h-full">
      <ErrorBoundary
        fallback={(error) => {
          setError(error);
          return null;
        }}
      >
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={cameraPosition} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            target={[0, 0, 0]}
            minDistance={2}
            maxDistance={50}
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

          {/* Model */}
          <Suspense fallback={null}>
            <Model
              url={modelUrl}
              type={modelType}
              extension={fileExtension}
              isMultiPart={isMultiPart}
              parts={parts}
              visibleParts={visibleParts}
              selectedPartIndices={selectedPartIndices}
              onPartClick={onPartClick}
              findBaseTrigger={findBaseTrigger}
              modelRotation={modelRotation}
              defaultRotation={defaultRotation}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
