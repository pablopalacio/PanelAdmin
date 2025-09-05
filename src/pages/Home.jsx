import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          background: "#f4f4f4",
        }}
      >
        <h2>Bienvenido a Funval</h2>
        <button
          onClick={handleLoginClick}
          className=" py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md cursor-pointer"
        >
          Acceder
        </button>
      </header>
      <main style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Página principal</h1>
      </main>
    </div>
  );
}

export default Home;
