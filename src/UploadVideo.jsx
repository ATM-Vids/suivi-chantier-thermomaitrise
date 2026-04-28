import { useState } from "react";
import { supabase } from "./lib/supabase";

function UploadVideo() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Veuillez sélectionner une vidéo.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const filePath = `chantier-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("videos")
      .upload(filePath, file);

    if (error) {
      setMessage("Erreur lors de l'envoi de la vidéo.");
      console.error(error);
    } else {
      setMessage("✅ Vidéo envoyée avec succès !");
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Envoyer une vidéo du chantier</h2>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer la vidéo"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadVideo;
``