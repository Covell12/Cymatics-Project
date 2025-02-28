// src/SandSimulation.js
import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import AudioRecorder from "./AudioRecorder";

function SandSimulationScene({ frequencies }) {
  const { scene } = useGLTF("/Cymatic.glb");
  const sandRef = useRef();
  const initialPositionsRef = useRef({});

  // Save initial Y positions for all meshes once the scene loads
  useEffect(() => {
    if (sandRef.current) {
      sandRef.current.traverse((child) => {
        if (child.isMesh) {
          initialPositionsRef.current[child.uuid] = child.position.y;
        }
      });
      console.log("Initial positions:", initialPositionsRef.current);
    }
  }, []);

  useFrame(() => {
    if (sandRef.current && frequencies.length > 0) {
      // Log the first frequency value for debugging
      console.log("useFrame, first frequency:", frequencies[0]);
      sandRef.current.traverse((child, index) => {
        if (child.isMesh) {
          const originalY = initialPositionsRef.current[child.uuid] || 0;
          const freqValue = frequencies[index % frequencies.length] || 0;
          const normalized = freqValue / 255;
          // Clamp the displacement so it won't push the mesh too far (max 0.2)
          const displacement = Math.min(normalized * 0.5, 0.2);
          child.position.y = originalY + displacement;
        }
      });
    }
  });

  return <primitive object={scene} ref={sandRef} />;
}

const SandSimulation = () => {
  const [frequencies, setFrequencies] = useState([]);

  return (
    <>
      <Canvas style={{ background: "black" }} camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SandSimulationScene frequencies={frequencies} />
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
        <AudioRecorder onData={setFrequencies} />
      </div>
    </>
  );
};

export default SandSimulation;
