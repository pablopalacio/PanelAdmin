import { useState, useEffect } from "react";
import axios from "axios";
import { useApiLogin } from "./useApiLogin"; // para obtener token

const getCookie = (name) => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

export const useApi = (url) => {
  const { token } = useApiLogin(); // token desde hook
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const tokenValue = token || getCookie("token"); // usa token del hook o cookie

        const response = await axios.get(url, {
          headers: tokenValue
            ? { Authorization: `Bearer ${tokenValue}` }
            : undefined,
          withCredentials: true, // importante si backend usa cookies
        });

        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token]);

  return { data, loading, error };
};
