// src/AudioRecorder.js
import { useState, useEffect, useRef, useCallback } from "react";

const AudioRecorder = ({ onData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateFrequencyData = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        onData([...dataArrayRef.current]); // Pass frequency array upward
        if (isRecording) {
          requestAnimationFrame(updateFrequencyData);
        }
      };

      updateFrequencyData();
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  }, [onData, isRecording]);

  const stopRecording = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => {
      stopRecording();
    };
  }, [isRecording, startRecording, stopRecording]);

  return (
    <button onClick={() => setIsRecording((prev) => !prev)}>
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};

export default AudioRecorder;
