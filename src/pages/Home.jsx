import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#f4f4f4" }}>
        <h2>Bienvenido a Funval</h2>
        <button onClick={() => navigate("/login")}>Acceder</button>
      </header>
      <main style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Página principal</h1>
      </main>
    </div>
  );
}

export default Home;