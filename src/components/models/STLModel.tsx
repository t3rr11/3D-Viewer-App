import { useRef, useEffect, useState, useCallback } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry, Vector3, Group } from "three";

interface STLModelProps {
  url: string;
  findBaseTrigger?: number;
  modelRotation?: { x: number; y: number; z: number };
  defaultRotation?: { x: number; y: number; z: number };
}

interface Orientation {
  originalSize: Vector3;
  scaledSize: Vector3;
  needsRotation: boolean;
}

export default function STLModel({
  url,
  findBaseTrigger,
  modelRotation,
  defaultRotation,
}: STLModelProps) {
  const groupRef = useRef<Group>(null);
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [orientationData, setOrientationData] = useState<Orientation | null>(
    null
  );
  const [autoOrientComplete, setAutoOrientComplete] = useState(false);
  const baseRotationRef = useRef({ x: 0, y: 0, z: 0 });
  const basePositionYRef = useRef(0);

  useEffect(() => {
    const loadSTL = async () => {
      try {
        const loader = new STLLoader();
        const fetchUrl = url.startsWith('blob:') ? url : encodeURI(url);
        const response = await fetch(fetchUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        let arrayBuffer = await response.arrayBuffer();
        const view = new Uint8Array(arrayBuffer);

        // Detect and convert Materialise Magics (MW) format
        // MW format: 80-byte proprietary header + standard binary STL data
        // Standard binary STL: 80-byte header + 4-byte triangle count + triangle data (50 bytes each)
        const mwHeader = new TextDecoder().decode(view.slice(0, 2));

        if (mwHeader === "MW") {
          // Replace MW header with standard 80-byte STL header
          const stlData = new Uint8Array(arrayBuffer.slice(80));
          const newBuffer = new ArrayBuffer(80 + stlData.byteLength);
          const newView = new Uint8Array(newBuffer);
          newView.set(stlData, 80);
          arrayBuffer = newBuffer;
        }

        // Parse STL (binary or ASCII)
        const header = new TextDecoder().decode(
          new Uint8Array(arrayBuffer).slice(0, 5)
        );
        
        // Better detection: check if file size matches binary STL format
        // Binary STL: 80 bytes header + 4 bytes triangle count + (triangles * 50 bytes)
        let isAscii = header.toLowerCase() === "solid";
        
        if (isAscii && arrayBuffer.byteLength > 84) {
          // Read triangle count from bytes 80-84
          const triangleCount = new DataView(arrayBuffer).getUint32(80, true);
          const expectedBinarySize = 80 + 4 + (triangleCount * 50);
          
          // If size matches binary format, it's actually binary despite "solid" header
          if (Math.abs(arrayBuffer.byteLength - expectedBinarySize) < 10) {
            isAscii = false;
          }
        }

        let loadedGeometry: BufferGeometry;
        if (isAscii) {
          const text = new TextDecoder().decode(arrayBuffer);
          loadedGeometry = loader.parse(text);
        } else {
          loadedGeometry = loader.parse(arrayBuffer);
        }

        // Compute normals for proper lighting
        loadedGeometry.computeVertexNormals();

        // Center, scale, and prepare orientation data
        loadedGeometry.computeBoundingBox();
        const boundingBox = loadedGeometry.boundingBox;

        if (boundingBox) {
          const center = boundingBox.getCenter(new Vector3());
          const originalSize = boundingBox.getSize(new Vector3());

          // Detect orientation: if Y is smallest, model is Z-up and needs rotation
          const needsRotation =
            originalSize.y < originalSize.x && originalSize.y < originalSize.z;

          loadedGeometry.translate(-center.x, -center.y, -center.z);

          // Scale to fit within 5 units
          const maxSize = Math.max(
            originalSize.x,
            originalSize.y,
            originalSize.z
          );
          const scaledSize = originalSize.clone();

          if (maxSize > 5) {
            const scale = 5 / maxSize;
            loadedGeometry.scale(scale, scale, scale);
            scaledSize.multiplyScalar(scale);
          }

          setOrientationData({ originalSize, scaledSize, needsRotation });
        }

        setGeometry(loadedGeometry);
      } catch (err: unknown) {
        console.error("Error loading STL file:", err);
        setError(
          new Error(
            `Could not load ${url}: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          )
        );
      }
    };

    loadSTL();
  }, [url]);

  // Find base function extracted for reuse
  const findBase = useCallback(() => {
    if (!groupRef.current || !geometry || !orientationData) return;

    const { scaledSize } = orientationData;

    // Analyze geometry to find flattest face by looking at vertex distribution
    const positions = geometry.attributes.position.array;

    // For each axis direction, find vertices on the extreme face and calculate flatness
    interface Vertex {
      x: number;
      y: number;
      z: number;
    }

    const faces: {
      [key: string]: { vertices: Vertex[]; sum: number; count: number };
    } = {
      yDown: { vertices: [], sum: 0, count: 0 },
      yUp: { vertices: [], sum: 0, count: 0 },
      xNeg: { vertices: [], sum: 0, count: 0 },
      xPos: { vertices: [], sum: 0, count: 0 },
      zNeg: { vertices: [], sum: 0, count: 0 },
      zPos: { vertices: [], sum: 0, count: 0 },
    };

    // Find min/max bounds
    let minY = Infinity,
      maxY = -Infinity;
    let minX = Infinity,
      maxX = -Infinity;
    let minZ = Infinity,
      maxZ = -Infinity;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i],
        y = positions[i + 1],
        z = positions[i + 2];
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }

    const threshold = 0.01; // Vertices within this distance from extreme are "on the face"

    // Collect vertices on each extreme face
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i],
        y = positions[i + 1],
        z = positions[i + 2];

      if (Math.abs(y - minY) < threshold)
        faces.yDown.vertices.push({ x, y, z });
      if (Math.abs(y - maxY) < threshold) faces.yUp.vertices.push({ x, y, z });
      if (Math.abs(x - minX) < threshold) faces.xNeg.vertices.push({ x, y, z });
      if (Math.abs(x - maxX) < threshold) faces.xPos.vertices.push({ x, y, z });
      if (Math.abs(z - minZ) < threshold) faces.zNeg.vertices.push({ x, y, z });
      if (Math.abs(z - maxZ) < threshold) faces.zPos.vertices.push({ x, y, z });
    }

    // Calculate flatness score: more vertices on face = flatter, plus check variance
    const calculateFlatness = (verts: Vertex[], axis: "x" | "y" | "z") => {
      if (verts.length < 10) return 0; // Not enough vertices

      // Calculate variance in the perpendicular axes
      let sum = 0,
        sumSq = 0;
      verts.forEach((v) => {
        const val = axis === "x" ? v.x : axis === "y" ? v.y : v.z;
        sum += val;
        sumSq += val * val;
      });
      const mean = sum / verts.length;
      const variance = sumSq / verts.length - mean * mean;

      // Lower variance = flatter, more vertices = better base
      return verts.length / (1 + variance * 100);
    };

    const scores = {
      yDown: calculateFlatness(faces.yDown.vertices, "y"),
      yUp: calculateFlatness(faces.yUp.vertices, "y"),
      xNeg: calculateFlatness(faces.xNeg.vertices, "x"),
      xPos: calculateFlatness(faces.xPos.vertices, "x"),
      zNeg: calculateFlatness(faces.zNeg.vertices, "z"),
      zPos: calculateFlatness(faces.zPos.vertices, "z"),
    };

    // Find best base (highest score)
    let bestBase = "yDown";
    let bestScore = 0;

    Object.entries(scores).forEach(([face, score]) => {
      if (score > bestScore) {
        bestScore = score;
        bestBase = face;
      }
    });

    console.log("Base analysis:", scores, "Best:", bestBase);

    // Apply rotation to orient flat surface to be the base (facing down)
    groupRef.current.rotation.set(0, 0, 0);

    switch (bestBase) {
      case "yUp":
        // Top is flattest, flip 180
        groupRef.current.rotation.z = Math.PI;
        groupRef.current.position.y = scaledSize.y / 2;
        baseRotationRef.current = { x: 0, y: 0, z: Math.PI };
        basePositionYRef.current = scaledSize.y / 2;
        break;
      case "yDown":
        // Bottom is already correct
        groupRef.current.position.y = scaledSize.y / 2;
        baseRotationRef.current = { x: 0, y: 0, z: 0 };
        basePositionYRef.current = scaledSize.y / 2;
        break;
      case "xPos":
        groupRef.current.rotation.z = -Math.PI / 2;
        groupRef.current.position.y = scaledSize.x / 2;
        baseRotationRef.current = { x: 0, y: 0, z: -Math.PI / 2 };
        basePositionYRef.current = scaledSize.x / 2;
        break;
      case "xNeg":
        groupRef.current.rotation.z = Math.PI / 2;
        groupRef.current.position.y = scaledSize.x / 2;
        baseRotationRef.current = { x: 0, y: 0, z: Math.PI / 2 };
        basePositionYRef.current = scaledSize.x / 2;
        break;
      case "zPos":
        groupRef.current.rotation.x = Math.PI / 2;
        groupRef.current.position.y = scaledSize.z / 2;
        baseRotationRef.current = { x: Math.PI / 2, y: 0, z: 0 };
        basePositionYRef.current = scaledSize.z / 2;
        break;
      case "zNeg":
        groupRef.current.rotation.x = -Math.PI / 2;
        groupRef.current.position.y = scaledSize.z / 2;
        baseRotationRef.current = { x: -Math.PI / 2, y: 0, z: 0 };
        basePositionYRef.current = scaledSize.z / 2;
        break;
    }
  }, [geometry, orientationData]);

  // Apply rotation and positioning after geometry is loaded
  useEffect(() => {
    if (geometry && orientationData && !autoOrientComplete) {
      // Run find base logic on initial load
      findBase();
      setAutoOrientComplete(true);
    }
  }, [geometry, orientationData, autoOrientComplete, findBase]);

  // Re-run find base when triggered manually
  useEffect(() => {
    if (findBaseTrigger && findBaseTrigger > 0) {
      findBase();
    }
  }, [findBaseTrigger, findBase]);

  // Apply model rotation from controls (combined with base and default rotation)
  useEffect(() => {
    if (groupRef.current) {
      const baseRot = baseRotationRef.current;
      const defaultRot = defaultRotation || { x: 0, y: 0, z: 0 };
      const controlRot = modelRotation || { x: 0, y: 0, z: 0 };
      
      groupRef.current.rotation.set(
        baseRot.x + (defaultRot.x * Math.PI) / 180 + (controlRot.x * Math.PI) / 180,
        baseRot.y + (defaultRot.y * Math.PI) / 180 + (controlRot.y * Math.PI) / 180,
        baseRot.z + (defaultRot.z * Math.PI) / 180 + (controlRot.z * Math.PI) / 180
      );
    }
  }, [modelRotation, defaultRotation, autoOrientComplete]);

  if (error) {
    throw error;
  }

  if (!geometry) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#4f46e5" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}
