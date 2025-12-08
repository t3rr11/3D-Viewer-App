import { useRef, useEffect, useState, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry, Vector3, Group, Box3 } from "three";

interface MultiPartSTLModelProps {
  parts: { name: string; url: string }[];
  visibleParts?: boolean[];
  selectedPartIndices?: number[];
  onPartClick?: (index: number, ctrlKey: boolean) => void;
}

export default function MultiPartSTLModel({ 
  parts, 
  visibleParts,
  selectedPartIndices = [],
  onPartClick,
}: MultiPartSTLModelProps) {
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

  // Memoize instance indices mapping for performance
  const instanceMap = useMemo(() => {
    const map = new Map<string, number[]>();
    parts.forEach((part, index) => {
      if (!map.has(part.name)) {
        map.set(part.name, []);
      }
      map.get(part.name)!.push(index);
    });
    return map;
  }, [parts]);

  return (
    <group ref={groupRef}>
      {geometries.map((geometry: BufferGeometry, index: number) => {
        const part = parts[index];
        const isVisible = visibleParts?.[index] !== false;
        
        // Check if this part is in the selected group
        const instanceIndices = instanceMap.get(part.name) || [];
        const isPartOfSelectedGroup = selectedPartIndices.some(selectedIdx => 
          instanceIndices.includes(selectedIdx)
        );
        
        const handleClick = (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (onPartClick) {
            onPartClick(index, e.nativeEvent.ctrlKey || e.nativeEvent.metaKey);
          }
        };

        // Determine if any part is selected
        const hasSelection = selectedPartIndices.length > 0;
        // Make non-selected parts semi-transparent when a part is selected
        const opacity = hasSelection && !isPartOfSelectedGroup ? 0.3 : 1.0;
        const transparent = hasSelection && !isPartOfSelectedGroup;

        return (
          <mesh
            key={part.name + "-" + index}
            geometry={geometry}
            castShadow={!transparent}
            receiveShadow
            visible={isVisible}
            onClick={handleClick}
            renderOrder={isPartOfSelectedGroup ? 1 : 0}
          >
            <meshStandardMaterial
              color={isPartOfSelectedGroup ? "#06b6d4" : "#4f46e5"}
              metalness={0.3}
              roughness={0.4}
              emissive={isPartOfSelectedGroup ? "#06b6d4" : "#000000"}
              emissiveIntensity={isPartOfSelectedGroup ? 0.3 : 0}
              opacity={opacity}
              transparent={true}
              depthTest={true}
              depthWrite={!transparent}
              alphaTest={0.01}
            />
          </mesh>
        );
      })}
    </group>
  );
}
