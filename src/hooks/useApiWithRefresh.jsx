import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useApiLogin } from "./useApiLogin";

const getCookie = (name) => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

export const useApiWithRefresh = (url) => {
  const { token } = useApiLogin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const tokenValue = token || getCookie("token");

      const response = await axios.get(url, {
        headers: tokenValue
          ? { Authorization: `Bearer ${tokenValue}` }
          : undefined,
        withCredentials: true,
      });

      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const refresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refresh };
};
