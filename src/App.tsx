import { useState } from "react";
import Scene3D from "./components/Scene3D";
import Controls from "./components/Controls";
import "./App.css";

function App() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-screen h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-white">3D Viewer</h1>
          <p className="text-sm text-gray-300 mt-1">
            Interactive 3D scene with React Three Fiber
          </p>
        </div>
      </div>

      {/* Controls Panel */}
      <Controls
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        gridVisible={gridVisible}
        setGridVisible={setGridVisible}
        onReset={handleReset}
      />

      {/* 3D Scene */}
      <div className="w-full h-full pt-20">
        <Scene3D
          key={resetTrigger}
          autoRotate={autoRotate}
          gridVisible={gridVisible}
        />
      </div>

      {/* Info Footer */}
      <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
        Built with React Three Fiber + Three.js
      </div>
    </div>
  );
}

export default App;
