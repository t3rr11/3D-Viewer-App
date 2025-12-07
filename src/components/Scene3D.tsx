import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Grid,
} from "@react-three/drei";

interface Scene3DProps {
  modelUrl?: string;
  autoRotate?: boolean;
  gridVisible?: boolean;
}

function Model({ url }: { url?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  if (!url) {
    // Default cube when no model is loaded
    return (
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#4f46e5" metalness={0.3} roughness={0.4} />
      </mesh>
    );
  }

  // TODO: Add model loader for GLTF, OBJ, etc.
  return null;
}

export default function Scene3D({
  modelUrl,
  autoRotate = true,
  gridVisible = true,
}: Scene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
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
            cellColor="#6b7280"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9ca3af"
            fadeDistance={50}
            fadeStrength={1}
            infiniteGrid
          />
        )}

        {/* Model or default object */}
        <Model url={modelUrl} />
      </Canvas>
    </div>
  );
}
