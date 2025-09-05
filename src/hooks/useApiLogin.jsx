import { useState } from "react";
import axios from "axios";

// Funciones para manejar cookies
const setCookie = (name, value, hours = 1) => {
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/;`;
};

const getCookie = (name) => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const useApiLogin = () => {
  const [user, setUser] = useState(() => {
    const cookie = getCookie("user");
    return cookie ? JSON.parse(cookie) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://www.hs-service.api.crealape.com/api/v1/auth/login",
        { email, password },
        { withCredentials: true } // importante si el backend usa cookies
      );

      const data = response.data;

      // Token opcional: si viene en JSON lo guardamos en estado y cookie
      const tokenValue = data.token || data.accessToken || data.result?.token;
      if (tokenValue) setCookie("token", tokenValue, 1);

      // Guardar usuario
      const userData = data.user ||
        data.data?.user ||
        data.result?.user || {
          email,
          name: "Usuario",
          role: "user",
        };
      setCookie("user", JSON.stringify(userData), 1);
      setUser(userData);

      setLoading(false);
      return { user: userData, token: tokenValue || getCookie("token") };
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
  };

  const isAuthenticated = () => !!getCookie("user");

  return { login, logout, loading, error, user, isAuthenticated };
};
