import { useEffect, useState } from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import { useNavigate } from "react-router-dom";
import Aside from "../components/Aside";
import ControlPerfil from "../components/ControlPerfil";
import TablaHorasDeServicio from "../components/TablaHorasDeServicio";
import axiosInstance from "../config/axiosConfig";

function PerfilEstudiante() {
  const [data, setData] = useState([]);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cumplimiento, setCumplimiento] = useState("50");
  const { user, logout } = useApiLogin();
  const [active, setActive] = useState([]);
  const [inactive, setInactive] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para cargar datos
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar estudiantes
      const studentsResponse = await axiosInstance.get("/students");
      setData(studentsResponse.data);

      // Cargar servicios
      const servicesResponse = await axiosInstance.get("/services");
      setService(servicesResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filtro de activos e inactivos
  useEffect(() => {
    const filtradoA = data?.filter((e) => e.status === "activo");
    setActive(filtradoA);

    const filtradoI = data?.filter((e) => e.status === "inactivo");
    setInactive(filtradoI);
  }, [data]);

  // Cálculo de cumplimiento
  useEffect(() => {
    const total = active?.length ? (active.length * 20) / 100 : 1;
    let suma = 0;
    service?.forEach((e) => {
      suma += e.amount_approved;
    });
    setCumplimiento(suma / total);
  }, [service, active]);

  // Mostrar loading mientras se cargan los datos
  /*  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
 */
  // Mostrar error si hay problema en la carga
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500">Error al cargar los datos: {error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Boton menu celular */}
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

      {/* Overlay para cel */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <Aside usuario={user.role_id} />
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-col p-4 ml-0 lg:p-6 w-full lg:ml-80">
        <ControlPerfil />
        <TablaHorasDeServicio />
      </div>
    </div>
  );
}

export default PerfilEstudiante;
