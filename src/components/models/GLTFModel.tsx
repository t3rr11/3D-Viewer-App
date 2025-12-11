import { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Group, Box3, Vector3 } from "three";

interface GLTFModelProps {
  url: string;
  modelRotation?: { x: number; y: number; z: number };
  defaultRotation?: { x: number; y: number; z: number };
}

export default function GLTFModel({ url, modelRotation, defaultRotation }: GLTFModelProps) {
  const groupRef = useRef<Group>(null);
  const [scene, setScene] = useState<Group | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Load the GLTF model
  useEffect(() => {
    const loadGLTF = async () => {
      try {
        const loader = new GLTFLoader();
        const fetchUrl = url.startsWith('blob:') ? url : encodeURI(url);
        
        // Use the loader's load method which handles both regular and blob URLs
        loader.load(
          fetchUrl,
          (gltf) => {
            setScene(gltf.scene);
          },
          undefined,
          (err) => {
            console.error("Error loading GLTF file:", err);
            setError(err instanceof Error ? err : new Error(String(err)));
          }
        );
      } catch (err) {
        console.error("Error loading GLTF file:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    loadGLTF();
  }, [url]);

  // Calculate and apply transformations
  useEffect(() => {
    if (!groupRef.current || !scene) return;

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

  if (error) {
    throw error;
  }

  if (!scene) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
