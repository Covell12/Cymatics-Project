// src/SandSimulation.js
import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import AudioRecorder from "./AudioRecorder";

function SandSimulationScene({ frequencies }) {
  const { scene } = useGLTF("/Cymatic.glb");
  const sandRef = useRef();
  // Store each mesh's initial Y position (keyed by the mesh's uuid)
  const initialPositionsRef = useRef({});

  // Save the initial Y positions once after the scene is loaded
  useEffect(() => {
    if (sandRef.current) {
      sandRef.current.traverse((child) => {
        if (child.isMesh) {
          // Save the original Y position
          initialPositionsRef.current[child.uuid] = child.position.y;
        }
      });
      console.log("Initial positions:", initialPositionsRef.current);
    }
  }, []);

  useFrame(() => {
    if (sandRef.current && frequencies.length > 0) {
      // For debugging, you can uncomment the next line to log the frequencies:
      // console.log("Frequencies:", frequencies);
      
      sandRef.current.traverse((child, index) => {
        if (child.isMesh) {
          // Retrieve the stored original Y position; default to 0 if not found
          const originalY = initialPositionsRef.current[child.uuid] || 0;
          // Get the corresponding frequency value (cycling if there are fewer frequencies than meshes)
          const freqValue = frequencies[index % frequencies.length] || 0;
          // Normalize the frequency value (0 to 1)
          const normalized = freqValue / 255;
          // Calculate displacement with a multiplier (0.5), and clamp to a maximum of 0.2
          const displacement = Math.min(normalized * 0.5, 0.2);
          // Update the mesh's Y position while preserving its original position
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
