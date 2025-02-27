import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import AudioRecorder from "./AudioRecorder";

const SandSimulation = () => {
  const { scene } = useGLTF("/Cymatic.glb"); // Load your GLB model
  const sandRef = useRef();
  const [frequencies, setFrequencies] = useState([]);

  useFrame(() => {
    if (sandRef.current && frequencies.length > 0) {
      sandRef.current.children.forEach((particle, index) => {
        if (index < frequencies.length) {
          const displacement = frequencies[index] / 255; // Normalize frequency data
          particle.position.y = displacement * 2; // Make sand move
        }
      });
    }
  });

  return (
    <Canvas>
      <ambientLight />
      <AudioRecorder onData={setFrequencies} />
      <primitive object={scene} ref={sandRef} />
    </Canvas>
  );
};

export default SandSimulation;
