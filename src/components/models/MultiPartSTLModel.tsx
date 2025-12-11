import { useRef, useEffect, useState, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry, Vector3, Group, Box3, Mesh } from "three";

interface PartMeshProps {
  geometry: BufferGeometry;
  index: number;
  isVisible: boolean;
  isPartOfSelectedGroup: boolean;
  hasSelection: boolean;
  onPartClick: (index: number, ctrlKey: boolean) => void;
}

function PartMesh({
  geometry,
  index,
  isVisible,
  isPartOfSelectedGroup,
  hasSelection,
  onPartClick,
}: PartMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    // Check if pointer moved significantly during the interaction
    if (pointerDownPos.current) {
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If moved more than 5 pixels, consider it a drag, not a click
      if (distance > 5) {
        pointerDownPos.current = null;
        return;
      }
    }

    e.stopPropagation();
    onPartClick(index, e.nativeEvent.ctrlKey || e.nativeEvent.metaKey);
    pointerDownPos.current = null;
  };

  const opacity = hasSelection && !isPartOfSelectedGroup ? 0.3 : 1.0;
  const transparent = hasSelection && !isPartOfSelectedGroup;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      castShadow={!transparent}
      receiveShadow
      visible={isVisible}
      onPointerDown={handlePointerDown}
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
}

interface MultiPartSTLModelProps {
  parts: { name: string; url: string }[];
  visibleParts?: boolean[];
  selectedPartIndices?: number[];
  onPartClick?: (index: number, ctrlKey: boolean) => void;
  modelRotation?: { x: number; y: number; z: number };
  defaultRotation?: { x: number; y: number; z: number };
}

export default function MultiPartSTLModel({
  parts,
  visibleParts,
  selectedPartIndices = [],
  onPartClick,
  modelRotation,
  defaultRotation,
}: MultiPartSTLModelProps) {
  const groupRef = useRef<Group>(null);
  const processedRef = useRef(false);

  // Create stable URL list on mount with URL encoding for spaces (but not for blob URLs)
  const [stableUrls] = useState(() => parts.map((p) => p.url.startsWith('blob:') ? p.url : encodeURI(p.url)));

  // Load all geometries once using stable URL reference
  const geometries = useLoader(STLLoader, stableUrls) as BufferGeometry[];

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

  // Apply model rotation to the group (combined with base and default rotation)
  useEffect(() => {
    if (groupRef.current) {
      const baseRotation = -Math.PI / 2; // Base Y-up orientation
      const defaultRot = defaultRotation || { x: 0, y: 0, z: 0 };
      const controlRot = modelRotation || { x: 0, y: 0, z: 0 };
      
      groupRef.current.rotation.set(
        baseRotation + (defaultRot.x * Math.PI) / 180 + (controlRot.x * Math.PI) / 180,
        (defaultRot.y * Math.PI) / 180 + (controlRot.y * Math.PI) / 180,
        (defaultRot.z * Math.PI) / 180 + (controlRot.z * Math.PI) / 180
      );
    }
  }, [modelRotation, defaultRotation]);

  return (
    <group ref={groupRef}>
      {geometries.map((geometry: BufferGeometry, index: number) => {
        const part = parts[index];
        const isVisible = visibleParts?.[index] !== false;

        // Check if this part is in the selected group
        const instanceIndices = instanceMap.get(part.name) || [];
        const isPartOfSelectedGroup = selectedPartIndices.some((selectedIdx) =>
          instanceIndices.includes(selectedIdx)
        );

        // Determine if any part is selected
        const hasSelection = selectedPartIndices.length > 0;

        return (
          <PartMesh
            key={part.name + "-" + index}
            geometry={geometry}
            index={index}
            isVisible={isVisible}
            isPartOfSelectedGroup={isPartOfSelectedGroup}
            hasSelection={hasSelection}
            onPartClick={(idx, ctrlKey) => onPartClick?.(idx, ctrlKey)}
          />
        );
      })}
    </group>
  );
}
