import { useState } from "react";
import axiosInstance from "../config/axiosConfig";

const setCookie = (name, value, hours = 1) => {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/;`;
};

const getCookie = (name) => {
  const cookieString = document.cookie;
  const cookieMatch = cookieString.match(
    new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)
  );
  return cookieMatch ? decodeURIComponent(cookieMatch[2]) : null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const useApiLogin = () => {
  const [user, setUser] = useState(() => {
    const userCookie = getCookie("user");
    return userCookie ? JSON.parse(userCookie) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Primero hacemos login para obtener el token
      const loginResponse = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const loginData = loginResponse.data;

      // Guardar el token
      const tokenValue =
        loginData.token || loginData.accessToken || loginData.result?.token;
      if (tokenValue) {
        setCookie("token", tokenValue, 1);
        // Configurar el token en axiosInstance para futuras requests
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenValue}`;
      }

      // 2. Luego obtenemos el perfil del usuario para tener los datos completos
      const profileResponse = await axiosInstance.get("/auth/profile");
      const userData = profileResponse.data;

      // Guardar usuario en cookie
      setCookie("user", JSON.stringify(userData), 1);
      setUser(userData);

      setLoading(false);
      return {
        user: userData,
        token: tokenValue || getCookie("token"),
        roleId: userData.role_id,
      };
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw new Error(err.message || "Error al iniciar sesión");
    }
  };

  const logout = () => {
    setUser(null);
    deleteCookie("user");
    deleteCookie("token");
    // Remover el token de axiosInstance
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  const isAuthenticated = () => !!getCookie("user");

  // Función para obtener el ID del rol del usuario actual
  const getRoleId = () => {
    if (!user) {
      const userCookie = getCookie("user");
      if (userCookie) {
        const userData = JSON.parse(userCookie);
        return userData.role_id || null;
      }
      return null;
    }
    return user.role_id || null;
  };

  // Función para verificar si el usuario es admin (role_id = 1)
  const isAdmin = () => {
    const roleId = getRoleId();
    return roleId === 1;
  };

  // Función para verificar si el usuario es student (role_id = 4)
  const isStudent = () => {
    const roleId = getRoleId();
    return roleId === 4;
  };

  // Función para verificar si el usuario es controller (role_id = 2)
  const isController = () => {
    const roleId = getRoleId();
    return roleId === 2;
  };

  // Función para verificar si el usuario es recruiter (role_id = 3)
  const isRecruiter = () => {
    const roleId = getRoleId();
    return roleId === 3;
  };

  return {
    login,
    logout,
    loading,
    error,
    user,
    isAuthenticated,
    getRoleId,
    isAdmin,
    isStudent,
    isController,
    isRecruiter,
  };
};
