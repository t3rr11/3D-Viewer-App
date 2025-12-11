import { useRef, useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Group, Box3, Vector3, Mesh, MeshStandardMaterial } from "three";

interface OBJModelProps {
  url: string;
  modelRotation?: { x: number; y: number; z: number };
  defaultRotation?: { x: number; y: number; z: number };
}

export default function OBJModel({ url, modelRotation, defaultRotation }: OBJModelProps) {
  const groupRef = useRef<Group>(null);
  const obj = useLoader(OBJLoader, encodeURI(url));

  // Calculate transformations immediately when model loads
  const { scale, position } = useMemo(() => {
    if (!obj) return { scale: 1, position: new Vector3(0, 0, 0) };

    // Add materials to all meshes
    obj.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (!child.material) {
          child.material = new MeshStandardMaterial({
            color: "#4f46e5",
            metalness: 0.3,
            roughness: 0.4,
          });
        }
      }
    });

    // Calculate initial bounding box
    const box = new Box3().setFromObject(obj);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());

    // Calculate scale factor to fit within reasonable size
    const maxSize = Math.max(size.x, size.y, size.z);
    const calculatedScale = maxSize > 3 ? 3 / maxSize : 1;

    // Center the object at origin
    obj.position.set(-center.x, -center.y, -center.z);

    // Create a temporary group to calculate final bounds with scale
    const tempGroup = new Group();
    tempGroup.add(obj.clone());
    tempGroup.scale.setScalar(calculatedScale);
    tempGroup.updateMatrixWorld(true);
    const finalBox = new Box3().setFromObject(tempGroup);

    // Calculate final position (centered horizontally, bottom on grid)
    const finalCenter = finalBox.getCenter(new Vector3());
    const finalPosition = new Vector3(
      -finalCenter.x,
      -finalBox.min.y,
      -finalCenter.z
    );

    return { scale: calculatedScale, position: finalPosition };
  }, [obj]);

  // Apply scale and position to group
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.copy(position);
    }
  }, [scale, position]);

  // Apply model rotation from controls (combined with default rotation)
  useEffect(() => {
    if (groupRef.current) {
      const baseRotation = defaultRotation || { x: 0, y: 0, z: 0 };
      const controlRotation = modelRotation || { x: 0, y: 0, z: 0 };
      
      groupRef.current.rotation.set(
        ((baseRotation.x + controlRotation.x) * Math.PI) / 180,
        ((baseRotation.y + controlRotation.y) * Math.PI) / 180,
        ((baseRotation.z + controlRotation.z) * Math.PI) / 180
      );
    }
  }, [modelRotation, defaultRotation]);

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  );
}
