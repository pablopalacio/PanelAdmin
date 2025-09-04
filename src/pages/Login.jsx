import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiLogin } from "../hooks/useApiLogin";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const { login, loading, error } = useApiLogin();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await login(usuario, clave);

    if (result && result.token) {
      navigate("/estudiantes"); 
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <div style={{ border: "1px solid #ccc", padding: "2rem", borderRadius: "8px", width: "300px" }}>
        <h2 style={{ textAlign: "center" }}>Bienvenido</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", padding: "10px", background: "#4caf50", color: "white", border: "none", cursor: "pointer" }}
        >
          {loading ? "Ingresando..." : "Acceder"}
        </button>
        {error && <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>{error}</p>}
        <p style={{ color: "blue", textAlign: "center", marginTop: "10px", cursor: "pointer" }}>
          ¿Olvidaste tu contraseña?
        </p>
      </div>
    </div>
  );
}

export default Login;