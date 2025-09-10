import axios from "axios";
import { useState } from "react";
import { useApiLogin } from "./useApiLogin";

const getCookie = (name) => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

export const useApiNewUser = () => {
  const { token } = useApiLogin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async (url, nuevoUsuario) => {
    setLoading(true);
    setError(null);

    try {
      const tokenValue = token || getCookie("token");

      const response = await axios.post(url, nuevoUsuario, {
        headers: {
          "Content-Type": "application/json",
          ...(tokenValue && { Authorization: `Bearer ${tokenValue}` }),
        },
        withCredentials: true,
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createUser };
};
