import { useState } from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import { useNavigate } from "react-router-dom";
import Aside from "../components/Aside";
import TablaReclutador from "../components/TablaReclutador";

function Reclutador() {
  const { user, logout } = useApiLogin();
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
        {/* Header */}
        <header className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-4 lg:mb-6 text-center">
          <h1 className="text-xl lg:text-3xl font-bold text-gray-800 pb-2">
            Reclutadores
          </h1>
          <p className="text-gray-600 text-sm ">
            Gestiona la información de los Reclutadores
          </p>
        </header>
        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
          <TablaReclutador />
        </div>
      </div>
    </div>
  );
}

export default Reclutador;
