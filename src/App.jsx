import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Login from "./Login";
import UploadVideo from "./UploadVideo";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenue 👋</h1>
      <p>Vous êtes connecté.</p>

      <UploadVideo />

      <br />

      <button onClick={() => supabase.auth.signOut()}>
        Se déconnecter
      </button>
    </div>
  );
}

export default App;