import { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Group, Box3, Vector3, Mesh, MeshStandardMaterial } from "three";

interface OBJModelProps {
  url: string;
}

export default function OBJModel({ url }: OBJModelProps) {
  const groupRef = useRef<Group>(null);
  const obj = useLoader(OBJLoader, encodeURI(url));

  useEffect(() => {
    if (groupRef.current && obj) {
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
      
      // Center the object at origin first
      obj.position.set(-center.x, -center.y, -center.z);
      
      // Scale to fit if too large
      const maxSize = Math.max(size.x, size.y, size.z);
      if (maxSize > 5) {
        const scale = 5 / maxSize;
        obj.scale.setScalar(scale);
      }
      
      // Update matrix and recalculate bounding box after transformations
      obj.updateMatrixWorld(true);
      const finalBox = new Box3().setFromObject(obj);
      
      // Position so bottom sits on grid (y = 0)
      groupRef.current.position.y = -finalBox.min.y;
    }
  }, [obj]);

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  );
}
