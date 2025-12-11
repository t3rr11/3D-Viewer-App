import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, Box3, Vector3 } from "three";

interface GLTFModelProps {
  url: string;
  modelRotation?: { x: number; y: number; z: number };
  defaultRotation?: { x: number; y: number; z: number };
}

export default function GLTFModel({ url, modelRotation, defaultRotation }: GLTFModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(encodeURI(url));
  const basePositionRef = useRef({ x: 0, y: 0, z: 0 });
  const baseScaleRef = useRef(1);

  useEffect(() => {
    if (groupRef.current) {
      // Calculate bounding box to center and scale the model
      const box = new Box3().setFromObject(scene);
      const center = box.getCenter(new Vector3());
      const size = box.getSize(new Vector3());
      
      // Scale to fit if too large
      const maxSize = Math.max(size.x, size.y, size.z);
      const scale = maxSize > 5 ? 5 / maxSize : 1;
      
      // Position the group (not the scene directly)
      groupRef.current.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
      groupRef.current.scale.setScalar(scale);
      basePositionRef.current = { x: -center.x * scale, y: -box.min.y * scale, z: -center.z * scale };
      baseScaleRef.current = scale;
    }
  }, [scene]);

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
      <primitive object={scene} />
    </group>
  );
}
