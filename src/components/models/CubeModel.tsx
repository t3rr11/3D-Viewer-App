import { useRef } from "react";
import * as THREE from "three";

export default function CubeModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} castShadow receiveShadow position={[0, 1, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4f46e5" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}
