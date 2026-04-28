import { useRef, useState } from "react";

const MAX_DURATION = 180; // 3 minutes

function CameraRecorder({ onVideoReady }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });

      videoRef.current.srcObject = stream;
      setCameraOn(true);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });
        chunksRef.current = [];
        onVideoReady(blob);
      };
    } catch (err) {
      alert("Accès caméra impossible");
      console.error(err);
    }
  };

  const startRecording = () => {
    setSeconds(0);
    mediaRecorderRef.current.start();
    setRecording(true);

    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= MAX_DURATION) {
          stopRecording();
          return s;
        }
        return s + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject
      .getTracks()
      .forEach((t) => t.stop());

    setRecording(false);
    setCameraOn(false);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>💻 Caméra avancée (PC / Android récents)</h3>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#000",
          borderRadius: 8,
        }}
      />

      {!cameraOn && (
        <button onClick={activateCamera}>
          Activer la caméra
        </button>
      )}

      {cameraOn && !recording && (
        <button onClick={startRecording}>
          Démarrer l’enregistrement
        </button>
      )}

      {recording && (
        <>
          <p>
            ⏱️ {seconds}s / 180s
          </p>
          <button onClick={stopRecording}>
            Arrêter (max 3 minutes)
          </button>
        </>
      )}
    </div>
  );
}

export default CameraRecorder;