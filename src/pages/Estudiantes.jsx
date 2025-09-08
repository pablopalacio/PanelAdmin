import { useEffect, useState } from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import { useNavigate } from "react-router-dom";
import Aside from "../components/Aside";
import Tablas from "../components/Tablas";
import Filtro from "../components/Filtro";
import { useApi } from "../hooks/useApi";

function Estudiantes() {
  const { data, loading, error } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/students"
  );
  const { data: service } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/services"
  );

  const [filtradoPais, setFiltradoPais] = useState([]);
  const [filtradoEscuela, setFiltradoEscuela] = useState([]);
  const [filtradoEstado, setFiltradoEstado] = useState("");
  const [aplicarFiltros, setAplicarFiltros] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState([]);
  const [inactive, setInactive] = useState([]);
  const [cumplimiento, setCumplimiento] = useState("");

  const { user, logout } = useApiLogin();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filtro de activos e inactivos
  useEffect(() => {
    setActive(data?.filter((e) => e.status === "activo"));
    setInactive(data?.filter((e) => e.status === "inactivo"));
  }, [data]);

  // Cálculo de cumplimiento
  useEffect(() => {
    const total = (active?.length * 20) / 100;
    let suma = 0;
    service?.forEach((e) => (suma += e.amount_approved));
    setCumplimiento(total ? suma / total : 0);
  }, [service, active]);

  // Función para aplicar filtros desde Filtro.jsx
  const handleAplicarFiltros = (pais, escuela, estado) => {
    setFiltradoPais(pais);
    setFiltradoEscuela(escuela);
    setFiltradoEstado(estado);
    setAplicarFiltros((prev) => !prev); // forzar re-render en Tablas
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Botón menú celular */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay para celular */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Aside />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col p-4 ml-0 lg:p-6 w-full lg:ml-80">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-4 lg:mb-6 text-center">
          <h1 className="text-xl lg:text-3xl font-bold text-gray-800 pb-2">
            Estudiantes
          </h1>
          <p className="text-gray-600 text-sm">
            Gestiona la información de los estudiantes
          </p>
        </header>

        {/* Busqueda y filtros */}
        <Filtro
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleAplicarFiltros={handleAplicarFiltros}
          filtradoPais={filtradoPais}
          filtradoEscuela={filtradoEscuela}
          filtradoEstado={filtradoEstado}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-6">
          {/* Aquí puedes poner tus tarjetas de estadísticas */}
        </div>

        {/* Tabla estudiantes */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
          <h2 className="text-base lg:text-xl font-semibold text-gray-800 mb-4">
            Lista de Estudiantes
          </h2>
          <div className="overflow-x-auto">
            <Tablas
              data={data}
              searchTerm={searchTerm}
              filtradoPais={filtradoPais}
              filtradoEscuela={filtradoEscuela}
              filtradoEstado={filtradoEstado}
              aplicarFiltros={aplicarFiltros}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estudiantes;
