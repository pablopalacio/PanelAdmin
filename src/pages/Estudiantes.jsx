import { useState } from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import { useNavigate } from "react-router-dom";
import Aside from "../components/Aside";
import Tablas from "../components/tablas";
import Filtro from "../components/Filtro";
import { useApi } from "../hooks/useApi";

function Estudiantes() {
  const { data, loading, error } = useApi(
    "https://www.hs-service.api.crealape.com/api/v1/students"
  );
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
  console.log(data);
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
            Estudiantes
          </h1>
          <p className="text-gray-600 text-sm ">
            Gestiona la información de los estudiantes
          </p>
        </header>

        {/* Busqueda y filtros */}
        <div>
          <Filtro />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-6">
          {[
            {
              number: `${data.length}`,
              label: "Total Estudiantes",
              color: "blue",
              bgColor: "bg-blue-100",
              textColor: "text-blue-600",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            },
            {
              number: "38",
              label: "Estudiantes Activos",
              color: "green",
              bgColor: "bg-green-100",
              textColor: "text-green-600",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              number: "7",
              label: "Estudiantes Inactivos",
              color: "orange",
              bgColor: "bg-red-100",
              textColor: "text-red-600",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              number: "92%",
              label: "Tasa Cumplimiento",
              color: "purple",
              bgColor: "bg-purple-100",
              textColor: "text-purple-600",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div
                  className={`${stat.bgColor} p-2 lg:p-3 rounded-lg mr-3 lg:mr-4`}
                >
                  <svg
                    className={`w-4 h-4 lg:w-6 lg:h-6 ${stat.textColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={stat.icon}
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold text-gray-800">
                    {stat.number}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla estudiantes */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 lg:mb-6">
            <h2 className="text-base lg:text-xl font-semibold text-gray-800">
              Lista de Estudiantes
            </h2>
            <div className="flex space-x-2 self-end sm:self-auto">
              <button className="p-1 lg:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Tablas />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estudiantes;
