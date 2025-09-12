import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";

export default function DetalleFiltro({
  display,
  aplicarFiltros,
  closeModal,
  tempPais,
  setTempPais,
  tempEscuela,
  setTempEscuela,
  tempEstado,
  setTempEstado,
}) {
  const [paises, setPaises] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(true);
  const [loadingEscuelas, setLoadingEscuelas] = useState(true);
  const [errorPaises, setErrorPaises] = useState(null);
  const [errorEscuelas, setErrorEscuelas] = useState(null);

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        setLoadingPaises(true);
        const response = await axiosInstance.get("/countries");
        setPaises(response.data);
        setErrorPaises(null);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setErrorPaises(err.response?.data?.message || "Error al cargar países");
      } finally {
        setLoadingPaises(false);
      }
    };

    const fetchEscuelas = async () => {
      try {
        setLoadingEscuelas(true);
        const response = await axiosInstance.get("/schools/");
        setEscuelas(response.data);
        setErrorEscuelas(null);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setErrorEscuelas(
          err.response?.data?.message || "Error al cargar escuelas"
        );
      } finally {
        setLoadingEscuelas(false);
      }
    };

    if (display) {
      fetchPaises();
      fetchEscuelas();
    }
  }, [display]);

  const handlePushPais = (p) => {
    setTempPais((prev) =>
      prev.includes(p) ? prev.filter((pais) => pais !== p) : [...prev, p]
    );
  };

  const handlePushEscuela = (e) => {
    setTempEscuela((prev) =>
      prev.includes(e) ? prev.filter((esc) => esc !== e) : [...prev, e]
    );
  };

  const handleAplicar = () => {
    aplicarFiltros(tempPais, tempEscuela, tempEstado);
    closeModal();
  };

  if (!display) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full mb-4 border border-gray-200 animate-fade-in-down">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* --- Sección Países --- */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-gray-800 border-b pb-1.5">
            País
          </h3>
          {loadingPaises ? (
            <div className="text-gray-500 text-xs">Cargando países...</div>
          ) : errorPaises ? (
            <div className="text-red-500 text-xs">{errorPaises}</div>
          ) : (
            <div className="flex gap-1.5 flex-wrap">
              {paises.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePushPais(p.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    //
                    tempPais.includes(p.name)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Sección Escuelas --- */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-gray-800 border-b pb-1.5">
            Escuela
          </h3>
          {loadingEscuelas ? (
            <div className="text-gray-500 text-xs">Cargando escuelas...</div>
          ) : errorEscuelas ? (
            <div className="text-red-500 text-xs">{errorEscuelas}</div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {escuelas.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handlePushEscuela(s.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    tempEscuela.includes(s.name)
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- Sección Estado --- */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-gray-800 border-b pb-1.5">
            Estado
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTempEstado("Activo")}
              className={`flex-1 px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200 transform hover:scale-105 ${
                tempEstado === "Activo"
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Activo
            </button>
            <button
              onClick={() => setTempEstado("Inactivo")}
              className={`flex-1 px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200 transform hover:scale-105 ${
                //
                tempEstado === "Inactivo"
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Inactivo
            </button>
          </div>
        </div>
      </div>

      {/* --- Botón de Aplicar --- */}
      <div className=" mt-3 pt-3 flex justify-center">
        <button
          onClick={handleAplicar}
          className="px-2 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
