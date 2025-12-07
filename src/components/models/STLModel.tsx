import { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry, Vector3, Group } from "three";

interface STLModelProps {
  url: string;
}

export default function STLModel({ url }: STLModelProps) {
  const groupRef = useRef<Group>(null);
  const geometry = useLoader(STLLoader, url) as BufferGeometry;

  useEffect(() => {
    if (groupRef.current && geometry) {
      // Center the geometry at origin
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;
      
      if (boundingBox) {
        const center = boundingBox.getCenter(new Vector3());
        const size = boundingBox.getSize(new Vector3());
        
        geometry.translate(-center.x, -center.y, -center.z);
        
        // Scale to fit
        const maxSize = Math.max(size.x, size.y, size.z);
        if (maxSize > 5) {
          const scale = 5 / maxSize;
          geometry.scale(scale, scale, scale);
        }
        
        // Rotate the group to Y-up orientation
        groupRef.current.rotation.x = -Math.PI / 2;
        
        // After rotation, position group so model sits on grid
        // For Z-up to Y-up rotation, the Z size becomes the Y height
        const heightAfterRotation = size.z * (maxSize > 5 ? 5 / maxSize : 1);
        groupRef.current.position.y = heightAfterRotation / 2;
      }
    }
  }, [geometry]);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#4f46e5" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}
