// src/SandSimulation.js
import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import AudioRecorder from "./AudioRecorder";

function SandSimulationScene({ frequencies }) {
  const { scene } = useGLTF("/Cymatic.glb");
  const sandRef = useRef();

  useFrame(() => {
    // This hook is valid because SandSimulationScene is rendered inside <Canvas>
    if (sandRef.current && frequencies.length > 0) {
      // Traverse all children of the loaded scene and adjust their position based on frequency data.
      sandRef.current.traverse((child, index) => {
        if (child.isMesh) {
          const freqValue = frequencies[index % frequencies.length];
          const displacement = freqValue / 255; // Normalize (0 to 1)
          child.position.y = displacement * 0.5; // Adjust amplitude as needed
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
      <Canvas style={{ background: "black" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SandSimulationScene frequencies={frequencies} />
      </Canvas>
      {/* The AudioRecorder is rendered outside the Canvas, which is fine */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
        <AudioRecorder onData={setFrequencies} />
      </div>
    </>
  );
};

export default SandSimulation;
