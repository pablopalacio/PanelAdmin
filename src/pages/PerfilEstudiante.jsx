import { useEffect, useState } from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import { useNavigate } from "react-router-dom";
import Aside from "../components/Aside";
import { useApi } from "../hooks/useApi";
import ControlPerfil from "../components/ControlPerfil";

function Estudiantes() {
  const { data, loading, error } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/students"
  );
  const { data: service } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/services"
  );
  useEffect(() => {
    let suma = 0;
    service?.forEach((e) => {
      suma += e.amount_approved;
    });

    setCumplimiento(suma / ((active?.length * 20) / 100));
    console.log(suma);
  }, [service]);
  const [cumplimiento, setCumplimiento] = useState("50");
  const { user, logout } = useApiLogin();
  const [active, setActive] = useState([]);
  const [inactive, setInactive] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const filtradoA = data?.filter((e) => e.status === "activo");
    setActive(filtradoA);
    console.log(filtradoA);
  }, [data]);
  useEffect(() => {
    const filtradoI = data?.filter((e) => e.status === "inactivo");
    setInactive(filtradoI);
  }, [data]);
  const total = active?.length ? (active.length * 20) / 100 : 1;
  useEffect(() => {
    let suma = 0;
    service?.forEach((e) => {
      suma += e.amount_approved;
    });
    setCumplimiento(suma / total);
    console.log(suma);
  }, [service]);
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
        <Aside />
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-col p-4 ml-0 lg:p-6 w-full lg:ml-80">
        <ControlPerfil />
      </div>
    </div>
  );
}

export default Estudiantes;
