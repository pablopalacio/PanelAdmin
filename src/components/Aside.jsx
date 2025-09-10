import React, { useState } from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import { useNavigate, useLocation } from "react-router-dom";
import CambiarContraseña from "../components/CambiarContraseña";

export default function Aside() {
  const { user, logout } = useApiLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const [openModal, setOpenModal] = useState(false);

  const menuItems = [
    { name: "Estudiantes", icon: "👨‍🎓", path: "/estudiantes" },
    { name: "Controllers", icon: "🧑‍💻", path: "/controllers" },
    { name: "Reclutadores", icon: "👔", path: "/reclutadores" },
    { name: "Horas de servicio", icon: "⏱️", path: "/horas-servicio" },
    { name: "Escuela", icon: "🏫", path: "/escuela" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <aside className="w-80 fixed h-screen bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl p-6 font-sans rounded-xl">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 2xl:p-4 p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col items-center mb-2 gap-2">
            <div className="w-18 h-18 2xl:w-24 2xl:h-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <span className="text-3xl">👤</span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm mt-1 2xl:text-lg 2xl:mt-2">
              {user?.name?.toUpperCase() || "ADMINISTRADOR"}
            </h3>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs 2xl:text-sm text-gray-500">
                {user?.email || "admin@funval.test"}
              </p>
            </div>
            <div className="mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] 2xl:text-xs font-medium">
              Administrador
            </div>
          </div>
        </div>

        <div className="mt-10 2xl:mt-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 pl-3">
            Menú Principal
          </h4>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center p-1 2xl:py-3 2xl:px-4 rounded-lg cursor-pointer transition-all duration-200 group ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                    : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                }`}
              >
                <span className="text-sm 2xl:text-xl mr-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-auto transition-transform ${
                    isActive(item.path)
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-blue-500"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </li>
            ))}
          </ul>
          <div className="flex flex-col justify-center">
            <button
              onClick={handleLogout}
              className=" w-40 2xl:w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-2 2xl:py-3 rounded-xl text-xs 2xl:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center mt-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              CERRAR SESIÓN
            </button>

            <button className="text-sm text-center text-blue-600 hover:text-blue-800 mt-3 cursor-pointer">
              Cambiar Clave
            </button>
          </div>
        </div>
      </aside>
      <CambiarContraseña open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
