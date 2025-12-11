import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import SpinnerIcon from "./icons/SpinnerIcon";
import CubeIcon from "./icons/CubeIcon";

interface ModelThumbnailProps {
  modelUrl?: string;
  fileExtension?: string;
  isMultiPart?: boolean;
  parts?: { name: string; url: string }[];
  defaultRotation?: { x: number; y: number; z: number };
  className?: string;
}

export default function ModelThumbnail({
  modelUrl,
  fileExtension,
  isMultiPart,
  parts,
  defaultRotation,
  className = "w-12 h-12",
}: ModelThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(128, 128);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    const loadModel = async () => {
      try {
        setIsLoading(true);
        const group = new THREE.Group();

        if (modelUrl) {
          if (fileExtension === ".stl") {
            const loader = new STLLoader();
            const fetchUrl = modelUrl.startsWith('blob:') ? modelUrl : encodeURI(modelUrl);
            const response = await fetch(fetchUrl);
            if (!response.ok) {
              throw new Error(`Failed to load STL: ${response.statusText}`);
            }
            
            let arrayBuffer = await response.arrayBuffer();
            
            // Handle potential Materialise Magics format
            const view = new Uint8Array(arrayBuffer);
            const mwHeader = new TextDecoder().decode(view.slice(0, 2));
            if (mwHeader === "MW") {
              arrayBuffer = arrayBuffer.slice(84);
            }
            
            const geometry = loader.parse(arrayBuffer);
            geometry.computeVertexNormals();
            
            const material = new THREE.MeshStandardMaterial({
              color: 0x6366f1,
              metalness: 0.3,
              roughness: 0.4,
            });
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
          } else if (fileExtension === ".obj") {
            const loader = new OBJLoader();
            const fetchUrl = modelUrl.startsWith('blob:') ? modelUrl : encodeURI(modelUrl);
            const response = await fetch(fetchUrl);
            if (!response.ok) {
              throw new Error(`Failed to load OBJ: ${response.statusText}`);
            }
            
            const text = await response.text();
            const obj = loader.parse(text);
            obj.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (child.geometry) {
                  child.geometry.computeVertexNormals();
                }
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x6366f1,
                  metalness: 0.3,
                  roughness: 0.4,
                });
              }
            });
            group.add(obj);
          }
        }

        if (group.children.length > 0) {
          scene.add(group);

          // Auto-orient STL files to find the flattest base
          if (fileExtension === ".stl" && group.children[0] instanceof THREE.Mesh) {
            const mesh = group.children[0] as THREE.Mesh;
            const geometry = mesh.geometry;
            const positions = geometry.attributes.position.array;

            // Find min/max bounds
            let minY = Infinity, maxY = -Infinity;
            let minX = Infinity, maxX = -Infinity;
            let minZ = Infinity, maxZ = -Infinity;

            for (let i = 0; i < positions.length; i += 3) {
              const x = positions[i], y = positions[i + 1], z = positions[i + 2];
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (z < minZ) minZ = z;
              if (z > maxZ) maxZ = z;
            }

            const threshold = 0.01;
            const faces = {
              yDown: [] as Array<{x: number, y: number, z: number}>,
              yUp: [] as Array<{x: number, y: number, z: number}>,
              xNeg: [] as Array<{x: number, y: number, z: number}>,
              xPos: [] as Array<{x: number, y: number, z: number}>,
              zNeg: [] as Array<{x: number, y: number, z: number}>,
              zPos: [] as Array<{x: number, y: number, z: number}>,
            };

            // Collect vertices on each extreme face
            for (let i = 0; i < positions.length; i += 3) {
              const x = positions[i], y = positions[i + 1], z = positions[i + 2];
              if (Math.abs(y - minY) < threshold) faces.yDown.push({ x, y, z });
              if (Math.abs(y - maxY) < threshold) faces.yUp.push({ x, y, z });
              if (Math.abs(x - minX) < threshold) faces.xNeg.push({ x, y, z });
              if (Math.abs(x - maxX) < threshold) faces.xPos.push({ x, y, z });
              if (Math.abs(z - minZ) < threshold) faces.zNeg.push({ x, y, z });
              if (Math.abs(z - maxZ) < threshold) faces.zPos.push({ x, y, z });
            }

            // Calculate flatness score
            const calculateFlatness = (verts: Array<{x: number, y: number, z: number}>, axis: "x" | "y" | "z") => {
              if (verts.length < 10) return 0;
              let sum = 0, sumSq = 0;
              verts.forEach((v) => {
                const val = axis === "x" ? v.x : axis === "y" ? v.y : v.z;
                sum += val;
                sumSq += val * val;
              });
              const mean = sum / verts.length;
              const variance = sumSq / verts.length - mean * mean;
              return verts.length / (1 + variance * 100);
            };

            const scores = {
              yDown: calculateFlatness(faces.yDown, "y"),
              yUp: calculateFlatness(faces.yUp, "y"),
              xNeg: calculateFlatness(faces.xNeg, "x"),
              xPos: calculateFlatness(faces.xPos, "x"),
              zNeg: calculateFlatness(faces.zNeg, "z"),
              zPos: calculateFlatness(faces.zPos, "z"),
            };

            // Find best base
            let bestBase = "yDown";
            let bestScore = 0;
            Object.entries(scores).forEach(([face, score]) => {
              if (score > bestScore) {
                bestScore = score;
                bestBase = face;
              }
            });

            // Apply rotation to orient flat surface down
            switch (bestBase) {
              case "yUp":
                group.rotation.z = Math.PI;
                break;
              case "xPos":
                group.rotation.z = -Math.PI / 2;
                break;
              case "xNeg":
                group.rotation.z = Math.PI / 2;
                break;
              case "zPos":
                group.rotation.x = Math.PI / 2;
                break;
              case "zNeg":
                group.rotation.x = -Math.PI / 2;
                break;
            }
          } else if (defaultRotation && fileExtension === ".obj") {
            // Apply default rotation for OBJ files
            group.rotation.set(
              (defaultRotation.x * Math.PI) / 180,
              (defaultRotation.y * Math.PI) / 180,
              (defaultRotation.z * Math.PI) / 180
            );
          }

          // Force update of all matrices
          group.updateMatrixWorld(true);

          // Calculate bounding box after rotation
          const box = new THREE.Box3().setFromObject(group);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Validate box
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim === 0 || !isFinite(maxDim)) {
            console.error("Invalid model bounds", size);
            setIsLoading(false);
            return;
          }

          // Center the model at origin
          group.position.set(-center.x, -center.y, -center.z);
          group.updateMatrixWorld(true);

          // Position camera based on model size
          const distance = maxDim * 1.5;
          camera.position.set(distance, distance * 0.8, distance);
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();

          // Render multiple times to ensure everything is loaded
          renderer.render(scene, camera);
          await new Promise(resolve => setTimeout(resolve, 100));
          renderer.render(scene, camera);

          // Capture thumbnail
          const dataUrl = canvas.toDataURL("image/png");
          setThumbnailUrl(dataUrl);
          setIsLoading(false);
        } else {
          console.warn("No geometry loaded for thumbnail");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to generate thumbnail:", error);
        setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [modelUrl, fileExtension, isMultiPart, parts, defaultRotation]);

  // For multi-part models, just show the part count
  if (isMultiPart && parts) {
    return (
      <div className={`${className} rounded-lg bg-linear-to-br from-indigo-950 to-gray-800 border border-gray-700 flex flex-col items-center justify-center overflow-hidden shrink-0`}>
        <div className="text-white font-bold text-lg">{parts.length}</div>
        <div className="text-indigo-300 text-[10px] uppercase tracking-wide">Parts</div>
      </div>
    );
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div
        className={`${className} rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0`}
      >
        {isLoading ? (
          <SpinnerIcon className="h-5 w-5 text-gray-500" />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Model thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <CubeIcon className="text-gray-500" />
        )}
      </div>
    </>
  );
}
