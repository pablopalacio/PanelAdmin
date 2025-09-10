import axios from "axios";

const instance = axios.create({
  baseURL: "https://www.hs-service.api.crealape.com/api/v1",
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    // Acceso directo a las cookies
    const cookieString = document.cookie;
    const cookieMatch = cookieString.match(/(^|;)\s*token\s*=\s*([^;]+)/);

    if (cookieMatch) {
      const token = decodeURIComponent(cookieMatch[2]);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error) {
    // diferente al del profe por si el error no es una respuesta HTTP
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/Login"
    ) {
      // limpiar cookies antes de redirigir para una sesion limpia
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/Login";
    }
    return Promise.reject(error);
  }
);

export default instance;
