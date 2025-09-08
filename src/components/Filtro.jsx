import React, { useState } from "react";
import DetalleFiltro from "./DetalleFiltro";

export default function Filtro({
  searchTerm,
  setSearchTerm,
  handleAplicarFiltros,
  filtradoPais,
  filtradoEscuela,
  filtradoEstado,
}) {
  const [toggle, setToggle] = useState(false);

  function handleToggle() {
    setToggle(!toggle);
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar estudiantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 lg:h-5 lg:w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 sm:flex-none px-3 py-2 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm lg:text-base cursor-pointer">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nuevo Estudiante
            </button>
            <button
              onClick={handleToggle}
              className="flex-1 sm:flex-none px-3 py-2 lg:px-4 lg:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm lg:text-base cursor-pointer"
            >
              {" "}
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filtros
            </button>
          </div>
        </div>
      </div>

      <DetalleFiltro
        display={toggle}
        closeModal={handleToggle}
        aplicarFiltros={handleAplicarFiltros}
      />

      <div className="grid grid-cols-2 gap-1 pb-3">
        <div className="grid gap-1">
          {filtradoPais?.map((pais) => (
            <span
              key={pais}
              className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300"
            >
              {pais}
            </span>
          ))}
        </div>
        <div className="grid gap-1">
          {filtradoEscuela?.map((escuela) => (
            <span
              key={escuela}
              className="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-blue-300"
            >
              {escuela}
            </span>
          ))}
        </div>
        <div className="grid gap-1">
          <span
            className={`${
              filtradoEstado === "Activo"
                ? "bg-green-100 text-green-800"
                : filtradoEstado === "Inactivo"
                ? "bg-red-100 text-red-800"
                : ""
            } text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-blue-300`}
          >
            {filtradoEstado}
          </span>
        </div>
      </div>
    </div>
  );
}
