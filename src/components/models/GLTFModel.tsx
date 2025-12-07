import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, Box3, Vector3 } from "three";

interface GLTFModelProps {
  url: string;
}

export default function GLTFModel({ url }: GLTFModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(encodeURI(url));

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
    }
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
