import { useRef, useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry, Vector3, Group, Box3 } from "three";

interface MultiPartSTLModelProps {
  parts: { name: string; url: string }[];
  visibleParts?: boolean[];
}

export default function MultiPartSTLModel({ parts, visibleParts }: MultiPartSTLModelProps) {
  const groupRef = useRef<Group>(null);
  const processedRef = useRef(false);
  
  // Create stable URL list on mount with URL encoding for spaces
  const [stableUrls] = useState(() => parts.map(p => encodeURI(p.url)));
  
  // Load all geometries once using stable URL reference
  const geometries = useLoader(
    STLLoader,
    stableUrls
  ) as BufferGeometry[];

  // Process geometries once on initial load
  useEffect(() => {
    if (groupRef.current && geometries.length > 0 && !processedRef.current) {
      processedRef.current = true;

      // Calculate combined bounding box for all parts
      const combinedBox = new Box3();
      
      geometries.forEach((geometry) => {
        geometry.computeBoundingBox();
        if (geometry.boundingBox) {
          combinedBox.union(geometry.boundingBox);
        }
      });
      
      const center = combinedBox.getCenter(new Vector3());
      const size = combinedBox.getSize(new Vector3());
      
      // Center all geometries
      geometries.forEach((geometry) => {
        geometry.translate(-center.x, -center.y, -center.z);
      });
      
      // Scale to fit
      const maxSize = Math.max(size.x, size.y, size.z);
      const scale = maxSize > 5 ? 5 / maxSize : 1;
      
      if (scale !== 1) {
        geometries.forEach((geometry) => {
          geometry.scale(scale, scale, scale);
        });
      }

      // Rotate the group to Y-up orientation
      groupRef.current.rotation.x = -Math.PI / 2;
      
      // Position group so model sits on grid
      const heightAfterRotation = size.z * scale;
      groupRef.current.position.y = heightAfterRotation / 2;
    }
  }, [geometries]);

  return (
    <group ref={groupRef}>
      {geometries.map((geometry: BufferGeometry, index: number) => {
        const part = parts[index];
        const isVisible = visibleParts?.[index] !== false;
        return (
          <mesh
            key={part.name}
            geometry={geometry}
            castShadow
            receiveShadow
            visible={isVisible}
          >
            <meshStandardMaterial
              color="#4f46e5"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}
