import { useState, useCallback } from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const defaultOptions = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include", // 🔐 Esto activa el envío/recepción de cookies
      };

      const response = await fetch(url, { ...defaultOptions, ...options });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const post = useCallback(
    (url, body, options = {}) => {
      return request(url, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    [request]
  );

  return {
    loading,
    error,
    post,
  };
};
