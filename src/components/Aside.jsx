import React, { useState, useEffect } from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import axios from "../config/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import CambiarContraseña from "../components/CambiarContraseña";
import EditarPerfil from "../components/EditarPerfil";
import Logout from "./Logout";

export default function Aside({ usuario, setToggleModal }) {
  const { user, logout } = useApiLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/roles");
        setRoles(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching roles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const getRoleName = (roleId) => {
    if (!roleId) return "Administrador";
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Usuario";
  };

  const getUserName = () => {
    if (!user) return "ADMINISTRADOR";

    const firstName = user.f_name || "";
    const middleName = user.m_name || "";
    const firstLastName = user.f_lastname || "";
    const secondLastName = user.s_lastname || "";

    const fullName = [firstName, middleName, firstLastName, secondLastName]
      .filter(Boolean)
      .join(" ");

    return fullName.toUpperCase() || "ADMINISTRADOR";
  };

  const getUserEmail = () => {
    if (!user) return "admin@funval.test";
    return user.email || "admin@funval.test";
  };

  const getUserRoleId = () => {
    if (!user) return null;
    return user.role_id || null;
  };

  const menuItems = [
    { name: "Estudiantes", icon: "👨‍🎓", path: "/estudiantes", class: "flex" },
    {
      name: "Controllers",
      icon: "🧑‍💻",
      path: "/controllers",
      class:
        usuario === 1
          ? "flex"
          : usuario === 2
          ? "hidden"
          : usuario === 3
          ? "hidden"
          : "",
    },
    {
      name: "Reclutadores",
      icon: "👔",
      path: "/reclutadores",
      class:
        usuario === 1
          ? "flex"
          : usuario === 2
          ? "hidden"
          : usuario === 3
          ? "hidden"
          : "",
    },
    {
      name: "Horas de servicio",
      icon: "⏱",
      path: "/horas-servicio",
      class:
        usuario === 1
          ? "flex"
          : usuario === 2
          ? "flex"
          : usuario === 3
          ? "hidden"
          : "",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChangePassword = () => {
    setOpenModal(true);
  };

  const handleEditProfile = () => {
    setOpenEditModal(true);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <aside className="w-80 fixed h-screen bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl p-6 font-sans rounded-xl">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 2xl:p-4 p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col items-center mb-2 gap-2 relative">
            {/* Contenedor de la foto de perfil con el ícono de edición */}
            <div className="relative">
              <div className="w-18 h-18 2xl:w-24 2xl:h-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <span className="text-3xl">👤</span>
              </div>
              {/* Botón de editar perfil */}
              <button
                onClick={handleEditProfile}
                className="absolute -bottom-1 cursor-pointer -right-1 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-md transition-all duration-200 hover:scale-110"
                title="Editar perfil"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>

            <h3 className="font-bold text-gray-800 text-sm mt-1 2xl:text-lg 2xl:mt-2">
              {getUserName()}
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
                {getUserEmail()}
              </p>
            </div>

            <div className="mt-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] 2xl:text-xs font-medium">
              {loading
                ? "Cargando..."
                : error
                ? "Error al cargar rol"
                : getRoleName(getUserRoleId())}
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
                className={` ${
                  item.class
                } items-center p-1 2xl:py-3 2xl:px-4 rounded-lg cursor-pointer transition-all duration-200 group ${
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
          <div className="flex flex-col justify-center gap-">
            <div className="flex justify-center">
              <Logout logout={logout} />
            </div>
            <button
              onClick={() => setToggleModal(true)}
              className={` ${
                usuario === 1
                  ? "flex"
                  : usuario === 2
                  ? "hidden"
                  : usuario === 3
                  ? "hidden"
                  : ""
              } justify-center items-center text-sm text-center text-blue-600 hover:text-blue-800 mt-3 cursor-pointer`}
            >
              Nuevo Usuario
            </button>
            <button
              onClick={handleChangePassword}
              className="text-sm text-center text-blue-600 hover:text-blue-800 mt-3 cursor-pointer"
            >
              Cambiar Clave
            </button>
          </div>
        </div>
      </aside>
      <CambiarContraseña open={openModal} onClose={() => setOpenModal(false)} />
      <EditarPerfil
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={user}
      />
    </>
  );
}
