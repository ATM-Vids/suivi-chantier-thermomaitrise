import { useState } from "react";
import { supabase } from "./lib/supabase";
import CameraRecorder from "./CameraRecorder";

const MAX_SIZE = 30 * 1024 * 1024; // 30 Mo ≈ 3 minutes

function UploadVideo() {
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadVideo = async (blob) => {
    if (!blob) return;

    if (blob.size > MAX_SIZE) {
      setMessage("❌ Vidéo trop longue (max 3 minutes)");
      return;
    }

    setLoading(true);
    setMessage(null);

    const safeReference = reference
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();

    const fileName = `${
      safeReference || "sans_reference"
    }_${Date.now()}.webm`;

    const { error } = await supabase.storage
      .from("videos")
      .upload(fileName, blob, {
        contentType: blob.type || "video/webm",
        upsert: false,
      });

    if (error) {
      console.error(error);
      setMessage("❌ Erreur lors de l’envoi");
    } else {
      setMessage("✅ Vidéo envoyée avec succès");
      setReference("");
    }

    setLoading(false);
  };

  // ✅ MÉTHODE ANDROID 100 % FIABLE
  const openMobileCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.capture = "environment";
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        uploadVideo(e.target.files[0]);
      }
    };
    input.click();
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Vidéo du chantier</h2>

      <input
        type="text"
        placeholder="Référence dossier / client"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {/* 📱 ANDROID / IPHONE : MÉTHODE FIABLE */}
      <h3>📱 Filmer avec la caméra du téléphone</h3>
      <button onClick={openMobileCamera}>
        Ouvrir la caméra du téléphone
      </button>

      <p style={{ fontSize: 12, opacity: 0.7 }}>
        (Recommandé sur smartphone)
      </p>

      <hr />

      {/* 💻 PC / Android récents */}
      <CameraRecorder onVideoReady={uploadVideo} />

      <hr />

      {/* 📁 Fichier manuel */}
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            uploadVideo(e.target.files[0]);
          }
        }}
      />

      {loading && <p>Envoi en cours…</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadVideo;
``