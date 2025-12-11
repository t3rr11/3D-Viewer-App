import { useRef, useEffect, useState } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Group, Box3, Vector3, Mesh, MeshStandardMaterial } from "three";

interface OBJModelProps {
  url: string;
  modelRotation?: { x: number; y: number; z: number };
  defaultRotation?: { x: number; y: number; z: number };
}

export default function OBJModel({ url, modelRotation, defaultRotation }: OBJModelProps) {
  const groupRef = useRef<Group>(null);
  const [obj, setObj] = useState<Group | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Load the OBJ model
  useEffect(() => {
    const loadOBJ = async () => {
      try {
        const loader = new OBJLoader();
        const fetchUrl = url.startsWith('blob:') ? url : encodeURI(url);
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch OBJ: ${response.statusText}`);
        }
        
        const text = await response.text();
        const loadedObj = loader.parse(text);
        
        // Add materials to all meshes
        loadedObj.traverse((child) => {
          if (child instanceof Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (!child.material || Array.isArray(child.material)) {
              child.material = new MeshStandardMaterial({
                color: "#4f46e5",
                metalness: 0.3,
                roughness: 0.4,
              });
            }
          }
        });
        
        setObj(loadedObj);
      } catch (err) {
        console.error("Error loading OBJ file:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    loadOBJ();
  }, [url]);

  // Calculate and apply transformations
  useEffect(() => {
    if (!groupRef.current || !obj) return;

    // Calculate initial bounding box
    const box = new Box3().setFromObject(obj);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());

    // Calculate scale factor to fit within reasonable size
    const maxSize = Math.max(size.x, size.y, size.z);
    const scale = maxSize > 3 ? 3 / maxSize : 1;

    // Center the object at origin
    obj.position.set(-center.x, -center.y, -center.z);

    // Apply scale
    groupRef.current.scale.setScalar(scale);

    // Create a temporary group to calculate final bounds with scale
    const tempGroup = new Group();
    tempGroup.add(obj.clone());
    tempGroup.scale.setScalar(scale);
    tempGroup.updateMatrixWorld(true);
    const finalBox = new Box3().setFromObject(tempGroup);

    // Calculate final position (centered horizontally, bottom on grid)
    const finalCenter = finalBox.getCenter(new Vector3());
    groupRef.current.position.set(
      -finalCenter.x,
      -finalBox.min.y,
      -finalCenter.z
    );
  }, [obj]);

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

  if (!obj) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  );
}
