import { useState } from "react";
import { useApi } from "./useApi";

export const useApiLogin = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const { post, loading, error } = useApi();

  const login = async (email, password) => {
    try {
      const data = await post(
        "https://www.hs-service.api.crealape.com/api/v1/auth/login",
        { email, password }
      );

      const userData = data.user ||
        data.data?.user ||
        data.result?.user || {
          email,
          name: "Usuario",
          role: "user",
        };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { user: userData };
    } catch (err) {
      console.error("❌ Error en login:", err);
      throw new Error(err.message || "Error al iniciar sesión");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");

    // Eliminar cookie manualmente
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const isAuthenticated = () => {
    return !!document.cookie.includes("token=") || !!user;
  };

  return {
    login,
    logout,
    loading,
    error,
    user,
    isAuthenticated,
  };
};
